import { FoodCatalogItem, FoodEntry, MacroSummary, NutrientBreakdown } from "../types";

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

export function scaleNutrients(nutrients: NutrientBreakdown, multiplier: number): NutrientBreakdown {
  return {
    calories: Math.round(nutrients.calories * multiplier),
    protein: roundToOne(nutrients.protein * multiplier),
    carbs: roundToOne(nutrients.carbs * multiplier),
    fat: roundToOne(nutrients.fat * multiplier),
    fiber: roundToOne(nutrients.fiber * multiplier),
    sodium: Math.round(nutrients.sodium * multiplier),
    sugar: roundToOne(nutrients.sugar * multiplier),
  };
}

export function buildFoodEntry(item: FoodCatalogItem, amount: number, meal: FoodEntry["meal"]): FoodEntry {
  const multiplier = amount / item.baseAmount;

  return {
    id: `${item.id}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    name: item.name,
    serving: `${stripTrailingZeros(amount)}${item.baseUnit === "g" ? "g" : ` ${item.baseUnit}`}`,
    meal,
    nutrients: scaleNutrients(item.nutrients, multiplier),
  };
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10;
}

function stripTrailingZeros(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
