import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../context/AppState";

export function WorkoutScreen() {
  const { workoutPlan, todaysWorkout, updateWorkoutDay, addWorkoutExercise, removeWorkoutExercise } = useAppState();
  const initialDay = workoutPlan[0];
  const [selectedDayId, setSelectedDayId] = useState(initialDay?.id ?? "");
  const [focusDraft, setFocusDraft] = useState(initialDay?.focus ?? "");
  const [durationDraft, setDurationDraft] = useState(initialDay ? String(initialDay.durationMin) : "");
  const [exerciseDraft, setExerciseDraft] = useState({
    name: "",
    sets: "",
    reps: "",
    load: "",
  });

  const selectedDay = useMemo(
    () => workoutPlan.find((day) => day.id === selectedDayId) ?? workoutPlan[0],
    [selectedDayId, workoutPlan]
  );

  function syncDayDrafts(dayId: string) {
    const day = workoutPlan.find((entry) => entry.id === dayId);
    if (!day) {
      return;
    }
    setSelectedDayId(dayId);
    setFocusDraft(day.focus);
    setDurationDraft(String(day.durationMin));
  }

  function handleSaveDay() {
    if (!selectedDay) {
      return;
    }

    const durationMin = Number(durationDraft);
    if (!Number.isFinite(durationMin) || durationMin <= 0) {
      return;
    }

    updateWorkoutDay(selectedDay.id, {
      focus: focusDraft.trim(),
      durationMin,
    });
  }

  function handleAddExercise() {
    if (!selectedDay) {
      return;
    }

    const sets = Number(exerciseDraft.sets);
    if (!exerciseDraft.name.trim() || !Number.isFinite(sets) || sets <= 0 || !exerciseDraft.reps.trim()) {
      return;
    }

    addWorkoutExercise(selectedDay.id, {
      name: exerciseDraft.name.trim(),
      sets,
      reps: exerciseDraft.reps.trim(),
      load: exerciseDraft.load.trim() || "Bodyweight",
    });

    setExerciseDraft({
      name: "",
      sets: "",
      reps: "",
      load: "",
    });
  }

  return (
    <Screen>
      <SectionCard eyebrow="Today" title="Today's workout">
        {todaysWorkout ? (
          <View style={styles.todayCard}>
            <Text style={styles.day}>{todaysWorkout.day}</Text>
            <Text style={styles.focusHero}>{todaysWorkout.focus}</Text>
            <Text style={styles.duration}>{todaysWorkout.durationMin} min planned</Text>
            {todaysWorkout.exercises.map((exercise) => (
              <Text key={exercise.id} style={styles.exercise}>
                {exercise.name} · {exercise.sets} x {exercise.reps} · {exercise.load}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.copy}>No workout is scheduled for today yet. Use the planner below to build one.</Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Planner" title="Weekly workout cycle">
        <Text style={styles.copy}>
          Pick a day, set the focus and session length, then build the exercise list you want to follow. A future update should let you create as many or as few training days as you want.
        </Text>
        <View style={styles.daySelector}>
          {workoutPlan.map((day) => (
            <Pressable
              key={day.id}
              onPress={() => syncDayDrafts(day.id)}
              style={[styles.dayChip, selectedDay?.id === day.id && styles.dayChipActive]}
            >
              <Text style={[styles.dayChipText, selectedDay?.id === day.id && styles.dayChipTextActive]}>{day.day}</Text>
            </Pressable>
          ))}
        </View>
        {selectedDay ? (
          <View style={styles.editorCard}>
            <TextInput
              value={focusDraft}
              onChangeText={setFocusDraft}
              style={styles.input}
              placeholder="Focus"
              placeholderTextColor="#9aa5b1"
            />
            <TextInput
              value={durationDraft}
              onChangeText={setDurationDraft}
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Minutes"
              placeholderTextColor="#9aa5b1"
            />
            <Pressable onPress={handleSaveDay} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save day</Text>
            </Pressable>

            <View style={styles.exerciseEditor}>
              <Text style={styles.promptTitle}>Add exercise</Text>
              <TextInput
                value={exerciseDraft.name}
                onChangeText={(value) => setExerciseDraft((current) => ({ ...current, name: value }))}
                style={styles.input}
                placeholder="Exercise name"
                placeholderTextColor="#9aa5b1"
              />
              <View style={styles.inputRow}>
                <TextInput
                  value={exerciseDraft.sets}
                  onChangeText={(value) => setExerciseDraft((current) => ({ ...current, sets: value }))}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  placeholder="Sets"
                  placeholderTextColor="#9aa5b1"
                />
                <TextInput
                  value={exerciseDraft.reps}
                  onChangeText={(value) => setExerciseDraft((current) => ({ ...current, reps: value }))}
                  style={[styles.input, styles.halfInput]}
                  placeholder="Reps"
                  placeholderTextColor="#9aa5b1"
                />
              </View>
              <TextInput
                value={exerciseDraft.load}
                onChangeText={(value) => setExerciseDraft((current) => ({ ...current, load: value }))}
                style={styles.input}
                placeholder="Target load"
                placeholderTextColor="#9aa5b1"
              />
              <Pressable onPress={handleAddExercise} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add exercise</Text>
              </Pressable>
            </View>

            {selectedDay.exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseRow}>
                <View style={styles.exerciseMeta}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exercise}>
                    {exercise.sets} x {exercise.reps} · {exercise.load}
                  </Text>
                </View>
                <Pressable onPress={() => removeWorkoutExercise(selectedDay.id, exercise.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}
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
  todayCard: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    padding: 14,
    gap: 6,
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
  focusHero: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2933",
  },
  duration: {
    color: "#7b8794",
    marginBottom: 2,
  },
  daySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fdf2e9",
    borderWidth: 1,
    borderColor: "#f4d8c8",
  },
  dayChipActive: {
    backgroundColor: "#e76f51",
    borderColor: "#e76f51",
  },
  dayChipText: {
    color: "#7b8794",
    fontWeight: "700",
  },
  dayChipTextActive: {
    color: "#fffaf4",
  },
  editorCard: {
    backgroundColor: "#fdf2e9",
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  input: {
    backgroundColor: "#fffaf4",
    borderWidth: 1,
    borderColor: "#f4d8c8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1f2933",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#1f2933",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fffaf4",
    fontWeight: "800",
  },
  exerciseEditor: {
    gap: 10,
    paddingTop: 6,
  },
  addButton: {
    backgroundColor: "#e76f51",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fffaf4",
    fontWeight: "800",
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1e5da",
  },
  exerciseMeta: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2933",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fffaf4",
    borderWidth: 1,
    borderColor: "#f4d8c8",
  },
  deleteButtonText: {
    color: "#7b8794",
    fontWeight: "700",
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
