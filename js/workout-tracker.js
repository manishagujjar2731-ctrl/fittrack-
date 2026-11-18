/**
 * FITTRACK PRO - WORKOUT TRACKER & HIIT TIMER ENGINE
 * Manages routine construction, live active workout sessions, and audio interval timers.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  beep(freq = 440, duration = 0.15, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis not supported or permitted', e);
    }
  }

  countdownBeep() {
    this.beep(520, 0.12, 'triangle');
  }

  workStartBeep() {
    this.beep(880, 0.35, 'sine');
    setTimeout(() => this.beep(1100, 0.4, 'sine'), 120);
  }

  restStartBeep() {
    this.beep(600, 0.3, 'sine');
  }

  celebrationFanfare() {
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.beep(freq, 0.25, 'triangle'), i * 150);
    });
  }
}

const audioFX = new SoundSynthesizer();

class WorkoutTracker {
  constructor() {
    this.routine = db.getRoutine();
    this.hiitState = {
      prep: 5,
      work: 40,
      rest: 20,
      rounds: 8,
      currentRound: 1,
      phase: 'prep', // prep | work | rest
      timeLeft: 5,
      totalPhaseTime: 5,
      isRunning: false,
      intervalId: null
    };

    this.activeWorkout = {
      inProgress: false,
      startTime: null,
      currentExerciseIdx: 0,
      completedSets: {},
      elapsedSeconds: 0,
      timerInterval: null
    };

    this.initEventListeners();
  }

  initEventListeners() {
    // Open/Close routine drawer
    const trigger = document.getElementById('routine-drawer-trigger');
    const modal = document.getElementById('routine-modal');
    const backdrop = document.getElementById('routine-backdrop');
    const closeBtn = document.getElementById('close-routine-btn');

    if (trigger && modal && backdrop) {
      trigger.addEventListener('click', () => this.openRoutineDrawer());
      closeBtn?.addEventListener('click', () => this.closeRoutineDrawer());
      backdrop.addEventListener('click', () => this.closeRoutineDrawer());
    }

    // HIIT timer controls
    const playPauseBtn = document.getElementById('timer-play-pause');
    const resetBtn = document.getElementById('timer-reset');
    const closeTimerBtn = document.getElementById('close-timer-modal');

    playPauseBtn?.addEventListener('click', () => this.toggleHIIT());
    resetBtn?.addEventListener('click', () => this.resetHIIT());
    closeTimerBtn?.addEventListener('click', () => this.closeTimerModal());
  }

  openRoutineDrawer() {
    document.getElementById('routine-modal')?.classList.add('open');
    document.getElementById('routine-backdrop')?.classList.add('open');
    this.renderRoutineList();
  }

  closeRoutineDrawer() {
    document.getElementById('routine-modal')?.classList.remove('open');
    document.getElementById('routine-backdrop')?.classList.remove('open');
  }

  addExerciseToRoutine(exercise) {
    const existing = this.routine.find(e => e.id === exercise.id);
    if (existing) {
      existing.sets = (existing.sets || 3) + 1;
    } else {
      this.routine.push({
        id: exercise.id,
        name: exercise.name,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        sets: 3,
        reps: 10,
        weight: 20
      });
    }

    db.saveRoutine(this.routine);
    this.updateBadgeCount();
    this.renderRoutineList();
    showToast(`Added "${exercise.name}" to your routine!`);
  }

  removeExerciseFromRoutine(id) {
    this.routine = this.routine.filter(item => item.id !== id);
    db.saveRoutine(this.routine);
    this.updateBadgeCount();
    this.renderRoutineList();
  }

  updateExerciseParam(id, field, value) {
    const item = this.routine.find(e => e.id === id);
    if (item) {
      item[field] = Math.max(1, parseInt(value) || 0);
      db.saveRoutine(this.routine);
      this.renderRoutineVolumeSummary();
    }
  }

  updateBadgeCount() {
    const badge = document.getElementById('routine-count');
    if (badge) {
      badge.textContent = this.routine.length;
    }
  }

  getTotalVolume() {
    return this.routine.reduce((total, item) => {
      return total + (item.sets * item.reps * (item.weight || 0));
    }, 0);
  }

  renderRoutineVolumeSummary() {
    const volEl = document.getElementById('routine-total-volume');
    const setsEl = document.getElementById('routine-total-sets');
    if (volEl) volEl.textContent = `${this.getTotalVolume().toLocaleString()} kg`;
    if (setsEl) setsEl.textContent = this.routine.reduce((acc, i) => acc + (i.sets || 0), 0);
  }

  renderRoutineList() {
    const container = document.getElementById('routine-items-list');
    if (!container) return;

    this.updateBadgeCount();
    this.renderRoutineVolumeSummary();

    if (this.routine.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📋</div>
          <p>Your routine is currently empty.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Browse the Exercise Library below and click <strong>"+ Add to Routine"</strong> to construct your workout!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.routine.map(item => `
      <div class="routine-item" data-id="${item.id}">
        <div class="routine-item-header">
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700;">${item.name}</h4>
            <span style="font-size: 0.75rem; color: var(--accent-primary);">${item.muscle} • ${item.equipment}</span>
          </div>
          <button class="btn-icon" style="width: 32px; height: 32px;" onclick="workoutTracker.removeExerciseFromRoutine('${item.id}')" title="Remove">
            ✕
          </button>
        </div>
        <div class="routine-set-inputs">
          <div class="form-group">
            <label style="font-size: 0.7rem; color: var(--text-muted);">SETS</label>
            <input type="number" min="1" max="20" class="input-control" style="padding: 0.4rem;" value="${item.sets}"
                   onchange="workoutTracker.updateExerciseParam('${item.id}', 'sets', this.value)">
          </div>
          <div class="form-group">
            <label style="font-size: 0.7rem; color: var(--text-muted);">REPS</label>
            <input type="number" min="1" max="100" class="input-control" style="padding: 0.4rem;" value="${item.reps}"
                   onchange="workoutTracker.updateExerciseParam('${item.id}', 'reps', this.value)">
          </div>
          <div class="form-group">
            <label style="font-size: 0.7rem; color: var(--text-muted);">KG</label>
            <input type="number" min="0" max="500" class="input-control" style="padding: 0.4rem;" value="${item.weight || 0}"
                   onchange="workoutTracker.updateExerciseParam('${item.id}', 'weight', this.value)">
          </div>
        </div>
      </div>
    `).join('');
  }

  // HIIT / TABATA TIMER
  openTimerModal(customSettings = null) {
    if (customSettings) {
      this.hiitState = { ...this.hiitState, ...customSettings };
    }
    this.resetHIIT();
    document.getElementById('timer-modal')?.classList.add('active');
  }

  closeTimerModal() {
    this.pauseHIIT();
    document.getElementById('timer-modal')?.classList.remove('active');
  }

  toggleHIIT() {
    audioFX.init();
    if (this.hiitState.isRunning) {
      this.pauseHIIT();
    } else {
      this.startHIIT();
    }
  }

  startHIIT() {
    this.hiitState.isRunning = true;
    const playBtn = document.getElementById('timer-play-pause');
    if (playBtn) playBtn.innerHTML = '⏸ Pause';

    this.hiitState.intervalId = setInterval(() => {
      this.tickHIIT();
    }, 1000);
  }

  pauseHIIT() {
    this.hiitState.isRunning = false;
    clearInterval(this.hiitState.intervalId);
    const playBtn = document.getElementById('timer-play-pause');
    if (playBtn) playBtn.innerHTML = '▶ Start';
  }

  resetHIIT() {
    this.pauseHIIT();
    this.hiitState.phase = 'prep';
    this.hiitState.currentRound = 1;
    this.hiitState.timeLeft = this.hiitState.prep;
    this.hiitState.totalPhaseTime = this.hiitState.prep;
    this.updateHIITDisplay();
  }

  tickHIIT() {
    this.hiitState.timeLeft--;

    // Audio Cues
    if (this.hiitState.timeLeft <= 3 && this.hiitState.timeLeft > 0) {
      audioFX.countdownBeep();
    }

    if (this.hiitState.timeLeft <= 0) {
      // Transition Phase
      if (this.hiitState.phase === 'prep') {
        this.hiitState.phase = 'work';
        this.hiitState.timeLeft = this.hiitState.work;
        this.hiitState.totalPhaseTime = this.hiitState.work;
        audioFX.workStartBeep();
      } else if (this.hiitState.phase === 'work') {
        if (this.hiitState.currentRound >= this.hiitState.rounds) {
          // Completed all rounds
          this.pauseHIIT();
          audioFX.celebrationFanfare();
          triggerConfetti();
          showToast('🎉 HIIT Workout Completed! Outstanding Effort!');
          return;
        }
        this.hiitState.phase = 'rest';
        this.hiitState.timeLeft = this.hiitState.rest;
        this.hiitState.totalPhaseTime = this.hiitState.rest;
        audioFX.restStartBeep();
      } else if (this.hiitState.phase === 'rest') {
        this.hiitState.currentRound++;
        this.hiitState.phase = 'work';
        this.hiitState.timeLeft = this.hiitState.work;
        this.hiitState.totalPhaseTime = this.hiitState.work;
        audioFX.workStartBeep();
      }
    }

    this.updateHIITDisplay();
  }

  updateHIITDisplay() {
    const phaseEl = document.getElementById('timer-phase-text');
    const digitsEl = document.getElementById('timer-digits');
    const roundEl = document.getElementById('timer-round-text');
    const circleBar = document.getElementById('timer-progress-ring');

    if (!digitsEl) return;

    const mins = Math.floor(this.hiitState.timeLeft / 60);
    const secs = this.hiitState.timeLeft % 60;
    digitsEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (phaseEl) {
      phaseEl.textContent = this.hiitState.phase.toUpperCase();
      if (this.hiitState.phase === 'work') {
        phaseEl.style.color = 'var(--accent-primary)';
      } else if (this.hiitState.phase === 'rest') {
        phaseEl.style.color = 'var(--accent-secondary)';
      } else {
        phaseEl.style.color = 'var(--accent-fire)';
      }
    }

    if (roundEl) {
      roundEl.textContent = `Round ${this.hiitState.currentRound} / ${this.hiitState.rounds}`;
    }

    if (circleBar) {
      const radius = 110;
      const circumference = 2 * Math.PI * radius; // ~691
      const progress = (this.hiitState.totalPhaseTime - this.hiitState.timeLeft) / this.hiitState.totalPhaseTime;
      const offset = circumference * (1 - progress);
      circleBar.style.strokeDashoffset = offset;

      if (this.hiitState.phase === 'work') {
        circleBar.style.stroke = 'var(--accent-primary)';
      } else if (this.hiitState.phase === 'rest') {
        circleBar.style.stroke = 'var(--accent-secondary)';
      } else {
        circleBar.style.stroke = 'var(--accent-fire)';
      }
    }
  }

  // START ACTIVE WORKOUT SESSION
  startActiveWorkoutSession() {
    if (this.routine.length === 0) {
      showToast('⚠️ Please add at least one exercise to your routine first.');
      return;
    }
    this.closeRoutineDrawer();

    const workoutName = 'Custom Session - ' + new Date().toLocaleDateString();
    const totalVol = this.getTotalVolume();
    const totalSets = this.routine.reduce((acc, i) => acc + (i.sets || 0), 0);

    // Prompt user confirmation to start or complete
    const confirmStart = confirm(`Ready to start "${workoutName}"?\nTotal Exercises: ${this.routine.length}\nEstimated Volume: ${totalVol} kg\n\nClick OK to begin your guided session!`);
    if (confirmStart) {
      showToast('🚀 Workout session started! Log your sets as you crush them.');
      audioFX.celebrationFanfare();

      // Launch a quick modal or rest timer prompt
      this.openTimerModal({
        prep: 3,
        work: 45,
        rest: 60,
        rounds: totalSets
      });

      // Save to history upon completion option
      const finishBtn = document.getElementById('finish-active-session-btn');
      if (finishBtn) finishBtn.style.display = 'inline-flex';
    }
  }

  completeActiveWorkout() {
    const totalVol = this.getTotalVolume();
    const totalSets = this.routine.reduce((acc, i) => acc + (i.sets || 0), 0);

    db.logCompletedWorkout({
      date: new Date().toISOString().split('T')[0],
      name: 'Custom Strength Session',
      volume: totalVol,
      sets: totalSets,
      duration: 48
    });

    triggerConfetti();
    showToast('🏆 Workout Completed & Logged! Great job!');
    audioFX.celebrationFanfare();

    // Re-render history and stats
    if (window.renderDashboardHistory) {
      window.renderDashboardHistory();
    }
  }
}

// Global workout tracker instance
const workoutTracker = new WorkoutTracker();
