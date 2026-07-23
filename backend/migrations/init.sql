CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  surname TEXT,
  dob DATE,
  sex TEXT,
  height INTEGER,
  weight INTEGER,
  fiscal_code TEXT,
  emergency_details TEXT
);

CREATE TABLE IF NOT EXISTS emergency (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  emergency_data TEXT
);

CREATE TABLE IF NOT EXISTS archive (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category TEXT,
  title TEXT,
  file_path TEXT,
  date DATE,
  doctor TEXT,
  notes TEXT,
  tags JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  type TEXT,
  doctor TEXT,
  facility TEXT,
  address TEXT,
  date TIMESTAMPTZ,
  notes TEXT,
  report_id INTEGER
);

CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  ingredient TEXT,
  dosage TEXT,
  frequency TEXT,
  route TEXT,
  reason TEXT,
  start_date DATE,
  end_date DATE,
  prescriber TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS vitals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT,
  systolic INTEGER,
  diastolic INTEGER,
  heart_rate INTEGER,
  oxygen INTEGER,
  glucose INTEGER,
  weight NUMERIC,
  bmi NUMERIC,
  temperature NUMERIC,
  cholesterol_total NUMERIC,
  ldl NUMERIC,
  hdl NUMERIC,
  triglycerides NUMERIC,
  hemoglobin NUMERIC,
  creatinine NUMERIC,
  tsh NUMERIC,
  recorded_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS vaccines (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vaccine_name TEXT,
  date DATE,
  lot TEXT,
  facility TEXT,
  doctor TEXT,
  notes TEXT
);
