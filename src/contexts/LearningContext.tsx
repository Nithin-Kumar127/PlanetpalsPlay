import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { learningAPI, Profile, Lesson, LessonCategory, UserLessonProgress, Achievement, UserAchievement } from '@/lib/supabase'

interface LearningContextType {
  profile: Profile | null
  lessons: Lesson[]
  categories: LessonCategory[]
  userProgress: UserLessonProgress[]
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  loading: boolean
  
  // Actions
  updateLessonProgress: (lessonId: number, status: 'not_started' | 'in_progress' | 'completed', score?: number, timeSpent?: number) => Promise<boolean>
  saveQuizAttempt: (gameMode: string, score: number, totalQuestions: number, correctAnswers: number, timeTaken: number) => Promise<boolean>
  refreshData: () => Promise<void>
  
  // Computed values
  completedLessonIds: number[]
  totalXP: number
  currentLevel: number
  currentStreak: number
  lessonsCompleted: number
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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [categories, setCategories] = useState<LessonCategory[]>([])
  const [userProgress, setUserProgress] = useState<UserLessonProgress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Load all data in parallel
      const [
        profileData,
        lessonsData,
        categoriesData,
        progressData,
        achievementsData,
        userAchievementsData
      ] = await Promise.all([
        learningAPI.getProfile(user.id),
        learningAPI.getLessons(),
        learningAPI.getLessonCategories(),
        learningAPI.getUserProgress(user.id),
        learningAPI.getAchievements(),
        learningAPI.getUserAchievements(user.id)
      ])

      setProfile(profileData)
      setLessons(lessonsData)
      setCategories(categoriesData)
      setUserProgress(progressData)
      setAchievements(achievementsData)
      setUserAchievements(userAchievementsData)
      
    } catch (error) {
      console.error('Error loading learning data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const updateLessonProgress = async (
    lessonId: number, 
    status: 'not_started' | 'in_progress' | 'completed',
    score?: number,
    timeSpent?: number
  ): Promise<boolean> => {
    if (!user) return false

    const success = await learningAPI.updateLessonProgress(user.id, lessonId, status, score, timeSpent)
    
    if (success) {
      // Refresh data to get updated progress and achievements
      await loadData()
    }
    
    return success
  }

  const saveQuizAttempt = async (
    gameMode: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    timeTaken: number
  ): Promise<boolean> => {
    if (!user) return false

    return await learningAPI.saveQuizAttempt(user.id, gameMode, score, totalQuestions, correctAnswers, timeTaken)
  }

  const refreshData = async () => {
    await loadData()
  }

  // Computed values
  const completedLessonIds = userProgress
    .filter(p => p.status === 'completed')
    .map(p => p.lesson_id)

  const totalXP = profile?.total_xp || 0
  const currentLevel = profile?.level || 1
  const currentStreak = profile?.current_streak || 0
  const lessonsCompleted = completedLessonIds.length

  const value = {
    profile,
    lessons,
    categories,
    userProgress,
    achievements,
    userAchievements,
    loading,
    updateLessonProgress,
    saveQuizAttempt,
    refreshData,
    completedLessonIds,
    totalXP,
    currentLevel,
    currentStreak,
    lessonsCompleted
  }

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  )
}