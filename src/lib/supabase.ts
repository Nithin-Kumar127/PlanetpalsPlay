import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  current_streak: number
  best_streak: number
  total_xp: number
  level: number
  last_activity: string
  created_at: string
  updated_at: string
}

export interface LessonCategory {
  id: number
  name: string
  description: string
  icon: string
  color: string
  order_index: number
  created_at: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  category_id: number
  difficulty: 'easy' | 'medium' | 'hard'
  xp_reward: number
  content: any
  order_index: number
  created_at: string
}

export interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: number
  status: 'not_started' | 'in_progress' | 'completed'
  score: number | null
  time_spent: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  xp_reward: number
  criteria: any
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: number
  earned_at: string
  achievement?: Achievement
}

export interface QuizAttempt {
  id: string
  user_id: string
  game_mode: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
  created_at: string
}

export interface DailyActivity {
  id: string
  user_id: string
  activity_date: string
  lessons_completed: number
  xp_earned: number
  time_spent: number
  created_at: string
}

// API functions for learning tracking
export const learningAPI = {
  // Profile management
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating profile:', error)
      return false
    }
    return true
  },

  // Lesson management
  async getLessons(): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('category_id', { ascending: true })
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching lessons:', error)
      return []
    }
    return data || []
  },

  async getLessonCategories(): Promise<LessonCategory[]> {
    const { data, error } = await supabase
      .from('lesson_categories')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching lesson categories:', error)
      return []
    }
    return data || []
  },

  // Progress tracking
  async getUserProgress(userId: string): Promise<UserLessonProgress[]> {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching user progress:', error)
      return []
    }
    return data || []
  },

  async updateLessonProgress(
    userId: string, 
    lessonId: number, 
    status: 'not_started' | 'in_progress' | 'completed',
    score?: number,
    timeSpent?: number
  ): Promise<boolean> {
    const updates: any = {
      user_id: userId,
      lesson_id: lessonId,
      status,
      updated_at: new Date().toISOString()
    }

    if (score !== undefined) updates.score = score
    if (timeSpent !== undefined) updates.time_spent = timeSpent
    if (status === 'completed') updates.completed_at = new Date().toISOString()

    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert(updates, { onConflict: 'user_id,lesson_id' })
    
    if (error) {
      console.error('Error updating lesson progress:', error)
      return false
    }
    return true
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
    return data || []
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user achievements:', error)
      return []
    }
    return data || []
  },

  // Quiz tracking
  async saveQuizAttempt(
    userId: string,
    gameMode: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    timeTaken: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        game_mode: gameMode,
        score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        time_taken: timeTaken
      })
    
    if (error) {
      console.error('Error saving quiz attempt:', error)
      return false
    }
    return true
  },

  async getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching quiz attempts:', error)
      return []
    }
    return data || []
  },

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
    return data || []
  },

  // Daily activity
  async getDailyActivity(userId: string, days: number = 30): Promise<DailyActivity[]> {
    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('activity_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching daily activity:', error)
      return []
    }
    return data || []
  }
}