/**
 * FITTRACK PRO - EXERCISE DATABASE
 * Comprehensive library of exercises categorized by muscle groups, equipment, and difficulty.
 */

const EXERCISES = [
  // CHEST
  {
    id: 'ex-bench-press',
    name: 'Barbell Bench Press',
    muscle: 'Chest',
    secondary: 'Triceps, Front Delts',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '3-4 sets x 6-8 reps',
    cues: 'Retract scapulae, plant feet firmly, tuck elbows at 45 degrees, touch lower sternum.',
    mistake: 'Flaring elbows 90 degrees or bouncing bar off chest.'
  },
  {
    id: 'ex-incline-db-press',
    name: 'Incline Dumbbell Press',
    muscle: 'Chest',
    secondary: 'Anterior Deltoid, Triceps',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    recommended: '3-4 sets x 8-12 reps',
    cues: 'Set bench to 30-degree incline. Press dumbbells in a slight inward arc without clanking.',
    mistake: 'Bench angle too steep (>45 deg) shifting work to front deltoids.'
  },
  {
    id: 'ex-dips-chest',
    name: 'Parallel Bar Dips',
    muscle: 'Chest',
    secondary: 'Triceps, Shoulders',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    recommended: '3 sets x 10-15 reps',
    cues: 'Lean torso forward 30 degrees, flare elbows slightly, descend until upper arms are parallel to floor.',
    mistake: 'Staying completely upright (targets triceps instead of lower pecs).'
  },
  {
    id: 'ex-cable-crossover',
    name: 'Standing Cable Fly / Crossover',
    muscle: 'Chest',
    secondary: 'Anterior Deltoid',
    equipment: 'Cable',
    difficulty: 'Beginner',
    recommended: '3 sets x 12-15 reps',
    cues: 'Slight bend in elbows, imagine hugging a large barrel, squeeze chest at peak contraction.',
    mistake: 'Pressing the weight instead of performing a controlled fly motion.'
  },
  {
    id: 'ex-pushups',
    name: 'Decline Push-Ups',
    muscle: 'Chest',
    secondary: 'Core, Triceps',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    recommended: '3-4 sets x 15-20 reps',
    cues: 'Elevate feet on bench or box, keep core braced like a plank, lower chest to floor.',
    mistake: 'Sagging lower back or looking up and straining neck.'
  },

  // BACK
  {
    id: 'ex-deadlift',
    name: 'Conventional Barbell Deadlift',
    muscle: 'Back',
    secondary: 'Glutes, Hamstrings, Traps, Core',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    recommended: '3 sets x 5 reps',
    cues: 'Bar over mid-foot, hinge hips back, pull slack out of bar, drive the floor away through mid-foot.',
    mistake: 'Rounding lumbar spine or yanking bar jerkily off floor.'
  },
  {
    id: 'ex-barbell-row',
    name: 'Bent-Over Barbell Row',
    muscle: 'Back',
    secondary: 'Biceps, Rear Delts, Erector Spinae',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '4 sets x 8-10 reps',
    cues: 'Hinge forward at 45 degrees, pull bar towards belly button, squeeze shoulder blades together.',
    mistake: 'Using excessive hip momentum or standing almost upright.'
  },
  {
    id: 'ex-pullup',
    name: 'Wide-Grip Pull-Up',
    muscle: 'Back',
    secondary: 'Biceps, Forearms',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    recommended: '3-4 sets x 6-10 reps',
    cues: 'Grip slightly wider than shoulders, lead with upper chest to bar, depress scapulae before pulling.',
    mistake: 'Kicking legs or failing to reach full arm extension at bottom.'
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Neutral Grip Lat Pulldown',
    muscle: 'Back',
    secondary: 'Biceps, Brachialis',
    equipment: 'Cable',
    difficulty: 'Beginner',
    recommended: '3-4 sets x 10-12 reps',
    cues: 'Lean back 10 degrees, drive elbows down into your hip pockets, control the 3-second eccentric.',
    mistake: 'Swinging torso back and forth to create momentum.'
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    muscle: 'Back',
    secondary: 'Rhomboids, Trapezius',
    equipment: 'Cable',
    difficulty: 'Beginner',
    recommended: '3 sets x 10-12 reps',
    cues: 'Keep chest tall, pull handles into lower abdomen, pause for 1 second at full retraction.',
    mistake: 'Rounding upper spine when reaching forward.'
  },

  // LEGS
  {
    id: 'ex-barbell-squat',
    name: 'Barbell Back Squat',
    muscle: 'Legs',
    secondary: 'Glutes, Calves, Core',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '4 sets x 6-8 reps',
    cues: 'Bar rest on traps, brace core with Valsalva maneuver, break at hips and knees, descend below parallel.',
    mistake: 'Knees caving inward (valgus collapse) or heels lifting off floor.'
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    muscle: 'Legs',
    secondary: 'Hamstrings, Glutes, Lower Back',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '3-4 sets x 8-10 reps',
    cues: 'Soft bend in knees, push hips backward towards wall behind you until deep hamstring stretch.',
    mistake: 'Squatting the weight or turning it into a lower back bend.'
  },
  {
    id: 'ex-bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscle: 'Legs',
    secondary: 'Quads, Glutes, Adductors',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    recommended: '3 sets x 10 reps/leg',
    cues: 'Rear foot laces down on bench, forward torso lean loads glutes, drop back knee straight down.',
    mistake: 'Front foot placed too close, causing heel to lift.'
  },
  {
    id: 'ex-leg-press',
    name: '45-Degree Leg Press',
    muscle: 'Legs',
    secondary: 'Quads, Glutes',
    equipment: 'Machine',
    difficulty: 'Beginner',
    recommended: '3-4 sets x 10-15 reps',
    cues: 'Keep lower back glued to pad, feet shoulder-width, lower until 90-degree knee bend, do not lock knees.',
    mistake: 'Hyperextending and locking knee joints at the top.'
  },
  {
    id: 'ex-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    muscle: 'Legs',
    secondary: 'Calves',
    equipment: 'Machine',
    difficulty: 'Beginner',
    recommended: '3 sets x 12-15 reps',
    cues: 'Align knee joint with machine pivot, point toes slightly forward, curl heels toward glutes.',
    mistake: 'Lifting hips off bench during contraction.'
  },

  // SHOULDERS
  {
    id: 'ex-overhead-press',
    name: 'Standing Barbell Overhead Press',
    muscle: 'Shoulders',
    secondary: 'Triceps, Upper Chest, Core',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '4 sets x 6-8 reps',
    cues: 'Squeeze glutes and quads tight, press bar in straight vertical line, lock out overhead through window.',
    mistake: 'Excessive arching of lower back.'
  },
  {
    id: 'ex-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscle: 'Shoulders',
    secondary: 'Lateral Deltoid',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    recommended: '4 sets x 12-15 reps',
    cues: 'Slight forward lean, raise arms in scapular plane (30 deg forward), lead with elbows not hands.',
    mistake: 'Shrugging traps up or swinging heavy dumbbells.'
  },
  {
    id: 'ex-face-pull',
    name: 'Rope Face Pull',
    muscle: 'Shoulders',
    secondary: 'Rear Delts, Rotator Cuff, Upper Traps',
    equipment: 'Cable',
    difficulty: 'Beginner',
    recommended: '3-4 sets x 15 reps',
    cues: 'Cable at eye level, pull thumbs back towards ears, externally rotate shoulders at peak.',
    mistake: 'Pulling downward towards chin without external rotation.'
  },
  {
    id: 'ex-arnold-press',
    name: 'Seated Arnold Dumbbell Press',
    muscle: 'Shoulders',
    secondary: 'Triceps, Upper Chest',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    recommended: '3 sets x 8-12 reps',
    cues: 'Start with palms facing chest, rotate outwards as you press overhead in continuous fluid motion.',
    mistake: 'Rushing rotation or clanking dumbbells.'
  },

  // ARMS
  {
    id: 'ex-incline-curl',
    name: 'Incline Dumbbell Bicep Curl',
    muscle: 'Arms',
    secondary: 'Biceps Long Head',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    recommended: '3 sets x 10-12 reps',
    cues: 'Incline bench at 45 degrees, full stretch at bottom, curl without letting elbows drift forward.',
    mistake: 'Swinging elbows forward to cheat weight up.'
  },
  {
    id: 'ex-skull-crusher',
    name: 'EZ-Bar Skull Crusher / Lying Extension',
    muscle: 'Arms',
    secondary: 'Triceps Long Head',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    recommended: '3-4 sets x 10-12 reps',
    cues: 'Lower bar past forehead towards crown of head to keep continuous tension on triceps tendon.',
    mistake: 'Flaring elbows outwards or moving shoulder joint.'
  },
  {
    id: 'ex-hammer-curl',
    name: 'Cross-Body Hammer Curl',
    muscle: 'Arms',
    secondary: 'Brachioradialis, Forearms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    recommended: '3 sets x 12 reps',
    cues: 'Maintain neutral grip (palms facing each other), curl across opposite pec, hold top contraction.',
    mistake: 'Rotating wrists during movement.'
  },
  {
    id: 'ex-tricep-pushdown',
    name: 'Cable Tricep Rope Pushdown',
    muscle: 'Arms',
    secondary: 'Triceps Lateral Head',
    equipment: 'Cable',
    difficulty: 'Beginner',
    recommended: '3-4 sets x 12-15 reps',
    cues: 'Pin elbows to ribs, push down and spread rope handles apart at bottom lockout.',
    mistake: 'Elbows drifting forwards and backwards during rep.'
  },

  // CORE
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    muscle: 'Core',
    secondary: 'Hip Flexors, Forearm Grip',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    recommended: '3 sets x 12-15 reps',
    cues: 'Hang from pull-up bar, tuck pelvis upwards towards ribs, avoid swinging body.',
    mistake: 'Only swinging legs without curling pelvis up.'
  },
  {
    id: 'ex-cable-woodchopper',
    name: 'Standing Cable Woodchopper',
    muscle: 'Core',
    secondary: 'Obliques, Rotational Power',
    equipment: 'Cable',
    difficulty: 'Intermediate',
    recommended: '3 sets x 12 reps/side',
    cues: 'Rotate through thoracic spine and hips, pivot back foot, keep arms extended.',
    mistake: 'Pulling with arms rather than twisting with core.'
  },
  {
    id: 'ex-ab-wheel-rollout',
    name: 'Kneeling Ab Wheel Rollout',
    muscle: 'Core',
    secondary: 'Lats, Hip Flexors',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    recommended: '3 sets x 8-12 reps',
    cues: 'Posterior pelvic tilt (tuck tailbone), roll forward maintaining flat back, pull back using abs.',
    mistake: 'Sagging lower back into hyperextension.'
  }
];
