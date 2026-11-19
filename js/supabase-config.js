/**
 * FITTRACK PRO - SUPABASE CLOUD INTEGRATION
 * Handles cloud persistence for workouts, PRs, and user settings.
 */

const SUPABASE_URL = 'https://akigpampioieivroekii.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jPtUshVn-m-BBwEI-jD85A_Oby_q9_N';

// Initialize Supabase Client
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('⚡ Supabase client initialized successfully.');
  } catch (err) {
    console.warn('Supabase initialization warning:', err);
  }
}

const SupabaseService = {
  // Check if connected
  isConfigured() {
    return !!supabaseClient;
  },

  // Save workout session to Supabase
  async saveWorkout(workoutData) {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from('workouts')
        .insert([
          {
            title: workoutData.title || 'Workout Session',
            volume_kg: workoutData.volume || 0,
            sets_completed: workoutData.sets || 0,
            created_at: new Date().toISOString()
          }
        ]);
      if (error) {
        console.warn('Supabase workout sync:', error.message);
      }
      return data;
    } catch (e) {
      console.warn('Supabase workout sync error:', e);
      return null;
    }
  },

  // Save Personal Record (PR) to Supabase
  async savePR(liftName, weightKg) {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from('personal_records')
        .insert([
          {
            lift: liftName,
            weight_kg: weightKg,
            recorded_at: new Date().toISOString()
          }
        ]);
      if (error) {
        console.warn('Supabase PR sync:', error.message);
      }
      return data;
    } catch (e) {
      console.warn('Supabase PR sync error:', e);
      return null;
    }
  },

  // Save newsletter subscriber or user contact
  async saveSubscriber(email) {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from('subscribers')
        .insert([{ email: email, subscribed_at: new Date().toISOString() }]);
      if (error) {
        console.warn('Supabase subscriber sync:', error.message);
      }
      return data;
    } catch (e) {
      console.warn('Supabase subscriber error:', e);
      return null;
    }
  }
};

window.SupabaseService = SupabaseService;
