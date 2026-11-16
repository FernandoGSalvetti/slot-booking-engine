export class DuplicatedBookingError extends Error {
    startDate: Date;
    endDate: Date;
    constructor(startDate: Date, endDate: Date) {
        super();
        this.name = 'DuplicatedBookingError'
        this.message = 'This teacher already has a class booked in this same date'
        this.startDate = startDate;
        this.endDate = endDate; 
    }
}