CREATE TABLE channels (uuid VARCHAR primary key, location geography(POLYGON,4326), created_at timestamptz default now());

DROP TABLE channels;

insert into channels values ('A89E8666-362E-4CA7-A3D3-AFC847E58B3B', ST_AsText( ST_MakeEnvelope(10, 10, 11, 11, 4326) ):: geography)
ON CONFLICT ON CONSTRAINT channels_pkey
DO
      UPDATE
      set location = ST_AsText( ST_MakeEnvelope(10, 10, 11, 11, 4326) ):: geography


-- 39.940442289176545 -75.18184661865236 39.96215529664293 -75.16416549682619

select * from channels;
