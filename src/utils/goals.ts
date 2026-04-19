import { ActivityLevel, GoalProfile, Sex, UserProfile } from "../types";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

export function calculateGoalProfile(profile: UserProfile): GoalProfile {
  const bmr = calculateBmr(profile);
  const maintenanceCalories = Math.round(bmr * activityMultipliers[profile.activityLevel]);
  const dailyAdjustment = calculateDailyAdjustment(profile.goal, profile.weeklyRateKg);
  const minimumCalories = profile.sex === "male" ? 1500 : 1200;
  const recommendedCalories = Math.max(minimumCalories, maintenanceCalories + dailyAdjustment);
  const rateIntensity = Math.min(Math.abs(profile.weeklyRateKg), 1);

  const proteinTarget = Math.round(profile.weightKg * getProteinMultiplier(profile.goal, rateIntensity));
  const fatTarget = Math.round(profile.weightKg * getFatMultiplier(profile.goal, rateIntensity));
  const carbsTarget = Math.max(
    0,
    Math.round((recommendedCalories - proteinTarget * 4 - fatTarget * 9) / 4)
  );

  return {
    targetWeightKg: profile.targetWeightKg,
    currentWeightKg: profile.weightKg,
    goal: profile.goal,
    weeklyRateKg: profile.weeklyRateKg,
    maintenanceCalories,
    recommendedCalories,
    proteinTarget,
    carbsTarget,
    fatTarget,
  };
}

function calculateBmr(profile: UserProfile) {
  const sexAdjustment: Record<Sex, number> = {
    male: 5,
    female: -161,
  };

  return 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexAdjustment[profile.sex];
}

function calculateDailyAdjustment(goal: UserProfile["goal"], weeklyRateKg: number) {
  if (goal === "maintain") {
    return 0;
  }

  const signedCalories = Math.round((weeklyRateKg * 7700) / 7);
  return goal === "cut" ? -signedCalories : signedCalories;
}

function getProteinMultiplier(goal: UserProfile["goal"], rateIntensity: number) {
  if (goal === "cut") {
    return 2.1 + rateIntensity * 0.2;
  }

  if (goal === "bulk") {
    return 2 + rateIntensity * 0.05;
  }

  return 2;
}

function getFatMultiplier(goal: UserProfile["goal"], rateIntensity: number) {
  if (goal === "cut") {
    return Math.max(0.65, 0.8 - rateIntensity * 0.1);
  }

  if (goal === "bulk") {
    return 0.85 + rateIntensity * 0.08;
  }

  return 0.8;
}
