import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { ProgressBar } from "../components/ProgressBar";
import { useAppState } from "../context/AppState";
import { MealType } from "../types";
import { macroProgress } from "../utils/nutrition";

const mealOptions: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function NutritionScreen() {
  const { foodCatalog, foodEntries, totals, goalProfile, addFoodEntry, removeFoodEntry, hydrated } = useAppState();
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("100");
  const [selectedMeal, setSelectedMeal] = useState<MealType>("Lunch");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return foodCatalog.slice(0, 6);
    }

    return foodCatalog
      .filter((item) => {
        const haystack = `${item.name} ${item.brand ?? ""}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [foodCatalog, query]);

  function handleAddFood(itemId: string) {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const selectedItem = foodCatalog.find((item) => item.id === itemId);

    if (!selectedItem) {
      return;
    }

    addFoodEntry({
      item: selectedItem,
      amount: parsedAmount,
      meal: selectedMeal,
    });
  }

  return (
    <Screen>
      <SectionCard eyebrow="Food Log" title="Search a large catalog">
        <TextInput
          placeholder="Chicken breast, oats, banana, barcode..."
          placeholderTextColor="#9aa5b1"
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />
        <View style={styles.controlsRow}>
          <TextInput
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
            placeholder="Amount"
            placeholderTextColor="#9aa5b1"
          />
          <View style={styles.mealRow}>
            {mealOptions.map((meal) => (
              <Pressable
                key={meal}
                onPress={() => setSelectedMeal(meal)}
                style={[styles.mealChip, selectedMeal === meal && styles.mealChipActive]}
              >
                <Text style={[styles.mealChipText, selectedMeal === meal && styles.mealChipTextActive]}>{meal}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text style={styles.helper}>Search the local starter catalog, pick a meal, adjust the amount, and tap add.</Text>
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.catalogRow}>
            <View style={styles.catalogMeta}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodServing}>
                {item.brand ? `${item.brand} · ` : ""}
                {item.serving} · base {item.baseAmount}
                {item.baseUnit === "g" ? "g" : ` ${item.baseUnit}`}
              </Text>
            </View>
            <View style={styles.catalogActions}>
              <Text style={styles.calories}>{item.nutrients.calories} kcal</Text>
              <Pressable onPress={() => handleAddFood(item.id)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="AI Camera" title="Scan a meal">
        <Text style={styles.cameraCopy}>
          Capture a meal photo, send it through an image model, estimate portion size, then let the user confirm before logging.
        </Text>
        <View style={styles.scanCard}>
          <Text style={styles.scanTitle}>Suggested pipeline</Text>
          <Text style={styles.scanLine}>1. Camera capture</Text>
          <Text style={styles.scanLine}>2. AI food recognition + portion estimate</Text>
          <Text style={styles.scanLine}>3. Macro lookup against verified catalog entries</Text>
          <Text style={styles.scanLine}>4. User review and save</Text>
        </View>
      </SectionCard>

      <SectionCard eyebrow="Today" title="Logged meals">
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily totals</Text>
          <Text style={styles.macros}>Calories {totals.calories} / {goalProfile.recommendedCalories}</Text>
          <ProgressBar progress={macroProgress(totals.calories, goalProfile.recommendedCalories)} />
          <Text style={styles.macros}>Protein {totals.protein}g / 190g</Text>
          <ProgressBar progress={macroProgress(totals.protein, 190)} color="#2a9d8f" />
          <Text style={styles.macros}>Carbs {totals.carbs}g / 240g</Text>
          <ProgressBar progress={macroProgress(totals.carbs, 240)} color="#f4a261" />
          <Text style={styles.macros}>Fats {totals.fat}g / 70g</Text>
          <ProgressBar progress={macroProgress(totals.fat, 70)} color="#264653" />
        </View>
        {!hydrated ? <Text style={styles.helper}>Loading saved meals...</Text> : null}
        {foodEntries.map((entry) => (
          <View key={entry.id} style={styles.foodRow}>
            <View style={styles.foodMeta}>
              <Text style={styles.foodName}>{entry.name}</Text>
              <Text style={styles.foodServing}>{entry.meal} · {entry.serving}</Text>
            </View>
            <View style={styles.foodStats}>
              <View style={styles.macroStack}>
                <Text style={styles.calories}>{entry.nutrients.calories} kcal</Text>
                <Text style={styles.macros}>
                  P {entry.nutrients.protein} · C {entry.nutrients.carbs} · F {entry.nutrients.fat}
                </Text>
              </View>
              <Pressable onPress={() => removeFoodEntry(entry.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1f2933",
  },
  helper: {
    fontSize: 14,
    lineHeight: 20,
    color: "#52606d",
  },
  controlsRow: {
    gap: 12,
  },
  amountInput: {
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1f2933",
  },
  mealRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mealChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
  },
  mealChipActive: {
    backgroundColor: "#e76f51",
    borderColor: "#e76f51",
  },
  mealChipText: {
    color: "#7b8794",
    fontWeight: "700",
  },
  mealChipTextActive: {
    color: "#fffaf4",
  },
  cameraCopy: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1f2933",
  },
  scanCard: {
    backgroundColor: "#fdf2e9",
    padding: 16,
    borderRadius: 18,
    gap: 6,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2933",
    marginBottom: 4,
  },
  scanLine: {
    color: "#52606d",
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2933",
  },
  catalogRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1e5da",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  catalogMeta: {
    flex: 1,
    gap: 4,
  },
  catalogActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#e76f51",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: "#fffaf4",
    fontWeight: "800",
  },
  foodRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1e5da",
    gap: 8,
  },
  foodMeta: {
    gap: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2933",
  },
  foodServing: {
    color: "#7b8794",
  },
  foodStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  macroStack: {
    gap: 4,
    flex: 1,
  },
  calories: {
    fontWeight: "800",
    color: "#e76f51",
  },
  macros: {
    color: "#52606d",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#f4d8c8",
    backgroundColor: "#fffaf4",
  },
  removeButtonText: {
    color: "#7b8794",
    fontWeight: "700",
  },
});
