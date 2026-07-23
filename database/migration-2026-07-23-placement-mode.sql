USE cet_mech_placement;

ALTER TABLE placement_statistics
  MODIFY package DECIMAL(6,2) NULL,
  ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER package;

UPDATE placement_statistics
SET placementMode = 'On Campus'
WHERE placementMode IS NULL;
