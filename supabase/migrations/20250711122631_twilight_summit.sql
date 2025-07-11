/*
  # Vespa Excel Expert System Database Schema

  1. New Tables
    - `symptoms` - Stores symptom data (gejala)
      - `id` (text, primary key) - Symptom code (G001, G002, etc.)
      - `name` (text) - Symptom name
      - `description` (text) - Symptom description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `damages` - Stores damage data (kerusakan)
      - `id` (text, primary key) - Damage code (K001, K002, etc.)
      - `name` (text) - Damage name
      - `description` (text) - Damage description
      - `solution` (text) - Solution for the damage
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rules` - Stores expert system rules
      - `id` (text, primary key) - Rule code (R001, R002, etc.)
      - `damage_id` (text, foreign key) - References damages.id
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rule_symptoms` - Junction table for rules and symptoms with CF values
      - `id` (uuid, primary key)
      - `rule_id` (text, foreign key) - References rules.id
      - `symptom_id` (text, foreign key) - References symptoms.id
      - `cf_expert` (decimal) - Expert certainty factor (0.0 to 1.0)
      - `created_at` (timestamp)
    
    - `diagnosis_sessions` - Stores diagnosis sessions
      - `id` (uuid, primary key)
      - `session_date` (timestamp)
      - `total_symptoms` (integer) - Number of symptoms selected
      - `total_results` (integer) - Number of diagnosis results
      - `created_at` (timestamp)
    
    - `diagnosis_results` - Stores diagnosis results
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key) - References diagnosis_sessions.id
      - `damage_id` (text, foreign key) - References damages.id
      - `cf_final` (decimal) - Final certainty factor
      - `percentage` (integer) - Percentage value
      - `rank` (integer) - Result ranking
      - `created_at` (timestamp)
    
    - `user_symptoms` - Stores user selected symptoms for diagnosis
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key) - References diagnosis_sessions.id
      - `symptom_id` (text, foreign key) - References symptoms.id
      - `cf_user` (decimal) - User certainty factor
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (since this is a public expert system)
    - Add policies for authenticated users to manage data (admin functions)

  3. Indexes
    - Add indexes for better query performance
    - Foreign key indexes for joins
*/

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create damages table
CREATE TABLE IF NOT EXISTS damages (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rules table
CREATE TABLE IF NOT EXISTS rules (
  id text PRIMARY KEY,
  damage_id text NOT NULL REFERENCES damages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rule_symptoms junction table
CREATE TABLE IF NOT EXISTS rule_symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id text NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
  symptom_id text NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  cf_expert decimal(3,2) NOT NULL DEFAULT 0.0 CHECK (cf_expert >= 0.0 AND cf_expert <= 1.0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(rule_id, symptom_id)
);

-- Create diagnosis_sessions table
CREATE TABLE IF NOT EXISTS diagnosis_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date timestamptz DEFAULT now(),
  total_symptoms integer DEFAULT 0,
  total_results integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create diagnosis_results table
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES diagnosis_sessions(id) ON DELETE CASCADE,
  damage_id text NOT NULL REFERENCES damages(id) ON DELETE CASCADE,
  cf_final decimal(5,4) NOT NULL DEFAULT 0.0,
  percentage integer NOT NULL DEFAULT 0,
  rank integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create user_symptoms table
CREATE TABLE IF NOT EXISTS user_symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES diagnosis_sessions(id) ON DELETE CASCADE,
  symptom_id text NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  cf_user decimal(3,2) NOT NULL DEFAULT 0.0 CHECK (cf_user >= 0.0 AND cf_user <= 1.0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rules_damage_id ON rules(damage_id);
CREATE INDEX IF NOT EXISTS idx_rule_symptoms_rule_id ON rule_symptoms(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_symptoms_symptom_id ON rule_symptoms(symptom_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_session_id ON diagnosis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_damage_id ON diagnosis_results(damage_id);
CREATE INDEX IF NOT EXISTS idx_user_symptoms_session_id ON user_symptoms(session_id);
CREATE INDEX IF NOT EXISTS idx_user_symptoms_symptom_id ON user_symptoms(symptom_id);

-- Enable Row Level Security
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE damages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_symptoms ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (expert system is public)
CREATE POLICY "Allow public read access to symptoms"
  ON symptoms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to damages"
  ON damages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to rules"
  ON rules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to rule_symptoms"
  ON rule_symptoms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to diagnosis_sessions"
  ON diagnosis_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to diagnosis_results"
  ON diagnosis_results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to user_symptoms"
  ON user_symptoms FOR SELECT
  TO public
  USING (true);

-- Create policies for public insert access (for diagnosis functionality)
CREATE POLICY "Allow public insert to diagnosis_sessions"
  ON diagnosis_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert to diagnosis_results"
  ON diagnosis_results FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert to user_symptoms"
  ON user_symptoms FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for authenticated users (admin functions)
CREATE POLICY "Allow authenticated users to manage symptoms"
  ON symptoms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage damages"
  ON damages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage rules"
  ON rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage rule_symptoms"
  ON rule_symptoms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_symptoms_updated_at
  BEFORE UPDATE ON symptoms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damages_updated_at
  BEFORE UPDATE ON damages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();