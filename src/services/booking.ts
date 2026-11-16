import { DatabaseError } from 'pg';
import { pool } from '../config/pool.ts'
import { BookingErrorConstraints } from '../enums/constraints/booking/index.ts';
import { DuplicatedBookingError } from '../errors/duplicated-booking-error.ts';

export async function bookSlot(teacherId: string, startDate: Date, endDate: Date) {
    const bookingClient = await pool.connect();
    try {
        console.log({ teacherId, startDate,endDate });
        await bookingClient.query('BEGIN');
        const queryString = 'INSERT INTO class_bookings (teacher_id, start_time, end_time) values ($1, $2, $3) RETURNING *';
        const queryValues = [teacherId, startDate, endDate]
        await bookingClient.query(queryString, queryValues);
        console.log('Class booked: ', startDate, endDate);
        await bookingClient.query('COMMIT');
    } catch (error: unknown) {
        await bookingClient.query('ROLLBACK');
        if (error instanceof DatabaseError) {
            if (error.constraint === BookingErrorConstraints.UNIQUE_TEACHER_CLASS_DATE) {
                throw new DuplicatedBookingError(startDate, endDate);
            }
        }
        throw error;
    } finally {
        bookingClient.release()
    }
}