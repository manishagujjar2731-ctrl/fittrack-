/**
 * FITTRACK PRO - DATA STORE & PERSISTENCE
 * Manages localStorage for user profile, PRs, workout history, and meal logs.
 */

const STORAGE_KEYS = {
  PROFILE: 'fittrack_profile',
  ROUTINE: 'fittrack_routine',
  HISTORY: 'fittrack_workout_history',
  PRS: 'fittrack_prs',
  NUTRITION: 'fittrack_nutrition_log',
  THEME: 'fittrack_theme'
};

// Default initial state
const DEFAULT_PROFILE = {
  name: 'Alex Hunter',
  level: 'Elite Athlete',
  streak: 14,
  readiness: 92,
  weight: 78.5,
  height: 180,
  unit: 'metric' // metric or imperial
};

const DEFAULT_PRS = [
  { id: 'bench', name: 'Barbell Bench Press', weight: 110, unit: 'kg', date: '2026-10-14' },
  { id: 'squat', name: 'Barbell Back Squat', weight: 155, unit: 'kg', date: '2026-10-28' },
  { id: 'deadlift', name: 'Conventional Deadlift', weight: 195, unit: 'kg', date: '2026-11-05' },
  { id: 'ohp', name: 'Overhead Press', weight: 75, unit: 'kg', date: '2026-10-19' }
];

const DEFAULT_ROUTINE = [
  { id: 'ex-1', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', sets: 4, reps: 8, weight: 85 },
  { id: 'ex-2', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', sets: 3, reps: 10, weight: 32 },
  { id: 'ex-3', name: 'Dips (Chest Focus)', muscle: 'Chest', equipment: 'Bodyweight', sets: 3, reps: 12, weight: 0 },
  { id: 'ex-4', name: 'Overhead Tricep Extension', muscle: 'Arms', equipment: 'Cable', sets: 3, reps: 12, weight: 25 }
];

const DEFAULT_NUTRITION_LOG = {
  date: new Date().toISOString().split('T')[0],
  targetCalories: 2650,
  targetProtein: 185,
  targetCarbs: 280,
  targetFat: 75,
  meals: {
    breakfast: [
      { name: 'Oatmeal with Blueberries & Honey', calories: 380, protein: 12, carbs: 68, fat: 6 },
      { name: 'Whey Protein Shake (1 Scoop)', calories: 130, protein: 26, carbs: 3, fat: 1.5 }
    ],
    lunch: [
      { name: 'Grilled Chicken Breast (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
      { name: 'Jasmine White Rice (200g cooked)', calories: 260, protein: 5, carbs: 57, fat: 0.5 },
      { name: 'Steamed Broccoli & Olive Oil', calories: 110, protein: 4, carbs: 10, fat: 7 }
    ],
    dinner: [
      { name: 'Atlantic Salmon Fillet (180g)', calories: 380, protein: 36, carbs: 0, fat: 24 },
      { name: 'Roasted Sweet Potato', calories: 220, protein: 4, carbs: 50, fat: 0.5 }
    ],
    snacks: [
      { name: 'Greek Yogurt (0% Fat 200g)', calories: 120, protein: 20, carbs: 8, fat: 0 },
      { name: 'Handful of Almonds (30g)', calories: 175, protein: 6, carbs: 6, fat: 15 }
    ]
  }
};

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      this.save(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRS)) {
      this.save(STORAGE_KEYS.PRS, DEFAULT_PRS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTINE)) {
      this.save(STORAGE_KEYS.ROUTINE, DEFAULT_ROUTINE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NUTRITION)) {
      this.save(STORAGE_KEYS.NUTRITION, DEFAULT_NUTRITION_LOG);
    }
  }

  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }

  getProfile() {
    return this.get(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  updateProfile(updates) {
    const profile = { ...this.getProfile(), ...updates };
    this.save(STORAGE_KEYS.PROFILE, profile);
    return profile;
  }

  getPRs() {
    return this.get(STORAGE_KEYS.PRS, DEFAULT_PRS);
  }

  savePR(pr) {
    const prs = this.getPRs();
    const existingIndex = prs.findIndex(p => p.id === pr.id);
    if (existingIndex >= 0) {
      prs[existingIndex] = { ...prs[existingIndex], ...pr };
    } else {
      prs.push(pr);
    }
    this.save(STORAGE_KEYS.PRS, prs);
    return prs;
  }

  getRoutine() {
    return this.get(STORAGE_KEYS.ROUTINE, DEFAULT_ROUTINE);
  }

  saveRoutine(routine) {
    this.save(STORAGE_KEYS.ROUTINE, routine);
    return routine;
  }

  getNutrition() {
    return this.get(STORAGE_KEYS.NUTRITION, DEFAULT_NUTRITION_LOG);
  }

  saveNutrition(nutrition) {
    this.save(STORAGE_KEYS.NUTRITION, nutrition);
    return nutrition;
  }

  getWorkoutHistory() {
    return this.get(STORAGE_KEYS.HISTORY, [
      { date: '2026-11-16', name: 'Upper Body Hypertrophy', volume: 8420, sets: 18, duration: 52 },
      { date: '2026-11-14', name: 'Legs & Core Power', volume: 11200, sets: 20, duration: 65 },
      { date: '2026-11-12', name: 'Push Protocol A', volume: 7950, sets: 16, duration: 48 },
      { date: '2026-11-10', name: 'Pull Day & Biceps', volume: 9100, sets: 18, duration: 55 }
    ]);
  }

  logCompletedWorkout(workout) {
    const history = this.getWorkoutHistory();
    history.unshift(workout);
    this.save(STORAGE_KEYS.HISTORY, history);

    // Increment streak
    const profile = this.getProfile();
    profile.streak = (profile.streak || 0) + 1;
    this.save(STORAGE_KEYS.PROFILE, profile);
    return history;
  }
}

// Global data store instance
const db = new DataStore();
