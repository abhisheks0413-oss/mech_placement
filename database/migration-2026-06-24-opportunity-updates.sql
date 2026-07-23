USE cet_mech_placement;

ALTER TABLE opportunities
  MODIFY deadline DATETIME NOT NULL,
  ADD COLUMN applicationLinks JSON NULL AFTER applicationLink,
  ADD COLUMN compensation JSON NULL AFTER deadline;

ALTER TABLE alumni_insights
  ADD COLUMN passoutYear INT NOT NULL DEFAULT 2026 AFTER batch,
  ADD COLUMN ctc DECIMAL(6,2) NULL AFTER position,
  DROP COLUMN photo;

CREATE TABLE IF NOT EXISTS opportunity_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opportunityId INT NOT NULL,
  message TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_opportunity_updates_opportunity
    FOREIGN KEY (opportunityId) REFERENCES opportunities(id)
    ON DELETE CASCADE
);
