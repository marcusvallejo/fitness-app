import { StyleSheet, View } from "react-native";

type Props = {
  progress: number;
  color?: string;
};

export function ProgressBar({ progress, color = "#e76f51" }: Props) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(8, progress * 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#efe3d6",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
