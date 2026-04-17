import { FoodEntry, GoalProfile, ProgressMetric, WorkoutDay } from "../types";

export const goalProfile: GoalProfile = {
  currentWeightKg: 82,
  targetWeightKg: 78,
  goal: "cut",
  weeklyRateKg: 0.4,
  maintenanceCalories: 2780,
  recommendedCalories: 2330,
};

export const todayFoods: FoodEntry[] = [
  {
    id: "1",
    name: "Greek Yogurt Bowl",
    serving: "300g bowl",
    meal: "Breakfast",
    nutrients: {
      calories: 320,
      protein: 28,
      carbs: 33,
      fat: 7,
      fiber: 6,
      sodium: 120,
      sugar: 19,
    },
  },
  {
    id: "2",
    name: "Chicken Burrito Bowl",
    serving: "1 large bowl",
    meal: "Lunch",
    nutrients: {
      calories: 670,
      protein: 54,
      carbs: 62,
      fat: 19,
      fiber: 11,
      sodium: 780,
      sugar: 4,
    },
  },
  {
    id: "3",
    name: "Whey Protein Shake",
    serving: "1 shake",
    meal: "Snack",
    nutrients: {
      calories: 180,
      protein: 32,
      carbs: 6,
      fat: 3,
      fiber: 1,
      sodium: 150,
      sugar: 2,
    },
  },
];

export const weeklyPlan: WorkoutDay[] = [
  {
    day: "Monday",
    focus: "Upper Strength",
    durationMin: 75,
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "5", load: "80kg" },
      { name: "Weighted Pull-Up", sets: 4, reps: "6", load: "+10kg" },
      { name: "Overhead Press", sets: 3, reps: "6-8", load: "42.5kg" },
    ],
  },
  {
    day: "Tuesday",
    focus: "Lower Strength",
    durationMin: 80,
    exercises: [
      { name: "Back Squat", sets: 4, reps: "5", load: "110kg" },
      { name: "Romanian Deadlift", sets: 3, reps: "8", load: "95kg" },
      { name: "Walking Lunge", sets: 3, reps: "12/leg", load: "20kg DBs" },
    ],
  },
  {
    day: "Thursday",
    focus: "Push Hypertrophy",
    durationMin: 65,
    exercises: [
      { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", load: "30kg DBs" },
      { name: "Cable Fly", sets: 3, reps: "12-15", load: "Moderate" },
      { name: "Triceps Pressdown", sets: 3, reps: "12-15", load: "Moderate" },
    ],
  },
  {
    day: "Saturday",
    focus: "Pull + Conditioning",
    durationMin: 70,
    exercises: [
      { name: "Lat Pulldown", sets: 4, reps: "10", load: "65kg" },
      { name: "Chest-Supported Row", sets: 4, reps: "8-10", load: "40kg DBs" },
      { name: "Assault Bike Intervals", sets: 8, reps: "20s hard / 100s easy", load: "Bodyweight" },
    ],
  },
];

export const progressMetrics: ProgressMetric[] = [
  { label: "Workout streak", value: "16 days", change: "+4 this week" },
  { label: "Average protein", value: "182g", change: "+12g vs last week" },
  { label: "Body weight", value: "82.0kg", change: "-0.6kg this month" },
  { label: "Training volume", value: "14,200kg", change: "+8% vs last week" },
];

export const productRoadmap = [
  "USDA/Open Food Facts search for a large food catalog with barcode support",
  "Camera macro scan using on-device image capture plus a vision model endpoint",
  "Goal engine to recompute maintenance calories and bulking/cutting targets",
  "Adaptive workout generator based on goal, equipment, recovery, and history",
];
