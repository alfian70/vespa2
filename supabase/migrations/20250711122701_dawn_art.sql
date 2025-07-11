/*
  # Insert Default Data for Vespa Excel Expert System

  1. Default Symptoms (Gejala)
  2. Default Damages (Kerusakan)
  3. Default Rules with Symptoms and CF values
*/

-- Insert default symptoms
INSERT INTO symptoms (id, name, description) VALUES
('G001', 'Mesin yang susah untuk di hidupkan', 'Mesin sulit dinyalakan saat starter atau engkol'),
('G002', 'Mesin mati mendadak saat digunakan', 'Mesin tiba-tiba mati saat sedang digunakan'),
('G003', 'Percikan api lemah', 'Api pada busi tidak kuat atau lemah'),
('G004', 'Mesin tersendat-sendat saat dihidupkan', 'Mesin tidak lancar saat dinyalakan'),
('G005', 'Bau bensin yang kuat karena bensin tidak turun ke karburator', 'Tercium bau bensin yang menyengat'),
('G006', 'Kebocoran dibagian bahan bakar', 'Terdapat kebocoran pada sistem bahan bakar'),
('G007', 'Lampu yang tidak berfungsi dengan baik (Mati)', 'Lampu tidak menyala atau bermasalah'),
('G008', 'Salah alur listrik', 'Sistem kelistrikan tidak berfungsi dengan benar'),
('G009', 'Kabel putus', 'Terdapat kabel yang putus pada sistem kelistrikan'),
('G010', 'Suhu mesin yang meningkat secara drastis', 'Mesin mengalami kenaikan suhu yang signifikan'),
('G011', 'Suara kasar pada mesin', 'Mesin mengeluarkan suara yang tidak normal'),
('G012', 'Pengapian yang tidak konsisten', 'Sistem pengapian tidak stabil'),
('G013', 'Gigi perseneling yang terlepas saat digunakan', 'Transmisi bermasalah saat perpindahan gigi'),
('G014', 'Terdengar suara berdecit disaat mengganti gigi', 'Suara tidak normal saat perpindahan gigi'),
('G015', 'Getaran pada vespa yang berlebih saat berkendara', 'Getaran tidak normal saat berkendara'),
('G016', 'Suspensi yang terasa tidak responsive', 'Suspensi tidak bekerja dengan baik'),
('G017', 'Suara mengericik pada mesin', 'Mesin mengeluarkan suara mengericik'),
('G018', 'Shock keluar oli', 'Kebocoran oli pada sistem suspensi'),
('G019', 'Sering terjadinya macet', 'Mesin sering mengalami kemacetan'),
('G020', 'Terdengar suara berdecit saat melintas jalan yang kasar', 'Suara tidak normal saat melewati jalan rusak'),
('G021', 'Mesin susah untuk beralih gigi', 'Kesulitan dalam perpindahan gigi'),
('G022', 'Suara berdecit saat mengerem', 'Rem mengeluarkan suara tidak normal'),
('G023', 'Rem yang tidak responsive', 'Sistem pengereman tidak bekerja optimal'),
('G024', 'Pedal rem Terasa kendur', 'Pedal rem tidak memiliki tekanan yang cukup'),
('G025', 'Kompling terasa keras saat ditekan', 'Kopling sulit untuk ditekan'),
('G026', 'Kopling tidak mau netral', 'Kopling tidak dapat kembali ke posisi netral'),
('G027', 'Kopling kasar', 'Kopling tidak bekerja dengan halus'),
('G028', 'Suara berdecit/berderit dari roda atau ban', 'Suara tidak normal dari area roda'),
('G029', 'Ban/roda haus secara tidak merata', 'Keausan ban tidak merata'),
('G030', 'Stang susah saat di belokan', 'Kemudi terasa berat saat digunakan'),
('G031', 'Saat di rem ngebuang', 'Rem tidak stabil saat digunakan'),
('G032', 'Saat berkendara bagian roda tidak stabil', 'Roda mengalami ketidakstabilan'),
('G033', 'Mesin tidak nyala saat di stater', 'Starter tidak dapat menghidupkan mesin'),
('G034', 'Stater mati total', 'Sistem starter tidak berfungsi sama sekali'),
('G035', 'Sein motor menyala tidak berkedip', 'Lampu sein tidak berkedip normal'),
('G036', 'Sein motor mati', 'Lampu sein tidak menyala')
ON CONFLICT (id) DO NOTHING;

-- Insert default damages
INSERT INTO damages (id, name, description, solution) VALUES
('K001', 'CDI vespa excel', 'Kerusakan pada sistem CDI', 'Periksa dan ganti CDI jika diperlukan'),
('K002', 'Busi vespa excel', 'Kerusakan pada busi', 'Bersihkan atau ganti busi'),
('K003', 'Magnet kipas vespa excel', 'Kerusakan pada magnet kipas', 'Periksa dan perbaiki sistem magnet kipas'),
('K004', 'Karburator Bakar vespa excel', 'Kerusakan pada karburator', 'Bersihkan dan setel karburator'),
('K005', 'Pengereman vespa excel', 'Masalah pada sistem rem', 'Periksa dan perbaiki sistem pengereman'),
('K006', 'Transmisi vespa excel', 'Kerusakan pada sistem transmisi', 'Periksa dan perbaiki sistem transmisi'),
('K007', 'Suspensi vespa excel', 'Kerusakan pada suspensi', 'Periksa dan perbaiki sistem suspensi'),
('K008', 'Kelistrikan vespa excel', 'Masalah pada sistem kelistrikan', 'Periksa dan perbaiki sistem kelistrikan'),
('K009', 'Komstir vespa excel', 'Kerusakan pada komstir', 'Periksa dan perbaiki komstir'),
('K010', 'Kopling vespa excel', 'Kerusakan pada kopling', 'Periksa dan perbaiki sistem kopling'),
('K011', 'Ban vespa excel', 'Masalah pada ban', 'Periksa dan ganti ban jika diperlukan'),
('K012', 'Roda vespa excel', 'Kerusakan pada roda', 'Periksa dan perbaiki sistem roda'),
('K013', 'Blok piston vespa excel', 'Kerusakan pada blok piston', 'Periksa dan perbaiki blok piston'),
('K014', 'Stater vespa excel', 'Kerusakan pada sistem starter', 'Periksa dan perbaiki sistem starter'),
('K015', 'Lampu vespa excel', 'Masalah pada sistem lampu', 'Periksa dan perbaiki sistem penerangan')
ON CONFLICT (id) DO NOTHING;

-- Insert default rules
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
('R010', 'K010'),
('R011', 'K011'),
('R012', 'K012'),
('R013', 'K013'),
('R014', 'K014'),
('R015', 'K015')
ON CONFLICT (id) DO NOTHING;

-- Insert rule symptoms with CF values
INSERT INTO rule_symptoms (rule_id, symptom_id, cf_expert) VALUES
-- Rule R001 (CDI vespa excel)
('R001', 'G001', 0.6),
('R001', 'G003', 0.6),
('R001', 'G004', 0.3),
('R001', 'G012', 0.4),
('R001', 'G033', 0.4),

-- Rule R002 (Busi vespa excel)
('R002', 'G001', 0.8),
('R002', 'G002', 0.7),
('R002', 'G003', 0.8),
('R002', 'G004', 0.5),
('R002', 'G012', 0.6),
('R002', 'G033', 0.5),

-- Rule R003 (Magnet kipas vespa excel)
('R003', 'G010', 0.4),
('R003', 'G011', 0.1),

-- Rule R004 (Karburator Bakar vespa excel)
('R004', 'G004', 0.5),
('R004', 'G005', 0.7),
('R004', 'G006', 0.5),
('R004', 'G019', 0.4),

-- Rule R005 (Pengereman vespa excel)
('R005', 'G022', 0.4),
('R005', 'G023', 0.4),
('R005', 'G024', 0.5),
('R005', 'G031', 0.7),

-- Rule R006 (Transmisi vespa excel)
('R006', 'G013', 0.5),
('R006', 'G014', 0.3),
('R006', 'G015', 0.1),
('R006', 'G021', 0.5),

-- Rule R007 (Suspensi vespa excel)
('R007', 'G016', 0.5),
('R007', 'G018', 0.2),

-- Rule R008 (Kelistrikan vespa excel)
('R008', 'G003', 0.7),
('R008', 'G008', 0.6),
('R008', 'G009', 0.4),

-- Rule R009 (Komstir vespa excel)
('R009', 'G020', 0.4),
('R009', 'G030', 0.4),
('R009', 'G032', 0.5),

-- Rule R010 (Kopling vespa excel)
('R010', 'G025', 0.3),
('R010', 'G026', 0.5),
('R010', 'G027', 0.5),

-- Rule R011 (Ban vespa excel)
('R011', 'G028', 0.6),
('R011', 'G029', 0.4),

-- Rule R012 (Roda vespa excel)
('R012', 'G020', 0.4),
('R012', 'G028', 0.7),
('R012', 'G029', 0.4),
('R012', 'G032', 0.1),

-- Rule R013 (Blok piston vespa excel)
('R013', 'G001', 0.5),
('R013', 'G002', 0.5),
('R013', 'G004', 0.3),
('R013', 'G015', 0.6),
('R013', 'G017', 0.6),
('R013', 'G033', 0.6),

-- Rule R014 (Stater vespa excel)
('R014', 'G033', 0.8),
('R014', 'G034', 0.7),

-- Rule R015 (Lampu vespa excel)
('R015', 'G007', 0.7),
('R015', 'G008', 0.6),
('R015', 'G009', 0.5),
('R015', 'G035', 0.5),
('R015', 'G036', 0.4)
ON CONFLICT (rule_id, symptom_id) DO NOTHING;