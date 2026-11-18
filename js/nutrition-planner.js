/**
 * FITTRACK PRO - NUTRITION & MEAL PLANNER ENGINE
 * Manages daily meal logs, food database, and live macro tracker.
 */

const FOOD_DATABASE = [
  // Proteins
  { name: 'Grilled Chicken Breast (150g)', calories: 247, protein: 46, carbs: 0, fat: 5, category: 'Protein' },
  { name: 'Atlantic Salmon Fillet (180g)', calories: 374, protein: 36, carbs: 0, fat: 24, category: 'Protein' },
  { name: 'Lean Ground Beef 90/10 (150g)', calories: 260, protein: 30, carbs: 0, fat: 15, category: 'Protein' },
  { name: 'Whey Protein Isolate (1 Scoop)', calories: 120, protein: 25, carbs: 2, fat: 1, category: 'Protein' },
  { name: 'Whole Eggs (3 large)', calories: 216, protein: 18, carbs: 1.5, fat: 15, category: 'Protein' },
  { name: 'Egg Whites (200g)', calories: 104, protein: 22, carbs: 1.4, fat: 0.3, category: 'Protein' },
  { name: 'Greek Yogurt 0% Fat (200g)', calories: 118, protein: 20, carbs: 8, fat: 0, category: 'Protein' },
  { name: 'Tuna in Water (1 can 130g)', calories: 150, protein: 32, carbs: 0, fat: 1, category: 'Protein' },
  { name: 'Low Fat Cottage Cheese (200g)', calories: 160, protein: 24, carbs: 6, fat: 4, category: 'Protein' },

  // Carbs
  { name: 'Cooked Jasmine Rice (200g)', calories: 260, protein: 5, carbs: 57, fat: 0.5, category: 'Carbs' },
  { name: 'Rolled Oats (80g dry)', calories: 304, protein: 11, carbs: 54, fat: 5, category: 'Carbs' },
  { name: 'Baked Sweet Potato (200g)', calories: 180, protein: 4, carbs: 41, fat: 0.3, category: 'Carbs' },
  { name: 'Cooked Quinoa (185g)', calories: 222, protein: 8, carbs: 39, fat: 3.5, category: 'Carbs' },
  { name: 'Whole Grain Sourdough (2 slices)', calories: 180, protein: 8, carbs: 36, fat: 1.5, category: 'Carbs' },
  { name: 'Banana (1 medium 120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, category: 'Carbs' },
  { name: 'Blueberries (150g)', calories: 86, protein: 1.1, carbs: 21, fat: 0.5, category: 'Carbs' },

  // Healthy Fats & Veggies
  { name: 'Avocado (1/2 medium 100g)', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'Fats' },
  { name: 'Extra Virgin Olive Oil (1 tbsp)', calories: 120, protein: 0, carbs: 0, fat: 14, category: 'Fats' },
  { name: 'Almonds (30g)', calories: 175, protein: 6, carbs: 6, fat: 15, category: 'Fats' },
  { name: 'Natural Peanut Butter (2 tbsp 32g)', calories: 190, protein: 8, carbs: 7, fat: 16, category: 'Fats' },
  { name: 'Steamed Broccoli (150g)', calories: 52, protein: 4.2, carbs: 10, fat: 0.6, category: 'Veggies' },
  { name: 'Baby Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'Veggies' }
];

class NutritionPlanner {
  constructor() {
    this.log = db.getNutrition();
    this.init();
  }

  init() {
    this.render();
    this.initFoodSelectDropdown();
  }

  initFoodSelectDropdown() {
    const select = document.getElementById('food-quick-select');
    if (!select) return;

    select.innerHTML = '<option value="">-- Choose a wholesome food to log --</option>' +
      FOOD_DATABASE.map((f, i) => `
        <option value="${i}">[${f.category}] ${f.name} (${f.calories} kcal | ${f.protein}g P | ${f.carbs}g C | ${f.fat}g F)</option>
      `).join('');
  }

  addSelectedFoodToMeal() {
    const select = document.getElementById('food-quick-select');
    const mealSelect = document.getElementById('target-meal-slot');
    if (!select || !mealSelect) return;

    const foodIndex = select.value;
    const mealKey = mealSelect.value;

    if (foodIndex === '') {
      showToast('⚠️ Please select a food item to log.');
      return;
    }

    const food = FOOD_DATABASE[foodIndex];
    if (!this.log.meals[mealKey]) {
      this.log.meals[mealKey] = [];
    }

    this.log.meals[mealKey].push({ ...food });
    db.saveNutrition(this.log);
    this.render();
    showToast(`Logged "${food.name}" to ${mealKey.toUpperCase()}!`);
    select.value = '';
  }

  removeFoodItem(mealKey, index) {
    if (this.log.meals[mealKey]) {
      this.log.meals[mealKey].splice(index, 1);
      db.saveNutrition(this.log);
      this.render();
    }
  }

  clearDayLog() {
    if (confirm('Are you sure you want to clear all logged meals for today?')) {
      this.log.meals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      };
      db.saveNutrition(this.log);
      this.render();
      showToast('Daily food log reset.');
    }
  }

  setMacroTargets(cals, p, c, f) {
    this.log.targetCalories = cals;
    this.log.targetProtein = p;
    this.log.targetCarbs = c;
    this.log.targetFat = f;
    db.saveNutrition(this.log);
    this.render();
    showToast('Nutritional targets updated from calculator!');
  }

  calculateTotals() {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    Object.values(this.log.meals).forEach(mealList => {
      mealList.forEach(item => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    };
  }

  render() {
    const totals = this.calculateTotals();
    const targets = {
      calories: this.log.targetCalories || 2600,
      protein: this.log.targetProtein || 180,
      carbs: this.log.targetCarbs || 280,
      fat: this.log.targetFat || 70
    };

    // Update Totals Displays
    const calEl = document.getElementById('nutrition-cals-consumed');
    const calTargetEl = document.getElementById('nutrition-cals-target');
    const calRemainingEl = document.getElementById('nutrition-cals-remaining');

    if (calEl) calEl.textContent = totals.calories.toLocaleString();
    if (calTargetEl) calTargetEl.textContent = targets.calories.toLocaleString();
    if (calRemainingEl) {
      const remaining = targets.calories - totals.calories;
      calRemainingEl.textContent = `${Math.abs(remaining).toLocaleString()} kcal ${remaining >= 0 ? 'remaining' : 'over target'}`;
      calRemainingEl.style.color = remaining >= 0 ? 'var(--accent-primary)' : 'var(--accent-fire)';
    }

    // Update Macro Circular/Bar Displays
    const pVal = document.getElementById('stat-protein-val');
    const cVal = document.getElementById('stat-carbs-val');
    const fVal = document.getElementById('stat-fat-val');

    if (pVal) pVal.textContent = `${totals.protein} / ${targets.protein}g`;
    if (cVal) cVal.textContent = `${totals.carbs} / ${targets.carbs}g`;
    if (fVal) fVal.textContent = `${totals.fat} / ${targets.fat}g`;

    // Progress Bars
    const pBar = document.getElementById('bar-protein-fill');
    const cBar = document.getElementById('bar-carbs-fill');
    const fBar = document.getElementById('bar-fat-fill');

    if (pBar) pBar.style.width = `${Math.min(100, Math.round((totals.protein / targets.protein) * 100))}%`;
    if (cBar) cBar.style.width = `${Math.min(100, Math.round((totals.carbs / targets.carbs) * 100))}%`;
    if (fBar) fBar.style.width = `${Math.min(100, Math.round((totals.fat / targets.fat) * 100))}%`;

    // Render Meals Lists
    const mealKeys = ['breakfast', 'lunch', 'dinner', 'snacks'];
    mealKeys.forEach(key => {
      const listEl = document.getElementById(`meal-list-${key}`);
      if (!listEl) return;

      const items = this.log.meals[key] || [];
      if (items.length === 0) {
        listEl.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0.4rem 0;">No foods logged yet.</p>`;
        return;
      }

      listEl.innerHTML = items.map((item, idx) => `
        <div class="food-item-row">
          <div>
            <strong>${item.name}</strong>
            <div class="food-macros-tag">${item.calories} kcal | ${item.protein}g P • ${item.carbs}g C • ${item.fat}g F</div>
          </div>
          <button onclick="nutritionPlanner.removeFoodItem('${key}', ${idx})" title="Remove" style="color: var(--text-muted); padding: 0.2rem 0.5rem; font-size: 0.9rem;">✕</button>
        </div>
      `).join('');
    });
  }
}

// Global nutrition planner instance
const nutritionPlanner = new NutritionPlanner();
