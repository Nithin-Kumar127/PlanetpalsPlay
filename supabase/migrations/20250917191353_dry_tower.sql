/*
  # Learning Tracking System

  1. New Tables
    - `profiles` - Extended user profile information
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `current_streak` (integer, default 0)
      - `best_streak` (integer, default 0)
      - `total_xp` (integer, default 0)
      - `level` (integer, default 1)
      - `last_activity` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lessons` - All available lessons
      - `id` (integer, primary key)
      - `title` (text)
      - `description` (text)
      - `category_id` (integer)
      - `difficulty` (text)
      - `xp_reward` (integer)
      - `content` (jsonb)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `lesson_categories` - Learning path categories
      - `id` (integer, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `user_lesson_progress` - Track user progress on lessons
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `lesson_id` (integer, references lessons)
      - `status` (text: 'not_started', 'in_progress', 'completed')
      - `score` (integer, optional)
      - `time_spent` (integer, seconds)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `achievements` - Available achievements
      - `id` (integer, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `xp_reward` (integer)
      - `criteria` (jsonb)
      - `created_at` (timestamp)

    - `user_achievements` - User earned achievements
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (integer, references achievements)
      - `earned_at` (timestamp)

    - `quiz_attempts` - Track quiz game attempts
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `game_mode` (text)
      - `score` (integer)
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `time_taken` (integer)
      - `created_at` (timestamp)

    - `daily_activity` - Track daily learning activity
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activity_date` (date)
      - `lessons_completed` (integer, default 0)
      - `xp_earned` (integer, default 0)
      - `time_spent` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public lesson and achievement data

  3. Functions
    - Trigger to update user streaks
    - Trigger to award achievements automatically
    - Function to calculate user level based on XP
*/

-- Create lesson categories table
CREATE TABLE IF NOT EXISTS lesson_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES lesson_categories(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL DEFAULT 50,
  content JSONB DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_mode TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily activity table
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS on all tables
ALTER TABLE lesson_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Policies for lesson_categories (public read)
CREATE POLICY "Anyone can read lesson categories"
  ON lesson_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for lessons (public read)
CREATE POLICY "Anyone can read lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for achievements (public read)
CREATE POLICY "Anyone can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for profiles
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for user_lesson_progress
CREATE POLICY "Users can manage own lesson progress"
  ON user_lesson_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements
CREATE POLICY "Users can read all user achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for quiz_attempts
CREATE POLICY "Users can manage own quiz attempts"
  ON quiz_attempts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for daily_activity
CREATE POLICY "Users can manage own daily activity"
  ON daily_activity
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert lesson categories
INSERT INTO lesson_categories (id, name, description, icon, color, order_index) VALUES
(1, 'Climate Basics', 'Understanding greenhouse gases and global warming', 'Globe', 'from-blue-500 to-cyan-400', 1),
(2, 'Renewable Energy', 'Solar, wind, and sustainable power sources', 'Zap', 'from-yellow-500 to-orange-400', 2),
(3, 'Waste Management', 'Recycling, composting, and reducing waste', 'Target', 'from-green-500 to-emerald-400', 3),
(4, 'Ecosystem Protection', 'Biodiversity, conservation, and habitat preservation', 'Leaf', 'from-emerald-600 to-green-500', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert lessons
INSERT INTO lessons (id, title, description, category_id, difficulty, xp_reward, order_index) VALUES
-- Climate Basics
(1, 'What is Climate Change?', 'Learn the fundamentals of climate change and its causes', 1, 'easy', 50, 1),
(2, 'The Greenhouse Effect', 'Understand how greenhouse gases trap heat in our atmosphere', 1, 'easy', 75, 2),
(3, 'Carbon Footprint Basics', 'Discover what contributes to your personal carbon footprint', 1, 'medium', 100, 3),
(4, 'Global Temperature Trends', 'Explore historical and projected temperature changes', 1, 'medium', 125, 4),
(5, 'Ice Caps and Sea Levels', 'Learn about polar ice melting and rising sea levels', 1, 'hard', 150, 5),

-- Renewable Energy
(6, 'Solar Power Fundamentals', 'How solar panels convert sunlight into electricity', 2, 'easy', 75, 1),
(7, 'Wind Energy Systems', 'Understanding wind turbines and wind power generation', 2, 'medium', 100, 2),
(8, 'Hydroelectric Power', 'How water generates clean electricity', 2, 'medium', 125, 3),
(9, 'Geothermal Energy', 'Harnessing Earth\'s internal heat for power', 2, 'hard', 150, 4),
(10, 'Energy Storage Solutions', 'Batteries and grid storage for renewable energy', 2, 'hard', 200, 5),

-- Waste Management
(11, 'The 3 R\'s: Reduce, Reuse, Recycle', 'Foundation principles of waste management', 3, 'easy', 50, 1),
(12, 'Composting at Home', 'Turn organic waste into valuable soil amendment', 3, 'easy', 75, 2),
(13, 'Plastic Pollution Solutions', 'Addressing the global plastic waste crisis', 3, 'medium', 100, 3),
(14, 'Circular Economy Principles', 'Creating closed-loop systems for materials', 3, 'hard', 150, 4),
(15, 'Zero Waste Lifestyle', 'Strategies for minimizing personal waste production', 3, 'hard', 200, 5),

-- Ecosystem Protection
(16, 'Biodiversity Basics', 'Understanding the variety of life on Earth', 4, 'medium', 100, 1),
(17, 'Forest Conservation', 'Protecting and restoring forest ecosystems', 4, 'medium', 125, 2),
(18, 'Ocean Protection', 'Safeguarding marine ecosystems and wildlife', 4, 'hard', 150, 3),
(19, 'Wildlife Corridors', 'Connecting habitats for animal migration', 4, 'hard', 175, 4),
(20, 'Sustainable Agriculture', 'Farming practices that protect the environment', 4, 'hard', 200, 5)
ON CONFLICT (id) DO NOTHING;

-- Insert achievements
INSERT INTO achievements (id, name, description, icon, xp_reward, criteria) VALUES
(1, 'First Steps', 'Complete your first lesson', 'BookOpen', 50, '{"type": "lessons_completed", "count": 1}'),
(2, 'Week Warrior', '7-day learning streak', 'Flame', 100, '{"type": "streak", "count": 7}'),
(3, 'Climate Champion', 'Complete 50 lessons', 'Globe', 500, '{"type": "lessons_completed", "count": 50}'),
(4, 'Energy Expert', 'Master renewable energy path', 'Zap', 300, '{"type": "category_completed", "category_id": 2}'),
(5, 'Perfect Score', 'Get 100% on any lesson', 'Star', 200, '{"type": "perfect_score", "count": 1}'),
(6, 'Waste Wizard', 'Complete waste management path', 'Target', 300, '{"type": "category_completed", "category_id": 3}'),
(7, 'Streak Master', '30-day learning streak', 'Flame', 1000, '{"type": "streak", "count": 30}'),
(8, 'Knowledge Seeker', 'Complete all learning paths', 'Award', 2000, '{"type": "all_categories_completed", "count": 4}')
ON CONFLICT (id) DO NOTHING;

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = GREATEST(1, FLOOR(NEW.total_xp / 500) + 1);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update level when XP changes
DROP TRIGGER IF EXISTS update_level_on_xp_change ON profiles;
CREATE TRIGGER update_level_on_xp_change
  BEFORE UPDATE OF total_xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Function to update daily activity
CREATE OR REPLACE FUNCTION update_daily_activity(
  p_user_id UUID,
  p_xp_earned INTEGER DEFAULT 0,
  p_lessons_completed INTEGER DEFAULT 0,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_activity (user_id, activity_date, lessons_completed, xp_earned, time_spent)
  VALUES (p_user_id, CURRENT_DATE, p_lessons_completed, p_xp_earned, p_time_spent)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    lessons_completed = daily_activity.lessons_completed + p_lessons_completed,
    xp_earned = daily_activity.xp_earned + p_xp_earned,
    time_spent = daily_activity.time_spent + p_time_spent;
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_activity_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get the last activity date (excluding today)
  SELECT activity_date INTO last_activity_date
  FROM daily_activity
  WHERE user_id = p_user_id AND activity_date < CURRENT_DATE
  ORDER BY activity_date DESC
  LIMIT 1;

  -- Calculate current streak
  IF last_activity_date IS NULL THEN
    current_streak = 1; -- First day
  ELSIF last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day
    SELECT current_streak + 1 INTO current_streak
    FROM profiles
    WHERE id = p_user_id;
  ELSE
    current_streak = 1; -- Streak broken, restart
  END IF;

  -- Update profile
  UPDATE profiles
  SET 
    current_streak = current_streak,
    best_streak = GREATEST(best_streak, current_streak),
    last_activity = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  achievement_record RECORD;
  user_stats RECORD;
  category_completion RECORD;
BEGIN
  -- Get user stats
  SELECT 
    total_xp,
    current_streak,
    (SELECT COUNT(*) FROM user_lesson_progress WHERE user_id = p_user_id AND status = 'completed') as lessons_completed,
    (SELECT COUNT(*) FROM user_lesson_progress ulp 
     JOIN lessons l ON ulp.lesson_id = l.id 
     WHERE ulp.user_id = p_user_id AND ulp.status = 'completed' AND ulp.score = 100) as perfect_scores
  INTO user_stats
  FROM profiles
  WHERE id = p_user_id;

  -- Check each achievement
  FOR achievement_record IN SELECT * FROM achievements LOOP
    -- Skip if user already has this achievement
    IF EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = achievement_record.id) THEN
      CONTINUE;
    END IF;

    -- Check criteria
    CASE achievement_record.criteria->>'type'
      WHEN 'lessons_completed' THEN
        IF user_stats.lessons_completed >= (achievement_record.criteria->>'count')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement_record.id);
          UPDATE profiles SET total_xp = total_xp + achievement_record.xp_reward WHERE id = p_user_id;
        END IF;
      
      WHEN 'streak' THEN
        IF user_stats.current_streak >= (achievement_record.criteria->>'count')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement_record.id);
          UPDATE profiles SET total_xp = total_xp + achievement_record.xp_reward WHERE id = p_user_id;
        END IF;
      
      WHEN 'perfect_score' THEN
        IF user_stats.perfect_scores >= (achievement_record.criteria->>'count')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement_record.id);
          UPDATE profiles SET total_xp = total_xp + achievement_record.xp_reward WHERE id = p_user_id;
        END IF;
      
      WHEN 'category_completed' THEN
        SELECT COUNT(*) as total_lessons,
               COUNT(CASE WHEN ulp.status = 'completed' THEN 1 END) as completed_lessons
        INTO category_completion
        FROM lessons l
        LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = p_user_id
        WHERE l.category_id = (achievement_record.criteria->>'category_id')::INTEGER;
        
        IF category_completion.completed_lessons = category_completion.total_lessons THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement_record.id);
          UPDATE profiles SET total_xp = total_xp + achievement_record.xp_reward WHERE id = p_user_id;
        END IF;
      
      WHEN 'all_categories_completed' THEN
        IF (SELECT COUNT(DISTINCT l.category_id) 
            FROM lessons l
            JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id
            WHERE ulp.user_id = p_user_id AND ulp.status = 'completed'
            GROUP BY l.category_id
            HAVING COUNT(*) = (SELECT COUNT(*) FROM lessons WHERE category_id = l.category_id)
           ) >= (achievement_record.criteria->>'count')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, achievement_record.id);
          UPDATE profiles SET total_xp = total_xp + achievement_record.xp_reward WHERE id = p_user_id;
        END IF;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger to update daily activity and check achievements when lesson is completed
CREATE OR REPLACE FUNCTION handle_lesson_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when lesson is newly completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Update daily activity
    PERFORM update_daily_activity(
      NEW.user_id,
      (SELECT xp_reward FROM lessons WHERE id = NEW.lesson_id),
      1,
      NEW.time_spent
    );
    
    -- Update user total XP
    UPDATE profiles 
    SET total_xp = total_xp + (SELECT xp_reward FROM lessons WHERE id = NEW.lesson_id)
    WHERE id = NEW.user_id;
    
    -- Update streak
    PERFORM update_user_streak(NEW.user_id);
    
    -- Check for new achievements
    PERFORM check_achievements(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_lesson_completed ON user_lesson_progress;
CREATE TRIGGER on_lesson_completed
  AFTER INSERT OR UPDATE ON user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION handle_lesson_completion();