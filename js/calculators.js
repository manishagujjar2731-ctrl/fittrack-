/**
 * FITTRACK PRO - CALCULATORS SUITE
 * Scientific calculations for TDEE, Macros, 1RM, Heart Rate Zones, and Body Fat %.
 */

const Calculators = {
  // 1. TDEE & Macronutrient Calculator
  calculateTDEE({ gender, age, weightKg, heightCm, activityLevel, goal, dietType }) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      athlete: 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.55;
    const maintenanceCalories = Math.round(bmr * multiplier);

    // Goal Adjustments
    const goalMultipliers = {
      aggressive_cut: 0.75, // -25%
      cut: 0.85,           // -15%
      maintain: 1.0,       // 0%
      lean_bulk: 1.10,     // +10%
      bulk: 1.20           // +20%
    };

    const goalRatio = goalMultipliers[goal] || 1.0;
    const targetCalories = Math.round(maintenanceCalories * goalRatio);

    // Macronutrient Splits
    // Protein: 4 kcal/g | Carbs: 4 kcal/g | Fat: 9 kcal/g
    let proteinPct = 0.30;
    let carbsPct = 0.40;
    let fatPct = 0.30;

    if (dietType === 'high_protein') {
      proteinPct = 0.35;
      carbsPct = 0.40;
      fatPct = 0.25;
    } else if (dietType === 'keto') {
      proteinPct = 0.25;
      carbsPct = 0.05;
      fatPct = 0.70;
    } else if (dietType === 'endurance') {
      proteinPct = 0.20;
      carbsPct = 0.55;
      fatPct = 0.25;
    }

    const proteinGrams = Math.round((targetCalories * proteinPct) / 4);
    const carbsGrams = Math.round((targetCalories * carbsPct) / 4);
    const fatGrams = Math.round((targetCalories * fatPct) / 9);

    return {
      bmr: Math.round(bmr),
      maintenanceCalories,
      targetCalories,
      protein: { grams: proteinGrams, calories: Math.round(proteinGrams * 4), percentage: Math.round(proteinPct * 100) },
      carbs: { grams: carbsGrams, calories: Math.round(carbsGrams * 4), percentage: Math.round(carbsPct * 100) },
      fat: { grams: fatGrams, calories: Math.round(fatGrams * 9), percentage: Math.round(fatPct * 100) }
    };
  },

  // 2. 1-Rep Max (1RM) Calculator
  calculate1RM(weight, reps) {
    if (reps <= 0 || weight <= 0) return { oneRepMax: 0, percentages: [] };
    if (reps === 1) return { oneRepMax: weight, percentages: this.getPercentages(weight) };

    // Brzycki formula: weight / (1.0278 - (0.0278 * reps))
    const brzycki = weight / (1.0278 - (0.0278 * reps));
    // Epley formula: weight * (1 + (reps / 30))
    const epley = weight * (1 + (reps / 30));

    const avg1RM = Math.round((brzycki + epley) / 2);

    return {
      oneRepMax: avg1RM,
      brzycki: Math.round(brzycki),
      epley: Math.round(epley),
      percentages: this.getPercentages(avg1RM)
    };
  },

  getPercentages(oneRM) {
    const table = [
      { pct: 95, reps: '1 - 2 reps', desc: 'Peak Neural Strength' },
      { pct: 90, reps: '3 - 4 reps', desc: 'Heavy Strength' },
      { pct: 85, reps: '5 - 6 reps', desc: 'Functional Strength / Power' },
      { pct: 80, reps: '7 - 8 reps', desc: 'Hypertrophy & Strength' },
      { pct: 75, reps: '9 - 10 reps', desc: 'Hypertrophy Sweet Spot' },
      { pct: 70, reps: '10 - 12 reps', desc: 'Hypertrophy & Pump' },
      { pct: 65, reps: '12 - 15 reps', desc: 'Muscular Endurance' },
      { pct: 60, reps: '15 - 20 reps', desc: 'Metabolic Conditioning' }
    ];

    return table.map(item => ({
      ...item,
      weight: Math.round(oneRM * (item.pct / 100))
    }));
  },

  // 3. Heart Rate Training Zones (Karvonen formula)
  calculateHeartRateZones(age, restingHR = 60) {
    // Tanaka formula for max HR: 208 - (0.7 * age)
    const maxHR = Math.round(208 - (0.7 * age));
    const hrr = maxHR - restingHR; // Heart Rate Reserve

    const calcZoneBpm = (intensity) => Math.round((hrr * intensity) + restingHR);

    return {
      maxHR,
      restingHR,
      zones: [
        {
          zone: 'Zone 1',
          name: 'Active Recovery',
          range: `${calcZoneBpm(0.50)} - ${calcZoneBpm(0.60)} BPM`,
          pct: '50% - 60%',
          benefit: 'Enhances recovery, promotes blood flow, warm up / cool down.',
          cssClass: 'z1'
        },
        {
          zone: 'Zone 2',
          name: 'Aerobic Base & Fat Oxidation',
          range: `${calcZoneBpm(0.60)} - ${calcZoneBpm(0.70)} BPM`,
          pct: '60% - 70%',
          benefit: 'Maximizes mitochondrial density and fat as primary fuel source.',
          cssClass: 'z2'
        },
        {
          zone: 'Zone 3',
          name: 'Aerobic Tempo & Stamina',
          range: `${calcZoneBpm(0.70)} - ${calcZoneBpm(0.80)} BPM`,
          pct: '70% - 80%',
          benefit: 'Improves cardiovascular efficiency, capillary capacity, and stamina.',
          cssClass: 'z3'
        },
        {
          zone: 'Zone 4',
          name: 'Lactate Threshold & Anaerobic Capacity',
          range: `${calcZoneBpm(0.80)} - ${calcZoneBpm(0.90)} BPM`,
          pct: '80% - 90%',
          benefit: 'Increases high-speed fatigue resistance and anaerobic threshold.',
          cssClass: 'z4'
        },
        {
          zone: 'Zone 5',
          name: 'VO2 Max & Neuromuscular Power',
          range: `${calcZoneBpm(0.90)} - ${maxHR} BPM`,
          pct: '90% - 100%',
          benefit: 'Peak athletic performance, top speed, and maximum oxygen uptake.',
          cssClass: 'z5'
        }
      ]
    };
  },

  // 4. US Navy Body Fat % Estimator
  calculateBodyFat({ gender, heightCm, waistCm, neckCm, hipCm = 0 }) {
    let bfPercent = 0;

    if (gender === 'male') {
      const term1 = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
      bfPercent = (495 / term1) - 450;
    } else {
      const term2 = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm);
      bfPercent = (495 / term2) - 450;
    }

    bfPercent = Math.max(3, Math.min(60, Math.round(bfPercent * 10) / 10));

    let category = 'Fitness';
    let color = '#22c55e';

    if (gender === 'male') {
      if (bfPercent < 6) { category = 'Essential Fat'; color = '#06b6d4'; }
      else if (bfPercent <= 13) { category = 'Athletes'; color = '#22c55e'; }
      else if (bfPercent <= 17) { category = 'Fitness'; color = '#10b981'; }
      else if (bfPercent <= 24) { category = 'Average'; color = '#f97316'; }
      else { category = 'High Body Fat'; color = '#ef4444'; }
    } else {
      if (bfPercent < 14) { category = 'Essential Fat'; color = '#06b6d4'; }
      else if (bfPercent <= 20) { category = 'Athletes'; color = '#22c55e'; }
      else if (bfPercent <= 24) { category = 'Fitness'; color = '#10b981'; }
      else if (bfPercent <= 31) { category = 'Average'; color = '#f97316'; }
      else { category = 'High Body Fat'; color = '#ef4444'; }
    }

    return {
      bodyFatPercent: bfPercent,
      category,
      color
    };
  }
};
