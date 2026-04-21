import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { defaultUserProfile, foodCatalog, todayFoods, weeklyPlan, initialWeighIns, initialWorkoutCompletions } from "../data/mockData";
import { FoodCatalogItem, FoodEntry, GoalProfile, MacroSummary, MealType, UserProfile, WorkoutDay, WorkoutExercise, WeighIn, WorkoutCompletion } from "../types";
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
  weighIns: WeighIn[];
  workoutCompletions: WorkoutCompletion[];
  currentStreak: number;
  hydrated: boolean;
  addFoodEntry: (input: AddFoodInput) => void;
  removeFoodEntry: (entryId: string) => void;
  updateWorkoutDay: (dayId: string, updates: Pick<WorkoutDay, "focus" | "durationMin">) => void;
  addWorkoutExercise: (dayId: string, exercise: Omit<WorkoutExercise, "id">) => void;
  removeWorkoutExercise: (dayId: string, exerciseId: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  addWeighIn: (weightKg: number, date?: string) => void;
  completeWorkout: (dayId: string) => void;
};

const FOOD_LOG_STORAGE_KEY = "forge-fitness-food-log";
const WORKOUT_PLAN_STORAGE_KEY = "forge-fitness-workout-plan";
const USER_PROFILE_STORAGE_KEY = "forge-fitness-user-profile";
const WEIGH_INS_STORAGE_KEY = "forge-fitness-weigh-ins";
const WORKOUT_COMPLETIONS_STORAGE_KEY = "forge-fitness-workout-completions";

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(todayFoods);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(weeklyPlan);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [weighIns, setWeighIns] = useState<WeighIn[]>(initialWeighIns);
  const [workoutCompletions, setWorkoutCompletions] = useState<WorkoutCompletion[]>(initialWorkoutCompletions);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadState() {
      try {
        const [savedEntries, savedWorkoutPlan, savedUserProfile, savedWeighIns, savedWorkoutCompletions] = await Promise.all([
          AsyncStorage.getItem(FOOD_LOG_STORAGE_KEY),
          AsyncStorage.getItem(WORKOUT_PLAN_STORAGE_KEY),
          AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY),
          AsyncStorage.getItem(WEIGH_INS_STORAGE_KEY),
          AsyncStorage.getItem(WORKOUT_COMPLETIONS_STORAGE_KEY),
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

        if (savedWeighIns) {
          setWeighIns(JSON.parse(savedWeighIns) as WeighIn[]);
        }

        if (savedWorkoutCompletions) {
          setWorkoutCompletions(JSON.parse(savedWorkoutCompletions) as WorkoutCompletion[]);
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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(WEIGH_INS_STORAGE_KEY, JSON.stringify(weighIns));
  }, [hydrated, weighIns]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(WORKOUT_COMPLETIONS_STORAGE_KEY, JSON.stringify(workoutCompletions));
  }, [hydrated, workoutCompletions]);

  const value = useMemo<AppStateValue>(
    () => ({
      goalProfile: calculateGoalProfile(userProfile),
      userProfile,
      foodCatalog,
      foodEntries,
      workoutPlan,
      weighIns,
      workoutCompletions,
      currentStreak: getWorkoutStreak(workoutCompletions),
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
      addWeighIn: (weightKg, date = getLocalDateKey()) => {
        setWeighIns((current) => [
          {
            id: `weighin-${Date.now()}-${Math.round(Math.random() * 1000)}`,
            date,
            weightKg,
          },
          ...current.filter((entry) => entry.date !== date),
        ]);
      },
      completeWorkout: (dayId) => {
        const day = workoutPlan.find((entry) => entry.id === dayId);
        if (!day) {
          return;
        }

        setWorkoutCompletions((current) => [
          {
            id: `completion-${Date.now()}-${Math.round(Math.random() * 1000)}`,
            workoutDayId: day.id,
            dayLabel: day.day,
            focus: day.focus,
            completedAt: new Date().toLocaleString("sv-SE", { hour12: false }).replace(" ", "T"),
            durationMin: day.durationMin,
            exerciseCount: day.exercises.length,
          },
          ...current,
        ]);
      },

    }),
    [foodEntries, hydrated, userProfile, workoutPlan, weighIns, workoutCompletions]
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

function getWorkoutStreak(workoutCompletions: WorkoutCompletion[]) {
  if (workoutCompletions.length === 0) {
    return 0;
  }

  const sortedDates = [...new Set(workoutCompletions.map((entry) => entry.completedAt.slice(0, 10)))].sort().reverse();
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = getLocalDateKey(cursor);
    if (!sortedDates.includes(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getLocalDateKey(date = new Date()) {
  return date.toLocaleDateString("sv-SE");
}
