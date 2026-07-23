USE cet_mech_placement;

ALTER TABLE opportunities
  ADD COLUMN applicationLinks JSON NULL AFTER applicationLink;

UPDATE opportunities
SET applicationLinks = JSON_ARRAY(JSON_OBJECT('name', 'Application Link', 'url', applicationLink))
WHERE applicationLinks IS NULL AND applicationLink IS NOT NULL AND applicationLink <> '';
