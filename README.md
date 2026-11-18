# FitTrack Pro - Modern Athletic Fitness Platform

An all-in-one athletic fitness web application built with modern web standards (HTML5, CSS3, ES6+ JavaScript) and zero required external build dependencies.

---

## 🌟 Key Features

### 1. 🔬 Interactive Clinical Calculators Suite
- **TDEE & Macro Calculator**: Mifflin-St Jeor metabolic model with custom activity multipliers, 5 goal trajectories (Aggressive Cut, Moderate Cut, Recomposition, Lean Bulk, Mass Phase), and 4 dietary blueprints (High-Protein, Balanced, Endurance, Ketogenic).
- **1-Rep Max (1RM) Estimator**: Combined Brzycki and Epley equations calculating 1RM potential and a comprehensive intensity breakdown (60% to 95%) with recommended rep schemes.
- **Karvonen Heart Rate Zones**: Heart Rate Reserve (HRR) computation identifying Zones 1 through 5 (Active Recovery, Aerobic Base / Fat Burn, Tempo, Lactate Threshold, and VO2 Max).
- **US Navy Body Fat % Estimator**: Tape-measurement circumference model for men and women with fitness classification ratings.
- **Sync Button**: One-click "Apply to Nutrition Planner" transfers calculated calorie and macronutrient targets directly to your daily fuel tracker.

### 2. 📋 Exercise Library & Custom Routine Builder
- **20+ Comprehensive Movement Profiles**: Primary and secondary muscles targeted, equipment types, recommended sets/reps, step-by-step form cues, and common mistakes to avoid.
- **Real-Time Search & Muscle Group Filtering**: Instant client-side filtering across Chest, Back, Legs, Shoulders, Arms, and Core.
- **Interactive Slide-Out Routine Drawer**: Adjust sets, reps, and weights on the fly with live calculation of total workout volume (kg) and set count.
- **Active Guided Session**: Step through sets, launch interval timers, and track completed workload.

### 3. ⏱️ Audio-Synthesized HIIT & Rest Timer
- **Zero-Latency Sound Synthesis**: Powered by the native Web Audio API (no external audio files or streaming required). Distinct acoustic beeps for 3-2-1 countdowns, work intervals, rest periods, and celebratory completion fanfares.
- **Interactive SVG Circular Countdown**: Color-shifting progress ring (Orange for prep, Neon Green for work, Cyan for rest).

### 4. 🥗 Daily Nutrition & Macro Fuel Planner
- **Real-Time Caloric Balance**: Dynamic progress rings tracking consumed vs. target calories, protein, carbohydrates, and fats.
- **Nutritious Whole Foods Database**: Quick-add fitness staples (chicken breast, salmon, jasmine rice, sweet potatoes, oats, whey protein, avocado, Greek yogurt) to Breakfast, Lunch, Dinner, or Snacks.
- **Customizable Targets & Daily Reset**: Adjust targets or clear daily meals with one click.

### 5. 📈 Progressive Overload Ledger & PR Tracker
- **Personal Records (PR) Board**: Track your milestone lifts for Barbell Bench Press, Squat, Deadlift, and Overhead Press.
- **Responsive SVG Weight Trajectory Chart**: Interactive data visualization illustrating weight loss / muscle gain trends over time.
- **LocalStorage Data Persistence**: Automatically preserves your profile, PRs, routine, and meal logs locally across browser sessions.

### 6. ⚡ Modern Design & Usability
- **Cyber-Athletic Design System**: Rich dark slate background (`#0a0d14`), electric neon lime (`#22c55e`) and cyan (`#06b6d4`) accents, and glassmorphic card panels.
- **Theme Toggle**: Switch between **Dark Athletic Mode** and **Clean Slate Light Mode** seamlessly.
- **Interactive Transformation Slider**: Drag handle to compare baseline metrics with 12-week recomposition results.
- **Confetti Celebration Engine**: Canvas-based particle animation triggered on PR milestones and completed workouts.
- **Curated Training Splits**: One-click load for Push-Pull-Legs (PPL), Functional Hybrid, and 5x5 Power protocols.
- **Fully Responsive**: Optimized for ultra-wide monitors, laptops, tablets, and mobile smartphones.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave):

```powershell
# In PowerShell:
Start-Process index.html
```

Or serve via any static web server (such as Live Server in VS Code, Python `python -m http.server`, or Node `npx serve`).

---

## 📁 File Structure

```
fittrack/
├── index.html                 # Main web application interface & semantic layout
├── README.md                  # Project overview and documentation
├── css/
│   ├── style.css              # Design tokens, color system, typography & utilities
│   ├── components.css         # UI components (navbar, cards, calculators, modals, timers)
│   └── responsive.css         # Media queries for tablet and mobile devices
└── js/
    ├── app.js                 # App coordinator, event listeners, chart, confetti, themes
    ├── calculators.js         # Mifflin-St Jeor, 1RM, Karvonen HR & US Navy BF algorithms
    ├── data-store.js          # HTML5 LocalStorage persistence wrapper & default models
    ├── exercise-db.js         # Exercise database with biomechanical cues & filter tags
    ├── nutrition-planner.js   # Macro tracker, meal slots & wholesome food logging
    └── workout-tracker.js     # Routine architect, Web Audio synthesizer & HIIT timer
```

---

## 🛡️ Privacy & Performance
- **100% Client-Side**: No user data is sent to external servers; all workouts and personal logs reside safely in your browser's LocalStorage.
- **Zero Third-Party Dependencies**: No bloated frameworks or npm packages required. Instant sub-second load times.
