
DROP TABLE IF EXISTS cities;

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(20,14),
    longitude NUMERIC(20,14)
);

INSERT INTO cities (search_query,formatted_query,latitude,longitude) 
VALUES ('portland','hello', '0', '0');

SELECT * FROM cities;