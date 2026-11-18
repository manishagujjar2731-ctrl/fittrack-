/**
 * FITTRACK PRO - MAIN APPLICATION SCRIPT
 * Coordinates interactions, UI state, rendering, and event listeners.
 */

// -----------------------------------------------------------------------------
// 1. TOAST NOTIFICATION UTILITY
// -----------------------------------------------------------------------------
function showToast(message, duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// -----------------------------------------------------------------------------
// 2. CELEBRATION CONFETTI ENGINE (Vanilla Canvas)
// -----------------------------------------------------------------------------
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#22c55e', '#06b6d4', '#f97316', '#a855f7', '#fbbf24', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < canvas.height) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    frames++;
    if (active && frames < 180) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// -----------------------------------------------------------------------------
// 3. EXERCISE LIBRARY RENDERING & FILTERING
// -----------------------------------------------------------------------------
let currentCategoryFilter = 'all';
let currentSearchQuery = '';

function renderExerciseLibrary() {
  const grid = document.getElementById('exercise-grid');
  if (!grid) return;

  const filtered = EXERCISES.filter(ex => {
    const matchesCategory = currentCategoryFilter === 'all' ||
      ex.muscle.toLowerCase() === currentCategoryFilter.toLowerCase();

    const matchesSearch = currentSearchQuery === '' ||
      ex.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(currentSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>No exercises found matching "${currentSearchQuery}".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(ex => {
    const diffDots = ex.difficulty === 'Beginner' ? 1 : ex.difficulty === 'Intermediate' ? 2 : 3;

    return `
      <div class="glass-panel exercise-card">
        <div class="exercise-card-header">
          <h4 class="exercise-card-title">${ex.name}</h4>
          <span class="badge badge-green">${ex.muscle}</span>
        </div>
        <div class="exercise-meta">
          <span class="badge badge-cyan">${ex.equipment}</span>
          <span style="font-size: 0.775rem; color: var(--text-muted); align-self: center;">${ex.recommended}</span>
        </div>
        <p class="exercise-instructions">
          <strong>Form:</strong> ${ex.cues}<br>
          <span style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: 0.35rem;">⚠️ Avoid: ${ex.mistake}</span>
        </p>
        <div class="exercise-card-footer">
          <div class="difficulty-indicator">
            <span>${ex.difficulty}</span>
            <div class="difficulty-dots">
              <span class="diff-dot ${diffDots >= 1 ? 'active' : ''}"></span>
              <span class="diff-dot ${diffDots >= 2 ? 'active' : ''}"></span>
              <span class="diff-dot ${diffDots >= 3 ? 'active' : ''}"></span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="workoutTracker.addExerciseToRoutine(EXERCISES.find(e => e.id === '${ex.id}'))">
            + Add to Routine
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initExerciseFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategoryFilter = pill.getAttribute('data-filter') || 'all';
      renderExerciseLibrary();
    });
  });

  const searchInput = document.getElementById('exercise-search-input');
  searchInput?.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    renderExerciseLibrary();
  });
}

// -----------------------------------------------------------------------------
// 4. CALCULATORS INTERACTIVE LOGIC
// -----------------------------------------------------------------------------
function initCalculators() {
  // Tabs switching
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const panes = document.querySelectorAll('.calc-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-target'));
      targetPane?.classList.add('active');
    });
  });

  // TDEE Form Elements
  const tdeeInputs = ['tdee-gender', 'tdee-age', 'tdee-weight', 'tdee-height', 'tdee-activity', 'tdee-goal', 'tdee-diet'];
  tdeeInputs.forEach(id => {
    document.getElementById(id)?.addEventListener('input', runTDEECalc);
  });

  // 1RM Form Elements
  ['onerm-weight', 'onerm-reps'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', run1RMCalc);
  });

  // Heart Rate Form Elements
  ['hr-age', 'hr-resting'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', runHeartRateCalc);
  });

  // Body Fat Form Elements
  ['bf-gender', 'bf-height', 'bf-neck', 'bf-waist', 'bf-hip'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', runBodyFatCalc);
  });

  // Initial runs
  runTDEECalc();
  run1RMCalc();
  runHeartRateCalc();
  runBodyFatCalc();

  // "Apply to Nutrition Planner" Button
  document.getElementById('apply-tdee-to-planner')?.addEventListener('click', () => {
    const res = runTDEECalc();
    if (res && nutritionPlanner) {
      nutritionPlanner.setMacroTargets(res.targetCalories, res.protein.grams, res.carbs.grams, res.fat.grams);
      const nutrSection = document.getElementById('nutrition');
      nutrSection?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function runTDEECalc() {
  const gender = document.getElementById('tdee-gender')?.value || 'male';
  const age = parseFloat(document.getElementById('tdee-age')?.value) || 28;
  const weightKg = parseFloat(document.getElementById('tdee-weight')?.value) || 78;
  const heightCm = parseFloat(document.getElementById('tdee-height')?.value) || 180;
  const activityLevel = document.getElementById('tdee-activity')?.value || 'moderate';
  const goal = document.getElementById('tdee-goal')?.value || 'cut';
  const dietType = document.getElementById('tdee-diet')?.value || 'high_protein';

  const res = Calculators.calculateTDEE({ gender, age, weightKg, heightCm, activityLevel, goal, dietType });

  // Update DOM
  const targetCalsEl = document.getElementById('tdee-res-calories');
  const maintCalsEl = document.getElementById('tdee-res-maint');
  const bmrEl = document.getElementById('tdee-res-bmr');

  if (targetCalsEl) targetCalsEl.textContent = res.targetCalories.toLocaleString();
  if (maintCalsEl) maintCalsEl.textContent = `${res.maintenanceCalories.toLocaleString()} kcal`;
  if (bmrEl) bmrEl.textContent = `${res.bmr.toLocaleString()} kcal`;

  // Macro bars
  const pGrams = document.getElementById('tdee-protein-grams');
  const cGrams = document.getElementById('tdee-carbs-grams');
  const fGrams = document.getElementById('tdee-fat-grams');

  if (pGrams) pGrams.textContent = `${res.protein.grams}g (${res.protein.percentage}%)`;
  if (cGrams) cGrams.textContent = `${res.carbs.grams}g (${res.carbs.percentage}%)`;
  if (fGrams) fGrams.textContent = `${res.fat.grams}g (${res.fat.percentage}%)`;

  const pFill = document.getElementById('tdee-protein-fill');
  const cFill = document.getElementById('tdee-carbs-fill');
  const fFill = document.getElementById('tdee-fat-fill');

  if (pFill) pFill.style.width = `${res.protein.percentage}%`;
  if (cFill) cFill.style.width = `${res.carbs.percentage}%`;
  if (fFill) fFill.style.width = `${res.fat.percentage}%`;

  return res;
}

function run1RMCalc() {
  const weight = parseFloat(document.getElementById('onerm-weight')?.value) || 100;
  const reps = parseInt(document.getElementById('onerm-reps')?.value) || 5;

  const res = Calculators.calculate1RM(weight, reps);

  const displayEl = document.getElementById('onerm-res-display');
  if (displayEl) displayEl.textContent = `${res.oneRepMax} kg`;

  const tbody = document.getElementById('onerm-table-body');
  if (tbody) {
    tbody.innerHTML = res.percentages.map(row => `
      <tr>
        <td><strong>${row.pct}%</strong></td>
        <td>${row.weight} kg</td>
        <td>${row.reps}</td>
        <td style="color: var(--text-muted); font-size: 0.8rem;">${row.desc}</td>
      </tr>
    `).join('');
  }
}

function runHeartRateCalc() {
  const age = parseInt(document.getElementById('hr-age')?.value) || 28;
  const resting = parseInt(document.getElementById('hr-resting')?.value) || 60;

  const res = Calculators.calculateHeartRateZones(age, resting);

  const maxEl = document.getElementById('hr-max-display');
  if (maxEl) maxEl.textContent = `${res.maxHR} BPM`;

  const zoneList = document.getElementById('hr-zone-list');
  if (zoneList) {
    zoneList.innerHTML = res.zones.map(z => `
      <div class="zone-item ${z.cssClass}">
        <div>
          <h5>${z.zone}: ${z.name} <span class="badge" style="font-size: 0.7rem;">${z.pct}</span></h5>
          <p>${z.benefit}</p>
        </div>
        <div class="zone-bpm">${z.range}</div>
      </div>
    `).join('');
  }
}

function runBodyFatCalc() {
  const gender = document.getElementById('bf-gender')?.value || 'male';
  const heightCm = parseFloat(document.getElementById('bf-height')?.value) || 180;
  const neckCm = parseFloat(document.getElementById('bf-neck')?.value) || 38;
  const waistCm = parseFloat(document.getElementById('bf-waist')?.value) || 84;
  const hipCm = parseFloat(document.getElementById('bf-hip')?.value) || 95;

  // Toggle hip row visibility based on gender
  const hipGroup = document.getElementById('bf-hip-group');
  if (hipGroup) {
    hipGroup.style.display = gender === 'female' ? 'flex' : 'none';
  }

  const res = Calculators.calculateBodyFat({ gender, heightCm, waistCm, neckCm, hipCm });

  const numEl = document.getElementById('bf-res-number');
  const catEl = document.getElementById('bf-res-category');

  if (numEl) numEl.textContent = `${res.bodyFatPercent}%`;
  if (catEl) {
    catEl.textContent = res.category;
    catEl.style.color = res.color;
  }
}

// -----------------------------------------------------------------------------
// 5. INTERACTIVE TRANSFORMATION COMPARISON SLIDER
// -----------------------------------------------------------------------------
function initComparisonSlider() {
  const container = document.getElementById('comparison-slider');
  const afterLayer = document.getElementById('comparison-after-layer');
  const handle = document.getElementById('comparison-handle');

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  const updateSliderPos = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const pct = (x / rect.width) * 100;

    afterLayer.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
  };

  const startDrag = (e) => {
    isDragging = true;
    updateSliderPos(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const stopDrag = () => {
    isDragging = false;
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    updateSliderPos(e.clientX || (e.touches && e.touches[0].clientX));
  };

  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });
}

// -----------------------------------------------------------------------------
// 6. SVG WEIGHT & PROGRESS CHART
// -----------------------------------------------------------------------------
function renderProgressChart() {
  const container = document.getElementById('progress-chart-wrapper');
  if (!container) return;

  const weightLogs = [
    { date: 'Oct 01', weight: 83.2 },
    { date: 'Oct 08', weight: 82.5 },
    { date: 'Oct 15', weight: 81.8 },
    { date: 'Oct 22', weight: 81.0 },
    { date: 'Oct 29', weight: 80.2 },
    { date: 'Nov 05', weight: 79.4 },
    { date: 'Nov 12', weight: 78.9 },
    { date: 'Nov 18', weight: 78.2 }
  ];

  const minWeight = 77;
  const maxWeight = 84;
  const width = 640;
  const height = 220;
  const padding = 35;

  const getX = (idx) => padding + (idx * ((width - (padding * 2)) / (weightLogs.length - 1)));
  const getY = (val) => height - padding - (((val - minWeight) / (maxWeight - minWeight)) * (height - (padding * 2)));

  const points = weightLogs.map((item, idx) => `${getX(idx)},${getY(item.weight)}`).join(' ');

  const areaPoints = `${getX(0)},${height - padding} ${points} ${getX(weightLogs.length - 1)},${height - padding}`;

  const circles = weightLogs.map((item, idx) => `
    <circle cx="${getX(idx)}" cy="${getY(item.weight)}" r="5" fill="#22c55e" stroke="#0a0d14" stroke-width="2" />
    <text x="${getX(idx)}" y="${getY(item.weight) - 10}" fill="#22c55e" font-size="11" font-weight="700" text-anchor="middle" font-family="JetBrains Mono">${item.weight}</text>
    <text x="${getX(idx)}" y="${height - 12}" fill="#64748b" font-size="10" text-anchor="middle">${item.date}</text>
  `).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; overflow: visible;">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line x1="${padding}" y1="${getY(84)}" x2="${width - padding}" y2="${getY(84)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
      <line x1="${padding}" y1="${getY(80)}" x2="${width - padding}" y2="${getY(80)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.15)" />

      <!-- Area fill -->
      <polygon points="${areaPoints}" fill="url(#chartGradient)" />

      <!-- Main Trend Line -->
      <polyline points="${points}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Points & Labels -->
      ${circles}
    </svg>
  `;
}

// -----------------------------------------------------------------------------
// 7. PR RECORDS BOARD & LOGGING
// -----------------------------------------------------------------------------
function renderPRBoard() {
  const container = document.getElementById('pr-cards-container');
  if (!container) return;

  const prs = db.getPRs();
  container.innerHTML = prs.map(pr => `
    <div class="pr-card glass-panel">
      <h5>${pr.name}</h5>
      <div class="pr-weight">${pr.weight}<span>${pr.unit || 'kg'}</span></div>
      <div class="pr-date">Logged on ${pr.date}</div>
    </div>
  `).join('');
}

function handlePRFormSubmit(e) {
  e.preventDefault();
  const nameSelect = document.getElementById('pr-lift-select');
  const weightInput = document.getElementById('pr-new-weight');
  if (!nameSelect || !weightInput) return;

  const id = nameSelect.value;
  const name = nameSelect.options[nameSelect.selectedIndex].text;
  const weight = parseFloat(weightInput.value);

  if (!weight || weight <= 0) {
    showToast('⚠️ Please enter a valid weight.');
    return;
  }

  db.savePR({
    id,
    name,
    weight,
    unit: 'kg',
    date: new Date().toISOString().split('T')[0]
  });

  renderPRBoard();
  triggerConfetti();
  showToast(`🔥 New Personal Record recorded for ${name}!`);
  weightInput.value = '';
}

// -----------------------------------------------------------------------------
// 8. PROGRAM LOADER
// -----------------------------------------------------------------------------
const CURATED_PROGRAMS = {
  ppl: [
    { id: 'ex-bench-press', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', sets: 4, reps: 8, weight: 85 },
    { id: 'ex-overhead-press', name: 'Standing Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', sets: 3, reps: 8, weight: 50 },
    { id: 'ex-incline-db-press', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', sets: 3, reps: 10, weight: 30 },
    { id: 'ex-lateral-raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', sets: 4, reps: 15, weight: 12 },
    { id: 'ex-skull-crusher', name: 'EZ-Bar Skull Crusher', muscle: 'Arms', equipment: 'Barbell', sets: 3, reps: 12, weight: 35 }
  ],
  hybrid: [
    { id: 'ex-barbell-squat', name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell', sets: 4, reps: 6, weight: 120 },
    { id: 'ex-pullup', name: 'Wide-Grip Pull-Up', muscle: 'Back', equipment: 'Bodyweight', sets: 4, reps: 10, weight: 0 },
    { id: 'ex-dips-chest', name: 'Parallel Bar Dips', muscle: 'Chest', equipment: 'Bodyweight', sets: 3, reps: 12, weight: 0 },
    { id: 'ex-hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bodyweight', sets: 3, reps: 15, weight: 0 }
  ],
  power5x5: [
    { id: 'ex-barbell-squat', name: 'Barbell Back Squat', muscle: 'Legs', equipment: 'Barbell', sets: 5, reps: 5, weight: 130 },
    { id: 'ex-bench-press', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', sets: 5, reps: 5, weight: 95 },
    { id: 'ex-barbell-row', name: 'Bent-Over Barbell Row', muscle: 'Back', equipment: 'Barbell', sets: 5, reps: 5, weight: 80 }
  ]
};

function loadProgramIntoRoutine(programKey) {
  const exercises = CURATED_PROGRAMS[programKey];
  if (!exercises) return;

  db.saveRoutine(exercises);
  workoutTracker.routine = exercises;
  workoutTracker.updateBadgeCount();
  workoutTracker.renderRoutineList();
  workoutTracker.openRoutineDrawer();
  triggerConfetti();
  showToast('✅ Program loaded successfully into Routine Builder!');
}

// -----------------------------------------------------------------------------
// 9. FAQ ACCORDION & PRICING TOGGLE
// -----------------------------------------------------------------------------
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

function initPricingToggle() {
  const switchBtn = document.getElementById('pricing-switch');
  const proPrice = document.getElementById('price-pro');
  const elitePrice = document.getElementById('price-elite');
  const periodText = document.querySelectorAll('.price-period');

  let isAnnual = false;

  switchBtn?.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchBtn.classList.toggle('active', isAnnual);

    if (isAnnual) {
      if (proPrice) proPrice.textContent = '$14';
      if (elitePrice) elitePrice.textContent = '$49';
      periodText.forEach(p => p.textContent = '/month, billed annually (save 25%)');
      showToast('🎉 Annual discount applied: 25% OFF!');
    } else {
      if (proPrice) proPrice.textContent = '$19';
      if (elitePrice) elitePrice.textContent = '$69';
      periodText.forEach(p => p.textContent = '/month');
    }
  });
}

// -----------------------------------------------------------------------------
// 10. THEME SWITCHER & NAVBAR SCROLL
// -----------------------------------------------------------------------------
function initThemeAndNav() {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('fittrack_theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.innerHTML = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) themeToggle.innerHTML = '☀️';
  }

  themeToggle?.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('fittrack_theme', 'dark');
      themeToggle.innerHTML = '☀️';
      showToast('Switched to Dark Athletic mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('fittrack_theme', 'light');
      themeToggle.innerHTML = '🌙';
      showToast('Switched to Clean Slate mode');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Sticky navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });
}

// -----------------------------------------------------------------------------
// 11. INITIALIZATION ON DOM READY
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initThemeAndNav();
  renderExerciseLibrary();
  initExerciseFilters();
  initCalculators();
  initComparisonSlider();
  renderProgressChart();
  renderPRBoard();
  initFAQ();
  initPricingToggle();

  // Attach PR Form submit
  document.getElementById('pr-entry-form')?.addEventListener('submit', handlePRFormSubmit);

  // Attach newsletter form
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email')?.value;
    if (email) {
      showToast('🔥 Welcome to FitTrack Insider! Training blueprint sent.');
      document.getElementById('newsletter-email').value = '';
    }
  });

  // Quick Action Buttons
  document.getElementById('hero-start-workout')?.addEventListener('click', () => {
    workoutTracker.openRoutineDrawer();
  });

  document.getElementById('hero-calc-cta')?.addEventListener('click', () => {
    document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('start-routine-btn')?.addEventListener('click', () => {
    workoutTracker.startActiveWorkoutSession();
  });

  document.getElementById('open-hiit-timer-btn')?.addEventListener('click', () => {
    workoutTracker.openTimerModal();
  });

  document.getElementById('add-food-btn')?.addEventListener('click', () => {
    nutritionPlanner.addSelectedFoodToMeal();
  });

  document.getElementById('clear-nutrition-btn')?.addEventListener('click', () => {
    nutritionPlanner.clearDayLog();
  });

  console.log('⚡ FitTrack Pro initialized successfully.');
});
