CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email varchar(155) unique not null,
	lname varchar(155),
	fname varchar(155),
	created_at timestamp DEFAULT current_timestamp,
        isadmin boolean
);

CREATE TABLE user_password (
    user_id int PRIMARY KEY REFERENCES users(id) on delete cascade,
    password varchar(255)
);

CREATE TABLE user_requests (
        id SERIAL PRIMARY KEY,
	user_id int references users(id) on delete set null,
	created_at timestamp DEFAULT current_timestamp,
	status varchar(50),
	request_text text,
	is_deleted boolean DEFAULT false NOT NULL
);

CREATE TABLE locations (
        id SERIAL PRIMARY KEY,
	category varchar(100),
	geo GEOMETRY(point, 4326) not null
);

CREATE INDEX locations_geom_idx
ON locations
USING GIST (geo);

CREATE TABLE saved_locations (
    user_id int REFERENCES users(id) on delete cascade,
    location_id int REFERENCES locations(id) on delete cascade,
    risk_score int,
    avg_noise_level text,
    address text,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    schools JSONB,
    route_infos JSONB,
    PRIMARY KEY (user_id, location_id)
);

CREATE TABLE forum_posts (
        id SERIAL PRIMARY KEY,
	user_id int references users(id) on delete cascade,
	location_id int references locations(id) on delete cascade,
	content text not null,
	title varchar(100) not null,
	created_at timestamp DEFAULT current_timestamp
);

CREATE TABLE forum_comments (
        id SERIAL PRIMARY KEY,
        user_id int references users(id) on delete cascade,
        forum_post_id int references forum_posts(id) on delete cascade,
        content text not null,
        created_at timestamp DEFAULT current_timestamp
);

CREATE TABLE safety_measurements (
        id SERIAL PRIMARY KEY,
	location_id int references locations(id) on delete cascade,
	safety_score int,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	injury_count int,
	fatality_count int,
	accident_count int
);

CREATE TABLE noise_measurements (
        id SERIAL PRIMARY KEY,
        location_id int references locations(id) on delete cascade,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp,
	noise_level int,
	geo GEOMETRY(polygon, 4326)
);

CREATE INDEX noise_measurements_area_idx
ON noise_measurements
USING GIST (geo);

CREATE TABLE city_events (
	id SERIAL PRIMARY KEY,
	location_id INT REFERENCES locations(id) ON DELETE CASCADE,
	title VARCHAR(200) NOT NULL,
	description TEXT,
	status VARCHAR(50),
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP,
	timezone VARCHAR(50) DEFAULT 'EET',
	creator VARCHAR(100),
	organizer VARCHAR(100),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meeting_minutes (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    file_id INT UNIQUE NOT NULL ,
    title VARCHAR(200),
    meeting_time TIMESTAMP,
    chairperson VARCHAR(200),
    secretary VARCHAR(200),
    attendees JSONB,
    items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    name VARCHAR(200),
    is_priority boolean,
    classes JSONB,
    languages JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forum_post_liked_user (
    id SERIAL PRIMARY KEY,
    forum_post_id int NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (forum_post_id, user_id)
);

CREATE TABLE forum_post_disliked_user (
    id SERIAL PRIMARY KEY,
    forum_post_id int NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (forum_post_id, user_id)
);

CREATE TABLE forum_comment_liked_user (
    id SERIAL PRIMARY KEY,
    forum_comment_id int NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (forum_comment_id, user_id)
);

CREATE TABLE forum_comment_disliked_user (
    id SERIAL PRIMARY KEY,
    forum_comment_id int NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (forum_comment_id, user_id)
);
