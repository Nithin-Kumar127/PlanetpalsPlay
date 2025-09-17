/*
  # Learning System Database Schema

  1. New Tables
    - `user_profiles` - Extended user information with XP, levels, streaks
    - `lesson_categories` - Learning path categories (Climate Basics, Renewable Energy, etc.)
    - `lessons` - Individual lessons within each category
    - `user_lesson_progress` - Track completion status and scores for each lesson
    - `achievements` - Available achievements in the system
    - `user_achievements` - Track which achievements users have earned
    - `daily_activity` - Track daily learning activity for streak calculation
    - `quiz_attempts` - Track quiz game performance

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for reading public lesson/achievement data

  3. Functions & Triggers
    - Auto-update XP when lessons are completed
    - Auto-calculate streaks based on daily activity
    - Auto-unlock achievements when criteria are met
    - Auto-update user levels based on total XP
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  current_streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  lessons_completed integer DEFAULT 0,
  achievements_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lesson categories table
CREATE TABLE IF NOT EXISTS lesson_categories (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  difficulty text NOT NULL,
  color_class text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id serial PRIMARY KEY,
  category_id integer REFERENCES lesson_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content jsonb,
  xp_reward integer DEFAULT 50,
  difficulty text DEFAULT 'Easy',
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id integer REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer,
  time_spent integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  xp_reward integer DEFAULT 100,
  criteria jsonb NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id integer REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create daily activity table for streak tracking
CREATE TABLE IF NOT EXISTS daily_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_date date DEFAULT CURRENT_DATE,
  lessons_completed integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  time_spent integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Create quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  time_taken integer,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for lesson_categories (public read)
CREATE POLICY "Anyone can view lesson categories"
  ON lesson_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_lesson_progress
CREATE POLICY "Users can view own progress"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_activity
CREATE POLICY "Users can view own activity"
  ON daily_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON daily_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity"
  ON daily_activity
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert lesson categories
INSERT INTO lesson_categories (title, description, icon, difficulty, color_class, order_index) VALUES
('Climate Basics', 'Understanding greenhouse gases and global warming', 'Globe', 'Beginner', 'from-blue-500 to-cyan-400', 1),
('Renewable Energy', 'Solar, wind, and sustainable power sources', 'Zap', 'Intermediate', 'from-yellow-500 to-orange-400', 2),
('Waste Management', 'Recycling, composting, and reducing waste', 'Target', 'Beginner', 'from-green-500 to-emerald-400', 3),
('Ecosystem Protection', 'Biodiversity, conservation, and habitat preservation', 'Leaf', 'Advanced', 'from-emerald-600 to-green-500', 4);

-- Insert lessons for each category
INSERT INTO lessons (category_id, title, description, xp_reward, difficulty, order_index) VALUES
-- Climate Basics (category_id: 1)
(1, 'What is Climate Change?', 'Introduction to climate science and global warming', 50, 'Easy', 1),
(1, 'The Greenhouse Effect', 'Understanding how greenhouse gases trap heat', 75, 'Easy', 2),
(1, 'Carbon Footprint Basics', 'Learn about personal and global carbon emissions', 100, 'Medium', 3),
(1, 'Global Temperature Trends', 'Analyzing historical and projected temperature data', 125, 'Medium', 4),
(1, 'Ice Caps and Sea Levels', 'Impact of melting ice on global sea levels', 150, 'Hard', 5),

-- Renewable Energy (category_id: 2)
(2, 'Solar Power Fundamentals', 'How solar panels convert sunlight to electricity', 75, 'Easy', 1),
(2, 'Wind Energy Systems', 'Understanding wind turbines and wind farms', 100, 'Medium', 2),
(2, 'Hydroelectric Power', 'Generating electricity from flowing water', 125, 'Medium', 3),
(2, 'Geothermal Energy', 'Harnessing Earth''s internal heat for power', 150, 'Hard', 4),
(2, 'Energy Storage Solutions', 'Batteries and grid storage for renewable energy', 200, 'Hard', 5),

-- Waste Management (category_id: 3)
(3, 'The 3 R''s: Reduce, Reuse, Recycle', 'Fundamental principles of waste management', 50, 'Easy', 1),
(3, 'Composting at Home', 'Creating nutrient-rich soil from organic waste', 75, 'Easy', 2),
(3, 'Plastic Pollution Solutions', 'Addressing the global plastic crisis', 100, 'Medium', 3),
(3, 'Circular Economy Principles', 'Designing out waste and keeping materials in use', 150, 'Hard', 4),
(3, 'Zero Waste Lifestyle', 'Minimizing personal waste production', 200, 'Hard', 5),

-- Ecosystem Protection (category_id: 4)
(4, 'Biodiversity Basics', 'Understanding the variety of life on Earth', 100, 'Medium', 1),
(4, 'Forest Conservation', 'Protecting and restoring forest ecosystems', 125, 'Medium', 2),
(4, 'Ocean Protection', 'Safeguarding marine environments and wildlife', 150, 'Hard', 3),
(4, 'Wildlife Corridors', 'Connecting habitats for animal migration', 175, 'Hard', 4),
(4, 'Sustainable Agriculture', 'Farming practices that protect the environment', 200, 'Hard', 5);

-- Insert achievements
INSERT INTO achievements (name, description, icon, xp_reward, criteria, category) VALUES
('First Steps', 'Complete your first lesson', 'BookOpen', 50, '{"type": "lessons_completed", "value": 1}', 'learning'),
('Week Warrior', '7-day learning streak', 'Flame', 100, '{"type": "streak", "value": 7}', 'streak'),
('Climate Champion', 'Complete 50 lessons', 'Globe', 500, '{"type": "lessons_completed", "value": 50}', 'learning'),
('Energy Expert', 'Complete all renewable energy lessons', 'Zap', 300, '{"type": "category_complete", "value": 2}', 'category'),
('Perfect Score', 'Get 100% on any lesson', 'Star', 200, '{"type": "perfect_score", "value": 1}', 'performance'),
('Waste Wizard', 'Complete all waste management lessons', 'Target', 300, '{"type": "category_complete", "value": 3}', 'category'),
('Streak Master', '30-day learning streak', 'Flame', 1000, '{"type": "streak", "value": 30}', 'streak'),
('Knowledge Seeker', 'Complete all learning paths', 'Award', 2000, '{"type": "all_categories_complete", "value": 4}', 'mastery'),
('Quiz Master', 'Score 90% or higher on 5 quizzes', 'Brain', 400, '{"type": "quiz_high_score", "value": 5}', 'performance'),
('Eco Warrior', 'Earn 5000 total XP', 'Trophy', 600, '{"type": "total_xp", "value": 5000}', 'milestone');

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total XP and lessons completed
  UPDATE user_profiles 
  SET 
    total_xp = total_xp + NEW.xp_reward,
    lessons_completed = lessons_completed + 1,
    current_level = FLOOR((total_xp + NEW.xp_reward) / 500) + 1,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  -- Update daily activity
  INSERT INTO daily_activity (user_id, activity_date, lessons_completed, xp_earned)
  VALUES (NEW.user_id, CURRENT_DATE, 1, NEW.xp_reward)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    lessons_completed = daily_activity.lessons_completed + 1,
    xp_earned = daily_activity.xp_earned + NEW.xp_reward;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  yesterday_activity boolean;
  current_streak integer;
BEGIN
  -- Check if user had activity yesterday
  SELECT EXISTS(
    SELECT 1 FROM daily_activity 
    WHERE user_id = NEW.user_id 
    AND activity_date = CURRENT_DATE - INTERVAL '1 day'
  ) INTO yesterday_activity;
  
  -- Get current streak
  SELECT current_streak INTO current_streak
  FROM user_profiles 
  WHERE id = NEW.user_id;
  
  -- Update streak
  IF yesterday_activity OR current_streak = 0 THEN
    -- Continue or start streak
    UPDATE user_profiles 
    SET 
      current_streak = current_streak + 1,
      best_streak = GREATEST(best_streak, current_streak + 1),
      last_activity_date = CURRENT_DATE,
      updated_at = now()
    WHERE id = NEW.user_id;
  ELSE
    -- Reset streak if there was a gap
    UPDATE user_profiles 
    SET 
      current_streak = 1,
      last_activity_date = CURRENT_DATE,
      updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  achievement_record RECORD;
  user_data RECORD;
  category_complete boolean;
BEGIN
  -- Get updated user data
  SELECT * INTO user_data FROM user_profiles WHERE id = NEW.user_id;
  
  -- Check each achievement
  FOR achievement_record IN SELECT * FROM achievements LOOP
    -- Skip if user already has this achievement
    IF EXISTS(SELECT 1 FROM user_achievements WHERE user_id = NEW.user_id AND achievement_id = achievement_record.id) THEN
      CONTINUE;
    END IF;
    
    -- Check achievement criteria
    CASE achievement_record.criteria->>'type'
      WHEN 'lessons_completed' THEN
        IF user_data.lessons_completed >= (achievement_record.criteria->>'value')::integer THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (NEW.user_id, achievement_record.id);
          UPDATE user_profiles SET achievements_earned = achievements_earned + 1, total_xp = total_xp + achievement_record.xp_reward WHERE id = NEW.user_id;
        END IF;
      
      WHEN 'streak' THEN
        IF user_data.current_streak >= (achievement_record.criteria->>'value')::integer THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (NEW.user_id, achievement_record.id);
          UPDATE user_profiles SET achievements_earned = achievements_earned + 1, total_xp = total_xp + achievement_record.xp_reward WHERE id = NEW.user_id;
        END IF;
      
      WHEN 'category_complete' THEN
        -- Check if user completed all lessons in a specific category
        SELECT NOT EXISTS(
          SELECT 1 FROM lessons l
          LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = NEW.user_id
          WHERE l.category_id = (achievement_record.criteria->>'value')::integer
          AND (ulp.completed IS NULL OR ulp.completed = false)
        ) INTO category_complete;
        
        IF category_complete THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (NEW.user_id, achievement_record.id);
          UPDATE user_profiles SET achievements_earned = achievements_earned + 1, total_xp = total_xp + achievement_record.xp_reward WHERE id = NEW.user_id;
        END IF;
      
      WHEN 'total_xp' THEN
        IF user_data.total_xp >= (achievement_record.criteria->>'value')::integer THEN
          INSERT INTO user_achievements (user_id, achievement_id) VALUES (NEW.user_id, achievement_record.id);
          UPDATE user_profiles SET achievements_earned = achievements_earned + 1, total_xp = total_xp + achievement_record.xp_reward WHERE id = NEW.user_id;
        END IF;
    END CASE;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE OR REPLACE TRIGGER trigger_update_xp
  AFTER INSERT ON user_lesson_progress
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION update_user_xp();

CREATE OR REPLACE TRIGGER trigger_update_streak
  AFTER INSERT OR UPDATE ON daily_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

CREATE OR REPLACE TRIGGER trigger_check_achievements
  AFTER INSERT OR UPDATE ON user_lesson_progress
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION check_achievements();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Climate Learner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER trigger_create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();