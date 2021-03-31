create TABLE users(
    id uuid PRIMARY KEY,
    login VARCHAR(255),
    password VARCHAR(255),
    age INTEGER,
    isdeleted BOOLEAN NOT NULL DEFAULT false
);
