import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
};

export function MetricPill({ label, value }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#f4d8c8",
    minWidth: "48%",
  },
  label: {
    fontSize: 12,
    color: "#7b8794",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2933",
  },
});
