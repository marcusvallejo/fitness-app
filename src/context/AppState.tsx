import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { foodCatalog, goalProfile, todayFoods } from "../data/mockData";
import { FoodCatalogItem, FoodEntry, GoalProfile, MacroSummary, MealType } from "../types";
import { buildFoodEntry, sumMacros } from "../utils/nutrition";

type AddFoodInput = {
  item: FoodCatalogItem;
  amount: number;
  meal: MealType;
};

type AppStateValue = {
  goalProfile: GoalProfile;
  foodCatalog: FoodCatalogItem[];
  foodEntries: FoodEntry[];
  totals: MacroSummary;
  hydrated: boolean;
  addFoodEntry: (input: AddFoodInput) => void;
  removeFoodEntry: (entryId: string) => void;
};

const FOOD_LOG_STORAGE_KEY = "forge-fitness-food-log";

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(todayFoods);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadState() {
      try {
        const savedEntries = await AsyncStorage.getItem(FOOD_LOG_STORAGE_KEY);

        if (savedEntries) {
          setFoodEntries(JSON.parse(savedEntries) as FoodEntry[]);
        }
      } finally {
        setHydrated(true);
      }
    }

    loadState();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(FOOD_LOG_STORAGE_KEY, JSON.stringify(foodEntries));
  }, [foodEntries, hydrated]);

  const value = useMemo<AppStateValue>(
    () => ({
      goalProfile,
      foodCatalog,
      foodEntries,
      totals: sumMacros(foodEntries),
      hydrated,
      addFoodEntry: ({ item, amount, meal }) => {
        setFoodEntries((current) => [buildFoodEntry(item, amount, meal), ...current]);
      },
      removeFoodEntry: (entryId) => {
        setFoodEntries((current) => current.filter((entry) => entry.id !== entryId));
      },
    }),
    [foodEntries, hydrated]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}
