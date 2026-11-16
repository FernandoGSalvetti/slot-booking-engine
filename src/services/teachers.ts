import { pool } from "../config/pool.ts";
import type { Teacher } from "../models/teacher.ts";

export async function getTeachers() : Promise<Array<Teacher>>{
    const client = await pool.connect();
    try{
        const query = await client.query<Teacher>('SELECT id, name, hourly_rate FROM teachers');
        return query.rows;
    }catch(error){
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
}