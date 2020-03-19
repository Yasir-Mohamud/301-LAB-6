

DROP TABLE IF EXISTS city_explorer_table;

CREATE TABLE city_explorer_table (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255)
);

INSERT INTO city_explorer_table (city_name,latitude,longitude) 
VALUES ('Seattle', 'lat.test','lon.test');

SELECT * FROM city_explorer_table;