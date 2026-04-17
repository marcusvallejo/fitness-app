import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { progressMetrics, productRoadmap } from "../data/mockData";

export function ProgressScreen() {
  return (
    <Screen>
      <SectionCard eyebrow="Momentum" title="Streaks and progress">
        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>16</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        {progressMetrics.map((metric) => (
          <View key={metric.label} style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
            <Text style={styles.metricChange}>{metric.change}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Launch Path" title="What to build next">
        {productRoadmap.map((item) => (
          <View key={item} style={styles.roadmapItem}>
            <Text style={styles.dot}>•</Text>
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
});
