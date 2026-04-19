import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { MetricPill } from "../components/MetricPill";
import { ProgressBar } from "../components/ProgressBar";
import { weeklyPlan } from "../data/mockData";
import { useAppState } from "../context/AppState";
import { macroProgress } from "../utils/nutrition";

export function DashboardScreen() {
  const { goalProfile, totals, foodEntries, todaysWorkout, userProfile, updateUserProfile } = useAppState();
  const [draftProfile, setDraftProfile] = useState({
    age: String(userProfile.age),
    heightCm: String(userProfile.heightCm),
    weightKg: String(userProfile.weightKg),
    targetWeightKg: String(userProfile.targetWeightKg),
    weeklyRateKg: String(userProfile.weeklyRateKg),
  });

  useEffect(() => {
    setDraftProfile({
      age: String(userProfile.age),
      heightCm: String(userProfile.heightCm),
      weightKg: String(userProfile.weightKg),
      targetWeightKg: String(userProfile.targetWeightKg),
      weeklyRateKg: String(userProfile.weeklyRateKg),
    });
  }, [userProfile]);

  function handleSaveProfile() {
    const age = Number(draftProfile.age);
    const heightCm = Number(draftProfile.heightCm);
    const weightKg = Number(draftProfile.weightKg);
    const targetWeightKg = Number(draftProfile.targetWeightKg);
    const weeklyRateKg = Number(draftProfile.weeklyRateKg);

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(heightCm) ||
      !Number.isFinite(weightKg) ||
      !Number.isFinite(targetWeightKg) ||
      !Number.isFinite(weeklyRateKg) ||
      age <= 0 ||
      heightCm <= 0 ||
      weightKg <= 0 ||
      targetWeightKg <= 0 ||
      weeklyRateKg < 0
    ) {
      return;
    }

    updateUserProfile({
      ...userProfile,
      age,
      heightCm,
      weightKg,
      targetWeightKg,
      weeklyRateKg,
    });
  }

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
        <View style={styles.row}>
          <MetricPill label="Protein" value={`${goalProfile.proteinTarget} g`} />
          <MetricPill label="Carbs" value={`${goalProfile.carbsTarget} g`} />
        </View>
        <View style={styles.row}>
          <MetricPill label="Fats" value={`${goalProfile.fatTarget} g`} />
          <MetricPill label="Weekly pace" value={`${goalProfile.weeklyRateKg} kg`} />
        </View>
        <Text style={styles.supportText}>
          Current mode: {goalProfile.goal}. The engine is set to move at {goalProfile.weeklyRateKg} kg per week.
        </Text>
      </SectionCard>

      <SectionCard eyebrow="Profile" title="Your setup">
        <View style={styles.optionRow}>
          {(["male", "female"] as const).map((sex) => (
            <Pressable
              key={sex}
              onPress={() => updateUserProfile({ ...userProfile, sex })}
              style={[styles.optionChip, userProfile.sex === sex && styles.optionChipActive]}
            >
              <Text style={[styles.optionText, userProfile.sex === sex && styles.optionTextActive]}>{sex}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.fieldGrid}>
          <TextInput
            value={draftProfile.age}
            onChangeText={(value) => setDraftProfile((current) => ({ ...current, age: value }))}
            keyboardType="number-pad"
            placeholder="Age"
            placeholderTextColor="#9aa5b1"
            style={styles.input}
          />
          <TextInput
            value={draftProfile.heightCm}
            onChangeText={(value) => setDraftProfile((current) => ({ ...current, heightCm: value }))}
            keyboardType="decimal-pad"
            placeholder="Height cm"
            placeholderTextColor="#9aa5b1"
            style={styles.input}
          />
          <TextInput
            value={draftProfile.weightKg}
            onChangeText={(value) => setDraftProfile((current) => ({ ...current, weightKg: value }))}
            keyboardType="decimal-pad"
            placeholder="Weight kg"
            placeholderTextColor="#9aa5b1"
            style={styles.input}
          />
          <TextInput
            value={draftProfile.targetWeightKg}
            onChangeText={(value) => setDraftProfile((current) => ({ ...current, targetWeightKg: value }))}
            keyboardType="decimal-pad"
            placeholder="Target kg"
            placeholderTextColor="#9aa5b1"
            style={styles.input}
          />
        </View>
        <View style={styles.optionRow}>
          {(["cut", "maintain", "bulk"] as const).map((goal) => (
            <Pressable
              key={goal}
              onPress={() => updateUserProfile({ ...userProfile, goal })}
              style={[styles.optionChip, userProfile.goal === goal && styles.optionChipActive]}
            >
              <Text style={[styles.optionText, userProfile.goal === goal && styles.optionTextActive]}>{goal}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.optionRow}>
          {(["sedentary", "light", "moderate", "active", "very-active"] as const).map((level) => (
            <Pressable
              key={level}
              onPress={() => updateUserProfile({ ...userProfile, activityLevel: level })}
              style={[styles.optionChip, userProfile.activityLevel === level && styles.optionChipActive]}
            >
              <Text style={[styles.optionText, userProfile.activityLevel === level && styles.optionTextActive]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={draftProfile.weeklyRateKg}
          onChangeText={(value) => setDraftProfile((current) => ({ ...current, weeklyRateKg: value }))}
          keyboardType="decimal-pad"
          placeholder="Weekly rate kg"
          placeholderTextColor="#9aa5b1"
          style={styles.input}
        />
        <Pressable onPress={handleSaveProfile} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save profile</Text>
        </Pressable>
      </SectionCard>

      <SectionCard eyebrow="Nutrition" title="Macro progress">
        <Text style={styles.supportText}>{foodEntries.length} food entries logged today.</Text>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Calories {totals.calories} / {goalProfile.recommendedCalories}</Text>
          <ProgressBar progress={macroProgress(totals.calories, goalProfile.recommendedCalories)} />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Protein {totals.protein} / {goalProfile.proteinTarget}g</Text>
          <ProgressBar progress={macroProgress(totals.protein, goalProfile.proteinTarget)} color="#2a9d8f" />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Carbs {totals.carbs} / {goalProfile.carbsTarget}g</Text>
          <ProgressBar progress={macroProgress(totals.carbs, goalProfile.carbsTarget)} color="#f4a261" />
        </View>
        <View style={styles.macroGroup}>
          <Text style={styles.macroLabel}>Fats {totals.fat} / {goalProfile.fatTarget}g</Text>
          <ProgressBar progress={macroProgress(totals.fat, goalProfile.fatTarget)} color="#264653" />
        </View>
      </SectionCard>

      <SectionCard eyebrow="Training" title="Next workout">
        <Text style={styles.workoutDay}>
          {todaysWorkout ? `${todaysWorkout.day}: ${todaysWorkout.focus}` : `${weeklyPlan[0].day}: ${weeklyPlan[0].focus}`}
        </Text>
        <Text style={styles.supportText}>
          Estimated session length: {todaysWorkout ? todaysWorkout.durationMin : weeklyPlan[0].durationMin} minutes
        </Text>
        {(todaysWorkout ?? weeklyPlan[0]).exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseRow}>
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
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  input: {
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1f2933",
    minWidth: "48%",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
  },
  optionChipActive: {
    backgroundColor: "#e76f51",
    borderColor: "#e76f51",
  },
  optionText: {
    color: "#7b8794",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  optionTextActive: {
    color: "#fffaf4",
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
  saveButton: {
    backgroundColor: "#1f2933",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fffaf4",
    fontWeight: "800",
  },
});
