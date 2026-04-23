export type MacroSummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";

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

export type UserProfile = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: "cut" | "maintain" | "bulk";
  weeklyRateKg: number;
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
  id: string;
  day: string;
  focus: string;
  durationMin: number;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load: string;
};

export type ProgressMetric = {
  label: string;
  value: string;
  change: string;
};

export type WeighIn = {
  id: string;
  date: string;
  weightKg: number;
};

export type WorkoutCompletion = {
  id: string;
  workoutDayId: string;
  dayLabel: string;
  focus: string;
  completedAt: string;
  durationMin: number;
  exerciseCount: number;
};

