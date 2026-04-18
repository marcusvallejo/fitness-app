export type MacroSummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type NutrientBreakdown = MacroSummary & {
  fiber: number;
  sodium: number;
  sugar: number;
};

export type GoalProfile = {
  targetWeightKg: number;
  currentWeightKg: number;
  goal: "cut" | "maintain" | "bulk";
  weeklyRateKg: number;
  maintenanceCalories: number;
  recommendedCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
};

export type FoodEntry = {
  id: string;
  name: string;
  serving: string;
  meal: MealType;
  nutrients: NutrientBreakdown;
};

export type FoodCatalogItem = {
  id: string;
  name: string;
  brand?: string;
  serving: string;
  baseAmount: number;
  baseUnit: string;
  nutrients: NutrientBreakdown;
};

export type WorkoutDay = {
  day: string;
  focus: string;
  durationMin: number;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    load: string;
  }[];
};

export type ProgressMetric = {
  label: string;
  value: string;
  change: string;
};
