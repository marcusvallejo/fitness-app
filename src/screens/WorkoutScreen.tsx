import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { weeklyPlan } from "../data/mockData";

export function WorkoutScreen() {
  return (
    <Screen>
      <SectionCard eyebrow="Planner" title="Weekly workout cycle">
        <Text style={styles.copy}>
          Users can build their own split by week, assign focus days, and attach exercise templates with sets, reps, and target loads.
        </Text>
        {weeklyPlan.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.day}>{day.day}</Text>
              <Text style={styles.focus}>{day.focus}</Text>
            </View>
            <Text style={styles.duration}>{day.durationMin} min planned</Text>
            {day.exercises.map((exercise) => (
              <Text key={exercise.name} style={styles.exercise}>
                {exercise.name} · {exercise.sets} x {exercise.reps} · {exercise.load}
              </Text>
            ))}
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Adaptive Coach" title="Generate a workout">
        <Text style={styles.copy}>
          The workout engine should use goal, experience, available equipment, soreness, and recent volume to produce the day’s plan.
        </Text>
        <View style={styles.promptBox}>
          <Text style={styles.promptTitle}>Example inputs</Text>
          <Text style={styles.promptLine}>Goal: Build muscle while keeping body fat controlled</Text>
          <Text style={styles.promptLine}>Equipment: Full gym</Text>
          <Text style={styles.promptLine}>Time: 60 minutes</Text>
          <Text style={styles.promptLine}>Recovery: Legs sore, upper body fresh</Text>
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1f2933",
  },
  dayCard: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  day: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2933",
  },
  focus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e76f51",
  },
  duration: {
    color: "#7b8794",
    marginBottom: 2,
  },
  exercise: {
    color: "#52606d",
    lineHeight: 20,
  },
  promptBox: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2933",
  },
  promptLine: {
    color: "#52606d",
  },
});
