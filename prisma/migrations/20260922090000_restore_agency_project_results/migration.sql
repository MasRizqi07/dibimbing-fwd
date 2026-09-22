-- Restore the three original project results only when they still contain
-- the temporary concept copy. Preserve operator-edited results.
UPDATE "Project" SET "result" = '+38% online orders'
WHERE "title" = 'Kopi Koma' AND "result" = 'Studi konsep identitas dan website untuk kedai kopi';
UPDATE "Project" SET "result" = '2.4x conversion rate'
WHERE "title" = 'Sora Studio' AND "result" = 'Studi konsep katalog digital untuk brand fashion';
UPDATE "Project" SET "result" = 'Booked out in 12 days'
WHERE "title" = 'Ruang Pulih' AND "result" = 'Studi konsep landing page untuk layanan wellness';
