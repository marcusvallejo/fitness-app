import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = PropsWithChildren<{
  eyebrow?: string;
  title: string;
}>;

export function SectionCard({ eyebrow, title, children }: Props) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffaf4",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eadfd3",
    shadowColor: "#b15f49",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: "#e76f51",
    marginBottom: 6,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    color: "#1f2933",
    fontWeight: "800",
  },
  content: {
    marginTop: 14,
    gap: 12,
  },
});
