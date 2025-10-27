CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    game VARCHAR(100) NOT NULL,
    mod_name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    download_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_translations_game ON translations(game);
