import { bookSlot } from "../services/booking.ts";

(async () => {
    const startDate = new Date('2026-11-16 15:45:00');
    const endDate = new Date('2026-11-16 16:45:00')
    
    await bookSlot('1c951372-9988-471e-8da7-833b993fe43f', startDate, endDate);
})();