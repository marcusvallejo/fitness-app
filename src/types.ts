export type MacroSummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

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
};

export type FoodEntry = {
  id: string;
  name: string;
  serving: string;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snack";
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
