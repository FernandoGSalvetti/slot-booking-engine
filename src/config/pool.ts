import dotenv from 'dotenv';
import { Pool } from 'pg'

dotenv.config();

const pool = new Pool({
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'localhost'
})

export { pool }