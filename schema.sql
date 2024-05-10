DROP TABLE IF EXISTS meme;

CREATE TABLE IF NOT EXISTS meme (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255),
    meme_name VARCHAR(255),
    rank INTEGER,
    tags VARCHAR(10000),
    top_text VARCHAR(10000)
);

-- image_path, meme_name, rank, tags, top_text