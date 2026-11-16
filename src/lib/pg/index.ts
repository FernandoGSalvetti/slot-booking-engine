import { pool } from "../../config/pool.ts";

export async function getPoolConnection() {
    try {
        return await pool.connect();
    } catch (error) {
        console.log('Failed to establish database connection')
        throw error
    }
}
