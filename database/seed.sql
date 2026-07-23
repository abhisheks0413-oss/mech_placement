USE cet_mech_placement;

INSERT INTO placement_statistics (company, package, placementMode, years, notes) VALUES
('Larsen & Toubro', 8.50, 'On Campus', JSON_ARRAY(2025, 2024), 'Graduate engineer trainee roles across manufacturing and projects.'),
('Tata Steel', 10.20, 'Off Campus', JSON_ARRAY(2025), 'Core mechanical profile with operations exposure.'),
('Bosch', 12.00, 'On Campus', JSON_ARRAY(2024), 'Product engineering and manufacturing systems roles.');

INSERT INTO opportunities (type, status, company, description, applicationLink, applicationLinks, deadline, compensation, documents, logo) VALUES
('Internship', 'Applications Open', 'Bharat Forge', 'Summer internship for mechanical design, process planning, and manufacturing analytics. Students should prepare a concise resume with CAD and manufacturing exposure highlighted.', 'https://example.com/apply/bharat-forge', JSON_ARRAY(JSON_OBJECT('name', 'Application Form', 'url', 'https://example.com/apply/bharat-forge')), '2026-07-15 17:00:00', JSON_ARRAY(JSON_OBJECT('label', 'Stipend', 'amount', 25000)), JSON_ARRAY(), NULL),
('Placement', 'Applications Open', 'Schneider Electric', 'Campus placement drive for graduate engineer trainee roles in energy systems, industrial automation, and operations excellence.', 'https://example.com/apply/schneider', JSON_ARRAY(JSON_OBJECT('name', 'Registration Form', 'url', 'https://example.com/apply/schneider')), '2026-08-01 17:30:00', JSON_ARRAY(JSON_OBJECT('label', 'GET Offer', 'amount', 8.5), JSON_OBJECT('label', 'R&D Offer', 'amount', 12.5)), JSON_ARRAY(), NULL);

INSERT INTO alumni_insights (name, company, passoutYear, position, placementMode, ctc, review) VALUES
('Ananya Nair', 'Bosch', 2022, 'Design Engineer', 'Off Campus', 12.00, 'Focus on fundamentals, thermal systems, manufacturing processes, and one strong project story. Interviewers were most interested in how clearly I explained tradeoffs.'),
('Rahul Menon', 'Tata Steel', 2021, 'Operations Manager', 'On Campus', 10.20, 'For plant roles, prepare safety, materials, production planning, and real examples from internships. Keep answers structured and practical.');

