import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { MetricPill } from "../components/MetricPill";
import { ProgressBar } from "../components/ProgressBar";
import { weeklyPlan } from "../data/mockData";
import { useAppState } from "../context/AppState";
import { macroProgress } from "../utils/nutrition";

export function DashboardScreen() {
  const { goalProfile, totals, foodEntries } = useAppState();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Forge Fitness</Text>
        <Text style={styles.headline}>Train with a clear target every day.</Text>
        <Text style={styles.subtitle}>
          Nutrition targets, weekly programming, and AI-assisted tracking in one place.
        </Text>
      </View>

      <SectionCard eyebrow="Today" title="Goal engine">
        <View style={styles.row}>
          <MetricPill label="Current" value={`${goalProfile.currentWeightKg} kg`} />
          <MetricPill label="Target" value={`${goalProfile.targetWeightKg} kg`} />
        </View>
        <View style={styles.row}>
          <MetricPill label="Maintenance" value={`${goalProfile.maintenanceCalories} kcal`} />
          <MetricPill label="Recommended" value={`${goalProfile.recommendedCalories} kcal`} />
        </View>
        <Text style={styles.supportText}>
          Current mode: {goalProfile.goal}. The engine is set to move at {goalProfile.weeklyRateKg} kg per week.
        </Text>
      </SectionCard>

      <SectionCard eyebrow="Nutrition" title="Macro progress">
        <Text style={styles.supportText}>{foodEntries.length} food entries logged today.</Text>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Calories {totals.calories} / {goalProfile.recommendedCalories}</Text>
          <ProgressBar progress={macroProgress(totals.calories, goalProfile.recommendedCalories)} />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Protein {totals.protein} / 190g</Text>
          <ProgressBar progress={macroProgress(totals.protein, 190)} color="#2a9d8f" />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Carbs {totals.carbs} / 240g</Text>
          <ProgressBar progress={macroProgress(totals.carbs, 240)} color="#f4a261" />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Fats {totals.fat} / 70g</Text>
          <ProgressBar progress={macroProgress(totals.fat, 70)} color="#264653" />
        </View>
      </SectionCard>

      <SectionCard eyebrow="Training" title="Next workout">
        <Text style={styles.workoutDay}>{weeklyPlan[0].day}: {weeklyPlan[0].focus}</Text>
        <Text style={styles.supportText}>Estimated session length: {weeklyPlan[0].durationMin} minutes</Text>
        {weeklyPlan[0].exercises.map((exercise) => (
          <View key={exercise.name} style={styles.exerciseRow}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseMeta}>{exercise.sets} sets x {exercise.reps} at {exercise.load}</Text>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  kicker: {
    color: "#e76f51",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "800",
    fontSize: 12,
  },
  headline: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "900",
    color: "#18212b",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#52606d",
    maxWidth: "92%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  supportText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#52606d",
  },
  macroGroup: {
    gap: 8,
  },
  macroLabel: {
    fontSize: 15,
    color: "#1f2933",
    fontWeight: "600",
  },
  workoutDay: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2933",
  },
  exerciseRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1e5da",
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2933",
  },
  exerciseMeta: {
    marginTop: 2,
    color: "#52606d",
  },
});
