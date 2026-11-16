CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE class_bookings 
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP;

UPDATE class_bookings 
SET end_time = class_date + INTERVAL '1 hour' 
WHERE end_time IS NULL;

ALTER TABLE class_bookings 

ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE class_bookings RENAME COLUMN class_date To start_time;

ALTER TABLE class_bookings DROP CONSTRAINT IF EXISTS unique_teacher_class_date;

ALTER TABLE class_bookings ADD CONSTRAINT unique_teacher_class_date EXCLUDE USING gist (teacher_id WITH =, tsrange(start_time, end_time) WITH &&);
