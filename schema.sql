DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie (
    id  SERIAL PRIMARY KEY, 
    name varchar(65535),
    time varchar(65535),
    summary varchar(65535),
    image varchar(65535),
    comment varchar(65535)
);