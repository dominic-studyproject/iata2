-- IATA 항공사 코드 관리 데이터베이스 스키마
-- Supabase에서 실행할 SQL 스크립트

-- 항공사 테이블 생성
CREATE TABLE airlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numeric_code CHAR(3) NOT NULL UNIQUE CHECK (numeric_code ~ '^[0-9]{3}$'),
  iata_code CHAR(2) NOT NULL UNIQUE CHECK (iata_code ~ '^[A-Z]{2}$'),
  name VARCHAR(255) NOT NULL,
  country_code CHAR(2) CHECK (country_code ~ '^[A-Z]{2}$'),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 인덱스 생성
CREATE INDEX idx_airlines_numeric_code ON airlines(numeric_code);
CREATE INDEX idx_airlines_iata_code ON airlines(iata_code);
CREATE INDEX idx_airlines_active ON airlines(active);
CREATE INDEX idx_airlines_country_code ON airlines(country_code);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거
CREATE TRIGGER update_airlines_updated_at BEFORE UPDATE
    ON airlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 설정
CREATE POLICY "Allow public read access" ON airlines
    FOR SELECT USING (true);

-- 인증된 사용자만 CUD 작업 가능하도록 정책 설정
CREATE POLICY "Allow authenticated users to insert" ON airlines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON airlines
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON airlines
    FOR DELETE USING (auth.role() = 'authenticated');

-- 샘플 데이터 삽입
INSERT INTO airlines (numeric_code, iata_code, name, country_code) VALUES
('001', 'AA', 'American Airlines', 'US'),
('020', 'LH', 'Lufthansa', 'DE'),
('079', 'KL', 'KLM Royal Dutch Airlines', 'NL'),
('180', 'KE', 'Korean Air', 'KR'),
('988', 'OZ', 'Asiana Airlines', 'KR');

-- 공항 테이블 생성
CREATE TABLE airports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  iata_code CHAR(3) NOT NULL UNIQUE CHECK (iata_code ~ '^[A-Z]{3}$'),
  icao_code CHAR(4) CHECK (icao_code ~ '^[A-Z]{4}$'),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country_code CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  elevation INTEGER,
  timezone VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 공항 인덱스 생성
CREATE INDEX idx_airports_iata_code ON airports(iata_code);
CREATE INDEX idx_airports_icao_code ON airports(icao_code);
CREATE INDEX idx_airports_country_code ON airports(country_code);
CREATE INDEX idx_airports_city ON airports(city);
CREATE INDEX idx_airports_active ON airports(active);

-- 공항 updated_at 트리거
CREATE TRIGGER update_airports_updated_at BEFORE UPDATE
    ON airports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 공항 RLS 활성화
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;

-- 공항 읽기 정책
CREATE POLICY "Allow public read access on airports" ON airports
    FOR SELECT USING (true);

-- 공항 CUD 정책
CREATE POLICY "Allow authenticated users to insert airports" ON airports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update airports" ON airports
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete airports" ON airports
    FOR DELETE USING (auth.role() = 'authenticated');

-- 공항 샘플 데이터
INSERT INTO airports (iata_code, icao_code, name, city, country_code, latitude, longitude, elevation, timezone) VALUES
('ICN', 'RKSI', '인천국제공항', '인천', 'KR', 37.469075, 126.450517, 7, 'Asia/Seoul'),
('GMP', 'RKSS', '김포국제공항', '서울', 'KR', 37.558311, 126.790514, 18, 'Asia/Seoul'),
('LAX', 'KLAX', 'Los Angeles International Airport', 'Los Angeles', 'US', 33.942536, -118.408075, 38, 'America/Los_Angeles'),
('JFK', 'KJFK', 'John F. Kennedy International Airport', 'New York', 'US', 40.639751, -73.778925, 4, 'America/New_York'),
('NRT', 'RJAA', '나리타국제공항', '나리타', 'JP', 35.764722, 140.386389, 43, 'Asia/Tokyo');