import { getTeachers } from "../services/teachers.ts";

(async () => {
    const teachers = await getTeachers();
    console.log(teachers)
})();