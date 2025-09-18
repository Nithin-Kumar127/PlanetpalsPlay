import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
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

interface LessonCategory {
  id: number
  title: string
  description: string
  icon: string
  difficulty: string
  color_class: string
  order_index: number
  created_at: string
}

interface Lesson {
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

interface UserLessonProgress {
  id: string
  user_id: string
  lesson_id: number
  completed: boolean
  score: number | null
  time_spent: number
  completed_at: string | null
  created_at: string
}

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  xp_reward: number
  criteria: any
  category: string
  created_at: string
}

interface UserAchievement {
  id: string
  user_id: string
  achievement_id: number
  earned_at: string
  achievement?: Achievement
}

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

  // Mock data
  const mockLessonCategories: LessonCategory[] = [
    {
      id: 1,
      title: "Climate Basics",
      description: "Understanding greenhouse gases and global warming",
      icon: "Globe",
      difficulty: "Beginner",
      color_class: "from-blue-500 to-cyan-400",
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Renewable Energy",
      description: "Solar, wind, and sustainable power sources",
      icon: "Zap",
      difficulty: "Intermediate",
      color_class: "from-yellow-500 to-orange-400",
      order_index: 2,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Waste Management",
      description: "Recycling, composting, and reducing waste",
      icon: "Target",
      difficulty: "Intermediate",
      color_class: "from-green-500 to-emerald-400",
      order_index: 3,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Ecosystem Protection",
      description: "Biodiversity, conservation, and habitat preservation",
      icon: "Leaf",
      difficulty: "Advanced",
      color_class: "from-emerald-600 to-green-500",
      order_index: 4,
      created_at: new Date().toISOString()
    }
  ]

  const mockLessons: Lesson[] = [
    // Climate Basics
    { id: 1, category_id: 1, title: "What is Climate Change?", description: "Introduction to climate science", content: {}, xp_reward: 50, difficulty: "Easy", order_index: 1, created_at: new Date().toISOString() },
    { id: 2, category_id: 1, title: "The Greenhouse Effect", description: "How greenhouse gases work", content: {}, xp_reward: 75, difficulty: "Easy", order_index: 2, created_at: new Date().toISOString() },
    { id: 3, category_id: 1, title: "Carbon Footprint Basics", description: "Understanding your impact", content: {}, xp_reward: 100, difficulty: "Medium", order_index: 3, created_at: new Date().toISOString() },
    { id: 4, category_id: 1, title: "Global Temperature Trends", description: "Climate data analysis", content: {}, xp_reward: 125, difficulty: "Medium", order_index: 4, created_at: new Date().toISOString() },
    { id: 5, category_id: 1, title: "Ice Caps and Sea Levels", description: "Ocean and ice changes", content: {}, xp_reward: 150, difficulty: "Hard", order_index: 5, created_at: new Date().toISOString() },
    
    // Renewable Energy
    { id: 6, category_id: 2, title: "Solar Power Fundamentals", description: "How solar energy works", content: {}, xp_reward: 75, difficulty: "Easy", order_index: 1, created_at: new Date().toISOString() },
    { id: 7, category_id: 2, title: "Wind Energy Systems", description: "Wind power technology", content: {}, xp_reward: 100, difficulty: "Medium", order_index: 2, created_at: new Date().toISOString() },
    { id: 8, category_id: 2, title: "Hydroelectric Power", description: "Water-based energy", content: {}, xp_reward: 125, difficulty: "Medium", order_index: 3, created_at: new Date().toISOString() },
    { id: 9, category_id: 2, title: "Geothermal Energy", description: "Earth's heat energy", content: {}, xp_reward: 150, difficulty: "Hard", order_index: 4, created_at: new Date().toISOString() },
    { id: 10, category_id: 2, title: "Energy Storage Solutions", description: "Battery and storage tech", content: {}, xp_reward: 200, difficulty: "Hard", order_index: 5, created_at: new Date().toISOString() },
    
    // Waste Management
    { id: 11, category_id: 3, title: "The 3 R's: Reduce, Reuse, Recycle", description: "Waste reduction principles", content: {}, xp_reward: 50, difficulty: "Easy", order_index: 1, created_at: new Date().toISOString() },
    { id: 12, category_id: 3, title: "Composting at Home", description: "Organic waste management", content: {}, xp_reward: 75, difficulty: "Easy", order_index: 2, created_at: new Date().toISOString() },
    { id: 13, category_id: 3, title: "Plastic Pollution Solutions", description: "Reducing plastic waste", content: {}, xp_reward: 100, difficulty: "Medium", order_index: 3, created_at: new Date().toISOString() },
    { id: 14, category_id: 3, title: "Circular Economy Principles", description: "Sustainable economic models", content: {}, xp_reward: 150, difficulty: "Hard", order_index: 4, created_at: new Date().toISOString() },
    { id: 15, category_id: 3, title: "Zero Waste Lifestyle", description: "Minimizing waste production", content: {}, xp_reward: 200, difficulty: "Hard", order_index: 5, created_at: new Date().toISOString() },
    
    // Ecosystem Protection
    { id: 16, category_id: 4, title: "Biodiversity Basics", description: "Understanding ecosystems", content: {}, xp_reward: 100, difficulty: "Medium", order_index: 1, created_at: new Date().toISOString() },
    { id: 17, category_id: 4, title: "Forest Conservation", description: "Protecting forests", content: {}, xp_reward: 125, difficulty: "Medium", order_index: 2, created_at: new Date().toISOString() },
    { id: 18, category_id: 4, title: "Ocean Protection", description: "Marine conservation", content: {}, xp_reward: 150, difficulty: "Hard", order_index: 3, created_at: new Date().toISOString() },
    { id: 19, category_id: 4, title: "Wildlife Corridors", description: "Habitat connectivity", content: {}, xp_reward: 175, difficulty: "Hard", order_index: 4, created_at: new Date().toISOString() },
    { id: 20, category_id: 4, title: "Sustainable Agriculture", description: "Eco-friendly farming", content: {}, xp_reward: 200, difficulty: "Hard", order_index: 5, created_at: new Date().toISOString() },
  ]

  const mockAchievements: Achievement[] = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "BookOpen", xp_reward: 50, criteria: { lessons_completed: 1 }, category: "learning", created_at: new Date().toISOString() },
    { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: "Flame", xp_reward: 100, criteria: { streak: 7 }, category: "streak", created_at: new Date().toISOString() },
    { id: 3, name: "Climate Champion", description: "Complete 10 lessons", icon: "Globe", xp_reward: 300, criteria: { lessons_completed: 10 }, category: "learning", created_at: new Date().toISOString() },
    { id: 4, name: "Energy Expert", description: "Complete renewable energy category", icon: "Zap", xp_reward: 250, criteria: { category_completed: 2 }, category: "category", created_at: new Date().toISOString() },
    { id: 5, name: "Perfect Score", description: "Get 100% on any lesson", icon: "Star", xp_reward: 200, criteria: { perfect_score: 1 }, category: "performance", created_at: new Date().toISOString() },
    { id: 6, name: "Waste Wizard", description: "Complete waste management category", icon: "Target", xp_reward: 250, criteria: { category_completed: 3 }, category: "category", created_at: new Date().toISOString() },
    { id: 7, name: "Streak Master", description: "30-day learning streak", icon: "Flame", xp_reward: 500, criteria: { streak: 30 }, category: "streak", created_at: new Date().toISOString() },
    { id: 8, name: "Knowledge Seeker", description: "Complete all learning paths", icon: "Award", xp_reward: 1000, criteria: { all_categories: true }, category: "mastery", created_at: new Date().toISOString() }
  ]

  const loadUserProfile = () => {
    if (!user) return

    const savedProfile = localStorage.getItem(`userProfile_${user.id}`)
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else {
      // Create new profile
      const newProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Climate Learner',
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        best_streak: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        lessons_completed: 0,
        achievements_earned: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUserProfile(newProfile)
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(newProfile))
    }
  }

  const loadUserProgress = () => {
    if (!user) return

    const savedProgress = localStorage.getItem(`userProgress_${user.id}`)
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    } else {
      setUserProgress([])
    }
  }

  const loadUserAchievements = () => {
    if (!user) return

    const savedAchievements = localStorage.getItem(`userAchievements_${user.id}`)
    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements))
    } else {
      setUserAchievements([])
    }
  }

  const updateStreak = (profile: UserProfile) => {
    const today = new Date().toISOString().split('T')[0]
    const lastActivity = new Date(profile.last_activity_date)
    const todayDate = new Date(today)
    const daysDiff = Math.floor((todayDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

    let newStreak = profile.current_streak
    
    if (daysDiff === 0) {
      // Same day, no change
      return profile
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak = profile.current_streak + 1
    } else {
      // Gap in days, reset streak
      newStreak = 1
    }

    const updatedProfile = {
      ...profile,
      current_streak: newStreak,
      best_streak: Math.max(profile.best_streak, newStreak),
      last_activity_date: today,
      updated_at: new Date().toISOString()
    }

    return updatedProfile
  }

  const checkAchievements = (profile: UserProfile, progress: UserLessonProgress[]) => {
    const currentAchievements = [...userAchievements]
    let newAchievements: UserAchievement[] = []

    achievements.forEach(achievement => {
      // Skip if already earned
      if (currentAchievements.some(ua => ua.achievement_id === achievement.id)) return

      let shouldEarn = false

      switch (achievement.criteria.lessons_completed) {
        case 1:
          shouldEarn = profile.lessons_completed >= 1
          break
        case 10:
          shouldEarn = profile.lessons_completed >= 10
          break
      }

      if (achievement.criteria.streak) {
        shouldEarn = profile.current_streak >= achievement.criteria.streak
      }

      if (achievement.criteria.category_completed) {
        const categoryLessons = lessons.filter(l => l.category_id === achievement.criteria.category_completed)
        const completedInCategory = progress.filter(p => 
          p.completed && categoryLessons.some(l => l.id === p.lesson_id)
        ).length
        shouldEarn = completedInCategory === categoryLessons.length
      }

      if (achievement.criteria.all_categories) {
        const allCategoriesCompleted = lessonCategories.every(category => {
          const categoryLessons = lessons.filter(l => l.category_id === category.id)
          const completedInCategory = progress.filter(p => 
            p.completed && categoryLessons.some(l => l.id === p.lesson_id)
          ).length
          return completedInCategory === categoryLessons.length
        })
        shouldEarn = allCategoriesCompleted
      }

      if (shouldEarn) {
        const newAchievement: UserAchievement = {
          id: `${user?.id}_${achievement.id}_${Date.now()}`,
          user_id: user?.id || '',
          achievement_id: achievement.id,
          earned_at: new Date().toISOString(),
          achievement
        }
        newAchievements.push(newAchievement)
      }
    })

    if (newAchievements.length > 0) {
      const updatedAchievements = [...currentAchievements, ...newAchievements]
      setUserAchievements(updatedAchievements)
      localStorage.setItem(`userAchievements_${user?.id}`, JSON.stringify(updatedAchievements))

      // Award XP for achievements
      const achievementXP = newAchievements.reduce((total, ua) => total + (ua.achievement?.xp_reward || 0), 0)
      if (achievementXP > 0) {
        const updatedProfile = {
          ...profile,
          total_xp: profile.total_xp + achievementXP,
          current_level: Math.floor((profile.total_xp + achievementXP) / 500) + 1,
          achievements_earned: profile.achievements_earned + newAchievements.length,
          updated_at: new Date().toISOString()
        }
        setUserProfile(updatedProfile)
        localStorage.setItem(`userProfile_${user?.id}`, JSON.stringify(updatedProfile))
      }

      // Show achievement notifications
      newAchievements.forEach(ua => {
        toast({
          title: "Achievement Unlocked! 🏆",
          description: `${ua.achievement?.name}: +${ua.achievement?.xp_reward} XP`,
        })
      })
    }
  }

  const completeLesson = async (lessonId: number, score?: number, timeSpent?: number) => {
    if (!user || !userProfile) return

    try {
      const lesson = lessons.find(l => l.id === lessonId)
      if (!lesson) return

      // Update or create progress
      const existingProgress = userProgress.find(p => p.lesson_id === lessonId)
      let updatedProgress: UserLessonProgress[]

      if (existingProgress) {
        updatedProgress = userProgress.map(p => 
          p.lesson_id === lessonId 
            ? { ...p, completed: true, score: score || 100, time_spent: timeSpent || 0, completed_at: new Date().toISOString() }
            : p
        )
      } else {
        const newProgress: UserLessonProgress = {
          id: `${user.id}_${lessonId}_${Date.now()}`,
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          score: score || 100,
          time_spent: timeSpent || 0,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
        updatedProgress = [...userProgress, newProgress]
      }

      setUserProgress(updatedProgress)
      localStorage.setItem(`userProgress_${user.id}`, JSON.stringify(updatedProgress))

      // Update user profile
      const completedLessons = updatedProgress.filter(p => p.completed).length
      let updatedProfile = {
        ...userProfile,
        total_xp: userProfile.total_xp + lesson.xp_reward,
        lessons_completed: completedLessons,
        updated_at: new Date().toISOString()
      }

      // Update streak
      updatedProfile = updateStreak(updatedProfile)
      
      // Calculate level
      updatedProfile.current_level = Math.floor(updatedProfile.total_xp / 500) + 1

      setUserProfile(updatedProfile)
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(updatedProfile))

      // Check for new achievements
      checkAchievements(updatedProfile, updatedProgress)

      toast({
        title: "Lesson Complete! 🎉",
        description: `You earned ${lesson.xp_reward} XP!`,
      })
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const recordQuizAttempt = async (
    quizType: string, 
    score: number, 
    totalQuestions: number, 
    correctAnswers: number, 
    timeSpent?: number
  ) => {
    if (!user || !userProfile) return

    try {
      // Award XP for quiz completion
      const xpReward = Math.floor(score / 10) // 1 XP per 10 points
      if (xpReward > 0) {
        let updatedProfile = {
          ...userProfile,
          total_xp: userProfile.total_xp + xpReward,
          updated_at: new Date().toISOString()
        }

        // Update streak
        updatedProfile = updateStreak(updatedProfile)
        
        // Calculate level
        updatedProfile.current_level = Math.floor(updatedProfile.total_xp / 500) + 1

        setUserProfile(updatedProfile)
        localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(updatedProfile))

        // Check for new achievements
        checkAchievements(updatedProfile, userProgress)
      }
    } catch (error) {
      console.error('Error recording quiz attempt:', error)
    }
  }

  const refreshData = async () => {
    if (!user) return
    
    setLoading(true)
    loadUserProfile()
    loadUserProgress()
    loadUserAchievements()
    setLoading(false)
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      
      // Load static data
      setLessonCategories(mockLessonCategories)
      setLessons(mockLessons)
      setAchievements(mockAchievements)
      
      // Load user-specific data if authenticated
      if (user) {
        loadUserProfile()
        loadUserProgress()
        loadUserAchievements()
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