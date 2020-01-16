CREATE EXTENSION postgis;
CREATE EXTENSION postgis_raster;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION postgis_tiger_geocoder CASCADE;
CREATE EXTENSION address_standardizer_data_us;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_sfcgal;

CREATE TABLE ptgeogwgs(gid serial PRIMARY KEY, geog geography(POINT) );
CREATE TABLE ptgeognad83(gid serial PRIMARY KEY, geog geography(POINT,4269) );
CREATE TABLE ptzgeogwgs84(gid serial PRIMARY KEY, geog geography(POINTZ,4326) );
CREATE TABLE lgeog(gid serial PRIMARY KEY, geog geography(LINESTRING) );
CREATE TABLE lgeognad27(gid serial PRIMARY KEY, geog geography(POLYGON,4267) );

CREATE TABLE global_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64),
    location GEOGRAPHY(POINT,4326)
  );

SELECT * FROM geography_columns;

CREATE INDEX global_points_gix ON global_points USING GIST ( location );

-- Show a distance query and note, London is outside the 1000km tolerance
SELECT name FROM global_points WHERE ST_DWithin(location, 'SRID=4326;POINT(-110 29)'::geography, 1000000);

-- Distance calculation using GEOGRAPHY (122.2km)
  SELECT ST_Distance('LINESTRING(-122.33 47.606, 0.0 51.5)'::geography, 'POINT(-21.96 64.15)'::geography);

SELECT 'SRID=4269;POINT(-123 34)'::geography;

SELECT 'SRID=4267;POINT(-123 34)'::geography;

-- NAD83 UTM zone meters, yields error since its a meter based projection
SELECT 'SRID=26910;POINT(-123 34)'::geography;



-- Add some data into the test table
-- 4326 means the WORLD
INSERT INTO global_points (name, location) VALUES ('Town', 'SRID=4326;POINT(-110 30)');
INSERT INTO global_points (name, location) VALUES ('Forest', 'SRID=4326;POINT(-109 29)');
INSERT INTO global_points (name, location) VALUES ('London', 'SRID=4326;POINT(0 49)');

SELECT * FROM global_points;
