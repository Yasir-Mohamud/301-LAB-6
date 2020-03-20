
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255)
);

INSERT INTO locations (search_query,formatted_query,latitude,longitude) 
VALUES ('portland','hello', '0', '0');

-- SELECT * FROM locations;