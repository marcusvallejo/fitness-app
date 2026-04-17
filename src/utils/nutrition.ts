import { FoodEntry, MacroSummary } from "../types";

export function sumMacros(entries: FoodEntry[]): MacroSummary {
  return entries.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.nutrients.calories,
      protein: totals.protein + entry.nutrients.protein,
      carbs: totals.carbs + entry.nutrients.carbs,
      fat: totals.fat + entry.nutrients.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function macroProgress(current: number, target: number) {
  return Math.min(current / target, 1);
}
