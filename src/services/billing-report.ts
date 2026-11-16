import { pool } from "../config/pool.ts";
import type { TeacherBillingReport } from "../models/billing-report.ts";

export async function getBillingReport(): Promise<Array<TeacherBillingReport>> {
    const client = await pool.connect();
    try {
        const query = await client.query('select t.name, count(cb.id) as total_class, (count(cb.id) * t.hourly_rate) as total_payment_value from teachers t left join class_bookings cb on cb.teacher_id = t.id and cb.deleted_at is null group by t.id;');
        return query.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release()
    }
}