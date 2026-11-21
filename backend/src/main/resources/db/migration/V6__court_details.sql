ALTER TABLE courts ADD COLUMN surface VARCHAR(40) NOT NULL DEFAULT 'Hard court';
ALTER TABLE courts ADD COLUMN setting VARCHAR(10) NOT NULL DEFAULT 'OUTDOOR' CHECK (setting IN ('INDOOR', 'OUTDOOR'));
ALTER TABLE courts ADD COLUMN description VARCHAR(300) NOT NULL DEFAULT '';
ALTER TABLE courts ADD COLUMN price_per_hour INTEGER NOT NULL DEFAULT 0 CHECK (price_per_hour >= 0);

-- sample details for the four starter courts; the admin can edit them in the app
UPDATE courts SET surface = 'Acrylic hard court',
                  description = 'Regulation 20 x 44 ft pickleball court with a standard net.',
                  price_per_hour = 400;
UPDATE courts SET setting = 'INDOOR' WHERE id IN (1, 2);
