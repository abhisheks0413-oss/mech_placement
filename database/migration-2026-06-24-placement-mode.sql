USE cet_mech_placement;

ALTER TABLE placement_statistics
  ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER year;

ALTER TABLE alumni_insights
  ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER position;
