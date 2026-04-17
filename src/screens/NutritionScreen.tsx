import { StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { todayFoods } from "../data/mockData";

export function NutritionScreen() {
  return (
    <Screen>
      <SectionCard eyebrow="Food Log" title="Search a large catalog">
        <TextInput
          editable={false}
          placeholder="Chicken breast, oats, banana, barcode..."
          placeholderTextColor="#9aa5b1"
          style={styles.search}
        />
        <Text style={styles.helper}>
          MVP note: wire this to USDA FoodData Central or Open Food Facts for a searchable catalog and barcode lookup.
        </Text>
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
        {todayFoods.map((entry) => (
          <View key={entry.id} style={styles.foodRow}>
            <View style={styles.foodMeta}>
              <Text style={styles.foodName}>{entry.name}</Text>
              <Text style={styles.foodServing}>{entry.meal} · {entry.serving}</Text>
            </View>
            <View style={styles.foodStats}>
              <Text style={styles.calories}>{entry.nutrients.calories} kcal</Text>
              <Text style={styles.macros}>
                P {entry.nutrients.protein} · C {entry.nutrients.carbs} · F {entry.nutrients.fat}
              </Text>
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
    gap: 10,
  },
  calories: {
    fontWeight: "800",
    color: "#e76f51",
  },
  macros: {
    color: "#52606d",
  },
});
