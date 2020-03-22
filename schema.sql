
DROP TABLE IF EXISTS locations2;

CREATE TABLE locations2 (
  id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(20,14),
    longitude NUMERIC(20,14)
);

INSERT INTO locations2 (search_query,formatted_query,latitude,longitude) 
VALUES ('sumthing','hello', 0, 0);

SELECT * FROM locations2;