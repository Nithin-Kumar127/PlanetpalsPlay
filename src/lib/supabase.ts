import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  name?: string
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  name: string | null
  total_xp: number
  current_level: number
  current_streak: number
  best_streak: number
  last_activity_date: string
  lessons_completed: number
  achievements_earned: number
  created_at: string
  updated_at: string
}

export type LessonCategory = {
  id: number
  title: string
  description: string
  icon: string
  difficulty: string
  color_class: string
  order_index: number
  created_at: string
}

export type Lesson = {
  id: number
  category_id: number
  title: string
  description: string | null
  content: any
  xp_reward: number
  difficulty: string
  order_index: number
  created_at: string
}

export type UserLessonProgress = {
  id: string
  user_id: string
  lesson_id: number
  completed: boolean
  score: number | null
  time_spent: number
  completed_at: string | null
  created_at: string
}

export type Achievement = {
  id: number
  name: string
  description: string
  icon: string
  xp_reward: number
  criteria: any
  category: string
  created_at: string
}

export type UserAchievement = {
  id: string
  user_id: string
  achievement_id: number
  earned_at: string
  achievement?: Achievement
}

export type DailyActivity = {
  id: string
  user_id: string
  activity_date: string
  lessons_completed: number
  xp_earned: number
  time_spent: number
  created_at: string
}

export type QuizAttempt = {
  id: string
  user_id: string
  quiz_type: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number | null
  completed_at: string
}