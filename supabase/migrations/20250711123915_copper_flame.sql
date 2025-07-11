/*
  # Insert Default Data for Vespa Excel Expert System

  1. Default Symptoms (Gejala)
    - Common Vespa Excel problems and symptoms
    - Each with unique ID (G001, G002, etc.)

  2. Default Damages (Kerusakan)
    - Common Vespa Excel damages/problems
    - Each with unique ID (K001, K002, etc.)
    - Includes solutions for each problem

  3. Default Rules
    - Expert system rules connecting symptoms to damages
    - CF (Certainty Factor) values for each symptom-damage relationship
*/

-- Insert default symptoms
INSERT INTO symptoms (id, name, description) VALUES
('G001', 'Mesin tidak mau hidup', 'Mesin Vespa Excel tidak dapat dihidupkan sama sekali'),
('G002', 'Mesin susah hidup', 'Mesin Vespa Excel sulit untuk dihidupkan, perlu beberapa kali percobaan'),
('G003', 'Mesin mati mendadak', 'Mesin tiba-tiba mati saat sedang berjalan'),
('G004', 'Suara mesin kasar', 'Suara mesin tidak halus, terdengar kasar atau tidak normal'),
('G005', 'Mesin overheat', 'Mesin cepat panas berlebihan saat digunakan'),
('G006', 'Asap putih dari knalpot', 'Keluar asap berwarna putih dari knalpot'),
('G007', 'Asap hitam dari knalpot', 'Keluar asap berwarna hitam pekat dari knalpot'),
('G008', 'Konsumsi bensin boros', 'Penggunaan bahan bakar lebih boros dari biasanya'),
('G009', 'Tenaga mesin lemah', 'Tenaga mesin terasa kurang bertenaga saat dikendarai'),
('G010', 'Getaran berlebihan', 'Motor bergetar lebih dari normal saat mesin hidup'),
('G011', 'Sulit berakselerasi', 'Motor sulit untuk menambah kecepatan saat gas ditarik'),
('G012', 'Mesin brebet', 'Mesin tersendat-sendat saat digas'),
('G013', 'Starter tidak berfungsi', 'Sistem starter elektrik tidak dapat berfungsi'),
('G014', 'Lampu tidak menyala', 'Sistem penerangan tidak berfungsi dengan baik'),
('G015', 'Klakson tidak bunyi', 'Klakson tidak mengeluarkan suara'),
('G016', 'Rem tidak pakem', 'Sistem pengereman tidak berfungsi optimal'),
('G017', 'Rantai kendor', 'Rantai penggerak dalam kondisi kendor'),
('G018', 'Oli mesin bocor', 'Terdapat kebocoran oli mesin'),
('G019', 'Radiator bocor', 'Sistem pendingin mengalami kebocoran'),
('G020', 'Suara berisik dari CVT', 'Terdengar suara tidak normal dari sistem CVT');

-- Insert default damages
INSERT INTO damages (id, name, description, solution) VALUES
('K001', 'Kerusakan Sistem Pengapian', 'Masalah pada sistem pengapian yang menyebabkan mesin sulit hidup atau mati', 'Periksa dan ganti busi, periksa kabel pengapian, periksa CDI dan koil pengapian'),
('K002', 'Kerusakan Karburator', 'Karburator kotor atau rusak menyebabkan campuran bahan bakar tidak optimal', 'Bersihkan karburator, setel ulang campuran udara dan bahan bakar, ganti komponen yang rusak'),
('K003', 'Kerusakan Sistem Bahan Bakar', 'Masalah pada sistem bahan bakar yang mengganggu suplai bensin ke mesin', 'Periksa tangki bensin, bersihkan saringan bensin, periksa pompa bensin'),
('K004', 'Kerusakan Mesin', 'Kerusakan internal mesin seperti piston, ring piston, atau silinder', 'Overhaul mesin, ganti piston dan ring piston, boring silinder jika diperlukan'),
('K005', 'Kerusakan Sistem Pendingin', 'Masalah pada sistem pendingin yang menyebabkan mesin overheat', 'Periksa dan tambah coolant, perbaiki kebocoran radiator, ganti thermostat'),
('K006', 'Kerusakan Sistem Listrik', 'Masalah pada sistem kelistrikan motor', 'Periksa aki, periksa alternator, periksa kabel-kabel listrik, ganti sekring yang putus'),
('K007', 'Kerusakan Sistem Transmisi CVT', 'Masalah pada sistem transmisi otomatis CVT', 'Ganti belt CVT, periksa roller CVT, bersihkan rumah CVT'),
('K008', 'Kerusakan Sistem Rem', 'Masalah pada sistem pengereman', 'Ganti kampas rem, periksa minyak rem, bleeding sistem rem'),
('K009', 'Kerusakan Sistem Pelumasan', 'Masalah pada sistem pelumasan mesin', 'Ganti oli mesin, periksa pompa oli, perbaiki kebocoran oli'),
('K010', 'Kerusakan Komponen Mekanis', 'Kerusakan pada komponen mekanis seperti rantai, sproket, bearing', 'Ganti rantai dan sproket, ganti bearing yang aus, setel ulang komponen');

-- Insert default rules (one rule per damage)
INSERT INTO rules (id, damage_id) VALUES
('R001', 'K001'),
('R002', 'K002'),
('R003', 'K003'),
('R004', 'K004'),
('R005', 'K005'),
('R006', 'K006'),
('R007', 'K007'),
('R008', 'K008'),
('R009', 'K009'),
('R010', 'K010');

-- Insert rule_symptoms relationships with CF values
INSERT INTO rule_symptoms (rule_id, symptom_id, cf_expert) VALUES
-- Rule R001 (Kerusakan Sistem Pengapian)
('R001', 'G001', 0.9),  -- Mesin tidak mau hidup
('R001', 'G002', 0.8),  -- Mesin susah hidup
('R001', 'G003', 0.7),  -- Mesin mati mendadak
('R001', 'G013', 0.6),  -- Starter tidak berfungsi

-- Rule R002 (Kerusakan Karburator)
('R002', 'G002', 0.8),  -- Mesin susah hidup
('R002', 'G008', 0.9),  -- Konsumsi bensin boros
('R002', 'G009', 0.7),  -- Tenaga mesin lemah
('R002', 'G012', 0.8),  -- Mesin brebet
('R002', 'G007', 0.6),  -- Asap hitam dari knalpot

-- Rule R003 (Kerusakan Sistem Bahan Bakar)
('R003', 'G001', 0.7),  -- Mesin tidak mau hidup
('R003', 'G002', 0.8),  -- Mesin susah hidup
('R003', 'G003', 0.9),  -- Mesin mati mendadak
('R003', 'G009', 0.6),  -- Tenaga mesin lemah

-- Rule R004 (Kerusakan Mesin)
('R004', 'G004', 0.9),  -- Suara mesin kasar
('R004', 'G006', 0.8),  -- Asap putih dari knalpot
('R004', 'G008', 0.7),  -- Konsumsi bensin boros
('R004', 'G009', 0.8),  -- Tenaga mesin lemah
('R004', 'G010', 0.7),  -- Getaran berlebihan
('R004', 'G018', 0.6),  -- Oli mesin bocor

-- Rule R005 (Kerusakan Sistem Pendingin)
('R005', 'G005', 0.9),  -- Mesin overheat
('R005', 'G006', 0.7),  -- Asap putih dari knalpot
('R005', 'G019', 0.8),  -- Radiator bocor

-- Rule R006 (Kerusakan Sistem Listrik)
('R006', 'G013', 0.8),  -- Starter tidak berfungsi
('R006', 'G014', 0.9),  -- Lampu tidak menyala
('R006', 'G015', 0.7),  -- Klakson tidak bunyi

-- Rule R007 (Kerusakan Sistem Transmisi CVT)
('R007', 'G009', 0.8),  -- Tenaga mesin lemah
('R007', 'G011', 0.9),  -- Sulit berakselerasi
('R007', 'G020', 0.8),  -- Suara berisik dari CVT

-- Rule R008 (Kerusakan Sistem Rem)
('R008', 'G016', 0.9),  -- Rem tidak pakem

-- Rule R009 (Kerusakan Sistem Pelumasan)
('R009', 'G004', 0.7),  -- Suara mesin kasar
('R009', 'G005', 0.6),  -- Mesin overheat
('R009', 'G018', 0.9),  -- Oli mesin bocor

-- Rule R010 (Kerusakan Komponen Mekanis)
('R010', 'G010', 0.8),  -- Getaran berlebihan
('R010', 'G017', 0.9);  -- Rantai kendor