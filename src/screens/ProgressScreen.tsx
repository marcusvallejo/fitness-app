import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../context/AppState";
import { productRoadmap } from "../data/mockData";

export function ProgressScreen() {
  const { weighIns, workoutCompletions, currentStreak, addWeighIn } = useAppState();
  const latestWeighIn = weighIns[0];
  const latestWorkout = workoutCompletions[0];
  const recentWeighIns = weighIns.slice(0, 3);
  const recentWorkouts = workoutCompletions.slice(0, 3);
  const [weightInput, setWeightInput] = useState("");

  const metrics = [
    {
      label: "Weigh-ins logged",
      value: String(weighIns.length),
      change: latestWeighIn ? latestWeighIn.date : "No entries yet",
    },
    {
      label: "Completed workouts",
      value: String(workoutCompletions.length),
      change: latestWorkout ? latestWorkout.dayLabel : "No workouts yet",
    },
  ];

  return (
    <Screen>
      <SectionCard eyebrow="Momentum" title="Streaks and progress">
        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
            <Text style={styles.metricChange}>{metric.change}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Check-In" title="Log body weight">
        <TextInput
          value={weightInput}
          onChangeText={setWeightInput}
          placeholder="e.g. 81.4"
          placeholderTextColor="#9aa5b1"
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <Pressable
          style={styles.button}
          onPress={() => {
            const value = Number(weightInput);
            if (!Number.isFinite(value) || value <= 0) {
              return;
            }

            addWeighIn(value);
            setWeightInput("");
          }}
        >
          <Text style={styles.buttonText}>Save weigh-in</Text>
        </Pressable>
      </SectionCard>

      <SectionCard eyebrow="Check-ins" title="Recent weigh-ins">
        {recentWeighIns.length === 0 ? (
          <Text style={styles.emptyText}>No weigh-ins yet.</Text>
        ) : (
          recentWeighIns.map((entry) => (
            <View key={entry.id} style={styles.metricRow}>
              <View>
                <Text style={styles.metricLabel}>{entry.date}</Text>
                <Text style={styles.metricValue}>{entry.weightKg} kg</Text>
              </View>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard eyebrow="Training Log" title="Recent completed workouts">
        {recentWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>No completed workouts yet.</Text>
        ) : (
          recentWorkouts.map((entry) => (
            <View key={entry.id} style={styles.metricRow}>
              <View>
                <Text style={styles.metricLabel}>{entry.dayLabel}</Text>
                <Text style={styles.metricValue}>{entry.focus}</Text>
              </View>
              <Text style={styles.metricChange}>{entry.durationMin} min</Text>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard eyebrow="Launch Path" title="What to build next">
        {productRoadmap.map((item) => (
          <View key={item} style={styles.roadmapItem}>
            <Text style={styles.dot}>-</Text>
            <Text style={styles.roadmapText}>{item}</Text>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  streakBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e76f51",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  streakNumber: {
    color: "#fffaf4",
    fontSize: 32,
    fontWeight: "900",
  },
  streakLabel: {
    color: "#fffaf4",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metricRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1e5da",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  metricLabel: {
    color: "#7b8794",
    marginBottom: 4,
  },
  metricValue: {
    color: "#1f2933",
    fontSize: 18,
    fontWeight: "800",
  },
  metricChange: {
    color: "#2a9d8f",
    fontWeight: "700",
  },
  roadmapItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  dot: {
    fontSize: 18,
    color: "#e76f51",
    lineHeight: 20,
  },
  roadmapText: {
    flex: 1,
    color: "#1f2933",
    lineHeight: 21,
  },
  emptyText: {
    color: "#7b8794",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eadfd3",
    backgroundColor: "#fffaf4",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1f2933",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#e76f51",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fffaf4",
    fontWeight: "800",
  },
});
