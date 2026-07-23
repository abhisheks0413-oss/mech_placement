USE cet_mech_placement;

ALTER TABLE opportunities
  ADD COLUMN status ENUM('Applications Open', 'Applications Closed') NOT NULL DEFAULT 'Applications Open' AFTER type;

ALTER TABLE placement_statistics
  ADD COLUMN years JSON NOT NULL DEFAULT (JSON_ARRAY()) AFTER package;

UPDATE placement_statistics
SET years = JSON_ARRAY(year)
WHERE JSON_LENGTH(years) = 0;

ALTER TABLE placement_statistics
  DROP COLUMN year,
  DROP COLUMN placementMode;

ALTER TABLE alumni_insights
  DROP COLUMN batch;
