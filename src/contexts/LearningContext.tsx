import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase, UserProfile, LessonCategory, Lesson, UserLessonProgress, Achievement, UserAchievement } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface LearningContextType {
  userProfile: UserProfile | null
  lessonCategories: LessonCategory[]
  lessons: Lesson[]
  userProgress: UserLessonProgress[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  loading: boolean
  completeLesson: (lessonId: number, score?: number, timeSpent?: number) => Promise<void>
  recordQuizAttempt: (quizType: string, score: number, totalQuestions: number, correctAnswers: number, timeSpent?: number) => Promise<void>
  refreshData: () => Promise<void>
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export const useLearning = () => {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [lessonCategories, setLessonCategories] = useState<LessonCategory[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [userProgress, setUserProgress] = useState<UserLessonProgress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'Climate Learner'
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
        } else {
          setUserProfile(newProfile)
        }
      } else if (error) {
        console.error('Error loading profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Exception loading profile:', error)
    }
  }

  const loadLessonCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_categories')
        .select('*')
        .order('order_index')

      if (error) {
        console.error('Error loading categories:', error)
      } else {
        setLessonCategories(data || [])
      }
    } catch (error) {
      console.error('Exception loading categories:', error)
    }
  }

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('category_id, order_index')

      if (error) {
        console.error('Error loading lessons:', error)
      } else {
        setLessons(data || [])
      }
    } catch (error) {
      console.error('Exception loading lessons:', error)
    }
  }

  const loadUserProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading progress:', error)
      } else {
        setUserProgress(data || [])
      }
    } catch (error) {
      console.error('Exception loading progress:', error)
    }
  }

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('id')

      if (error) {
        console.error('Error loading achievements:', error)
      } else {
        setAchievements(data || [])
      }
    } catch (error) {
      console.error('Exception loading achievements:', error)
    }
  }

  const loadUserAchievements = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading user achievements:', error)
      } else {
        setUserAchievements(data || [])
      }
    } catch (error) {
      console.error('Exception loading user achievements:', error)
    }
  }

  const completeLesson = async (lessonId: number, score?: number, timeSpent?: number) => {
    if (!user) return

    try {
      // Find the lesson to get XP reward
      const lesson = lessons.find(l => l.id === lessonId)
      if (!lesson) {
        console.error('Lesson not found:', lessonId)
        return
      }

      // Insert or update lesson progress
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          score: score || 100,
          time_spent: timeSpent || 0,
          completed_at: new Date().toISOString(),
          xp_reward: lesson.xp_reward
        })
        .select()

      if (error) {
        console.error('Error completing lesson:', error)
        toast({
          title: "Error",
          description: "Failed to save lesson progress",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Lesson Complete! 🎉",
          description: `You earned ${lesson.xp_reward} XP!`,
        })
        
        // Refresh data to get updated XP and achievements
        await refreshData()
      }
    } catch (error) {
      console.error('Exception completing lesson:', error)
    }
  }

  const recordQuizAttempt = async (
    quizType: string, 
    score: number, 
    totalQuestions: number, 
    correctAnswers: number, 
    timeSpent?: number
  ) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_type: quizType,
          score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_taken: timeSpent
        })

      if (error) {
        console.error('Error recording quiz attempt:', error)
      } else {
        // Award XP for quiz completion
        const xpReward = Math.floor(score / 10) // 1 XP per 10 points
        if (xpReward > 0) {
          await supabase
            .from('user_profiles')
            .update({ 
              total_xp: (userProfile?.total_xp || 0) + xpReward,
              current_level: Math.floor(((userProfile?.total_xp || 0) + xpReward) / 500) + 1
            })
            .eq('id', user.id)
        }
        
        await refreshData()
      }
    } catch (error) {
      console.error('Exception recording quiz attempt:', error)
    }
  }

  const refreshData = async () => {
    if (!user) return
    
    setLoading(true)
    await Promise.all([
      loadUserProfile(),
      loadUserProgress(),
      loadUserAchievements()
    ])
    setLoading(false)
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      
      // Load public data first
      await Promise.all([
        loadLessonCategories(),
        loadLessons(),
        loadAchievements()
      ])
      
      // Load user-specific data if authenticated
      if (user) {
        await Promise.all([
          loadUserProfile(),
          loadUserProgress(),
          loadUserAchievements()
        ])
      }
      
      setLoading(false)
    }

    initializeData()
  }, [user])

  const value = {
    userProfile,
    lessonCategories,
    lessons,
    userProgress,
    achievements,
    userAchievements,
    loading,
    completeLesson,
    recordQuizAttempt,
    refreshData
  }

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  )
}