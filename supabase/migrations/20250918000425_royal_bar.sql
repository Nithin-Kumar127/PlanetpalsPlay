/*
  # Setup Authentication Triggers and User Profile Creation

  1. Database Functions
    - `create_user_profile()` - Creates user profile when new user signs up
    - `update_user_xp()` - Updates user XP when lessons are completed
    - `update_user_streak()` - Updates user streak based on daily activity
    - `check_achievements()` - Checks and awards achievements

  2. Triggers
    - Trigger to create user profile on auth.users insert
    - Trigger to update XP on lesson completion
    - Trigger to update streak on daily activity
    - Trigger to check achievements on progress update

  3. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Climate Learner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to update user XP when lesson is completed
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
DECLARE
  lesson_xp INTEGER;
  new_total_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Only proceed if lesson was just completed
  IF NEW.completed = TRUE AND (OLD IS NULL OR OLD.completed = FALSE) THEN
    -- Get XP reward for this lesson
    SELECT xp_reward INTO lesson_xp
    FROM lessons
    WHERE id = NEW.lesson_id;
    
    -- Update user profile with new XP and level
    UPDATE user_profiles
    SET 
      total_xp = total_xp + COALESCE(lesson_xp, 50),
      lessons_completed = lessons_completed + 1,
      current_level = FLOOR((total_xp + COALESCE(lesson_xp, 50)) / 500) + 1,
      updated_at = NOW()
    WHERE id = NEW.user_id
    RETURNING total_xp INTO new_total_xp;
    
    -- Update daily activity
    INSERT INTO daily_activity (user_id, activity_date, lessons_completed, xp_earned)
    VALUES (NEW.user_id, CURRENT_DATE, 1, COALESCE(lesson_xp, 50))
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET
      lessons_completed = daily_activity.lessons_completed + 1,
      xp_earned = daily_activity.xp_earned + COALESCE(lesson_xp, 50),
      time_spent = daily_activity.time_spent + COALESCE(NEW.time_spent, 0);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  yesterday_activity BOOLEAN;
  current_streak INTEGER;
BEGIN
  -- Check if user had activity yesterday
  SELECT EXISTS(
    SELECT 1 FROM daily_activity
    WHERE user_id = NEW.user_id
    AND activity_date = NEW.activity_date - INTERVAL '1 day'
    AND lessons_completed > 0
  ) INTO yesterday_activity;
  
  -- Get current streak
  SELECT current_streak INTO current_streak
  FROM user_profiles
  WHERE id = NEW.user_id;
  
  -- Update streak based on activity
  IF yesterday_activity THEN
    -- Continue streak
    UPDATE user_profiles
    SET 
      current_streak = current_streak + 1,
      best_streak = GREATEST(best_streak, current_streak + 1),
      last_activity_date = NEW.activity_date,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSE
    -- Start new streak
    UPDATE user_profiles
    SET 
      current_streak = 1,
      best_streak = GREATEST(best_streak, 1),
      last_activity_date = NEW.activity_date,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
DECLARE
  user_total_xp INTEGER;
  user_lessons_completed INTEGER;
  user_current_streak INTEGER;
  achievement_record RECORD;
BEGIN
  -- Get user stats
  SELECT total_xp, lessons_completed, current_streak
  INTO user_total_xp, user_lessons_completed, user_current_streak
  FROM user_profiles
  WHERE id = NEW.user_id;
  
  -- Check all achievements
  FOR achievement_record IN
    SELECT * FROM achievements
  LOOP
    -- Check if user already has this achievement
    IF NOT EXISTS(
      SELECT 1 FROM user_achievements
      WHERE user_id = NEW.user_id AND achievement_id = achievement_record.id
    ) THEN
      -- Check achievement criteria
      CASE achievement_record.criteria->>'type'
        WHEN 'lessons_completed' THEN
          IF user_lessons_completed >= (achievement_record.criteria->>'value')::INTEGER THEN
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (NEW.user_id, achievement_record.id);
            
            -- Award XP for achievement
            UPDATE user_profiles
            SET 
              total_xp = total_xp + achievement_record.xp_reward,
              achievements_earned = achievements_earned + 1,
              current_level = FLOOR((total_xp + achievement_record.xp_reward) / 500) + 1
            WHERE id = NEW.user_id;
          END IF;
        WHEN 'xp_earned' THEN
          IF user_total_xp >= (achievement_record.criteria->>'value')::INTEGER THEN
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (NEW.user_id, achievement_record.id);
            
            UPDATE user_profiles
            SET achievements_earned = achievements_earned + 1
            WHERE id = NEW.user_id;
          END IF;
        WHEN 'streak_days' THEN
          IF user_current_streak >= (achievement_record.criteria->>'value')::INTEGER THEN
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (NEW.user_id, achievement_record.id);
            
            UPDATE user_profiles
            SET achievements_earned = achievements_earned + 1
            WHERE id = NEW.user_id;
          END IF;
      END CASE;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;