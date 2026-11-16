CREATE TABLE IF NOT EXISTS schema_migrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(250) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)