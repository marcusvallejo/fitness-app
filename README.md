# Forge Fitness

An Expo + React Native foundation for a fitness app focused on:

- calorie and macro tracking
- searchable food catalog support
- weekly workout scheduling
- AI-assisted food photo scanning
- goal-aware calorie adjustment for cutting, maintenance, and bulking
- streaks and progress tracking

## Why this stack

Expo gives you a fast iPhone-first path while keeping Android support open for a later public launch. React Native also lets us share almost all app logic across both platforms.

## MVP feature map

1. Dashboard
   Shows calorie target, macro progress, next workout, and current goal mode.
2. Nutrition
   Logs foods, supports future catalog search, and defines the AI camera scan flow.
3. Workout
   Handles weekly planning and adaptive workout generation.
4. Progress
   Displays streaks, body metrics, and roadmap items for the next phase.

## Recommended backend and AI architecture

- Auth + user data: Supabase or Firebase
- Food catalog: USDA FoodData Central plus Open Food Facts for breadth
- Barcode scanning: device camera + catalog lookup
- AI meal scan: camera capture in app, then send image to a vision model for food recognition and portion estimation
- Workout generation: rules engine first, then optional AI suggestions layered on top

## Suggested next build steps

1. Replace the starter food catalog with a real nutrition API such as USDA FoodData Central or Open Food Facts.
2. Add onboarding for height, weight, age, sex, activity, goal, and gym access.
3. Implement a calorie target calculator using TDEE and desired weekly rate of change.
4. Add camera capture and AI meal analysis confirmation flow.
5. Store workout history and progress photos.
6. Add cloud sync and auth once the single-user flow feels right.
