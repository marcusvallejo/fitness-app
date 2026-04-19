import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { defaultUserProfile, foodCatalog, todayFoods, weeklyPlan } from "../data/mockData";
import { FoodCatalogItem, FoodEntry, GoalProfile, MacroSummary, MealType, UserProfile, WorkoutDay, WorkoutExercise } from "../types";
import { calculateGoalProfile } from "../utils/goals";
import { buildFoodEntry, sumMacros } from "../utils/nutrition";

type AddFoodInput = {
  item: FoodCatalogItem;
  amount: number;
  meal: MealType;
};

type AppStateValue = {
  goalProfile: GoalProfile;
  userProfile: UserProfile;
  foodCatalog: FoodCatalogItem[];
  foodEntries: FoodEntry[];
  workoutPlan: WorkoutDay[];
  todaysWorkout?: WorkoutDay;
  totals: MacroSummary;
  hydrated: boolean;
  addFoodEntry: (input: AddFoodInput) => void;
  removeFoodEntry: (entryId: string) => void;
  updateWorkoutDay: (dayId: string, updates: Pick<WorkoutDay, "focus" | "durationMin">) => void;
  addWorkoutExercise: (dayId: string, exercise: Omit<WorkoutExercise, "id">) => void;
  removeWorkoutExercise: (dayId: string, exerciseId: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
};

const FOOD_LOG_STORAGE_KEY = "forge-fitness-food-log";
const WORKOUT_PLAN_STORAGE_KEY = "forge-fitness-workout-plan";
const USER_PROFILE_STORAGE_KEY = "forge-fitness-user-profile";

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(todayFoods);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(weeklyPlan);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadState() {
      try {
        const [savedEntries, savedWorkoutPlan, savedUserProfile] = await Promise.all([
          AsyncStorage.getItem(FOOD_LOG_STORAGE_KEY),
          AsyncStorage.getItem(WORKOUT_PLAN_STORAGE_KEY),
          AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY),
        ]);

        if (savedEntries) {
          setFoodEntries(JSON.parse(savedEntries) as FoodEntry[]);
        }

        if (savedWorkoutPlan) {
          setWorkoutPlan(JSON.parse(savedWorkoutPlan) as WorkoutDay[]);
        }

        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile) as UserProfile);
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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(WORKOUT_PLAN_STORAGE_KEY, JSON.stringify(workoutPlan));
  }, [hydrated, workoutPlan]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
  }, [hydrated, userProfile]);

  const value = useMemo<AppStateValue>(
    () => ({
      goalProfile: calculateGoalProfile(userProfile),
      userProfile,
      foodCatalog,
      foodEntries,
      workoutPlan,
      todaysWorkout: getTodaysWorkout(workoutPlan),
      totals: sumMacros(foodEntries),
      hydrated,
      addFoodEntry: ({ item, amount, meal }) => {
        setFoodEntries((current) => [buildFoodEntry(item, amount, meal), ...current]);
      },
      removeFoodEntry: (entryId) => {
        setFoodEntries((current) => current.filter((entry) => entry.id !== entryId));
      },
      updateWorkoutDay: (dayId, updates) => {
        setWorkoutPlan((current) =>
          current.map((day) => (day.id === dayId ? { ...day, ...updates } : day))
        );
      },
      addWorkoutExercise: (dayId, exercise) => {
        setWorkoutPlan((current) =>
          current.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  exercises: [
                    ...day.exercises,
                    {
                      ...exercise,
                      id: `${dayId}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
                    },
                  ],
                }
              : day
          )
        );
      },
      removeWorkoutExercise: (dayId, exerciseId) => {
        setWorkoutPlan((current) =>
          current.map((day) =>
            day.id === dayId
              ? { ...day, exercises: day.exercises.filter((exercise) => exercise.id !== exerciseId) }
              : day
          )
        );
      },
      updateUserProfile: (profile) => {
        setUserProfile(profile);
      },
    }),
    [foodEntries, hydrated, userProfile, workoutPlan]
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

function getTodaysWorkout(workoutPlan: WorkoutDay[]) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[new Date().getDay()];
  return workoutPlan.find((day) => day.day === today);
}
