import { Hono } from "hono";
import { tuple, z } from 'zod'
import { authAdmin } from "../middlewares/authAdmin";
import { CourseType, PrismaClient } from "@prisma/client";

const app = new Hono<{
    Variables: {
        instituteId: String
        prisma: PrismaClient
    }
}>();


app.use(authAdmin);
app.get('/schedule/data/:scheduleId', async (c) => {
    const scheduleId = c.req.param('scheduleId');
    const prisma = c.get("prisma");

    try {
      const data=await  prisma.schedule.findFirst({
            where: { id: scheduleId },
            select: {
                days: true,
                slots: true,
                rooms: {
                    select: {
                        code: true,
                        isLab: true,
                        capacity: true,
                        id: true,
                    }
                },
                
                    classes:{
                        include: {
                            batches: { select: { id: true, name: true } },
                            concurrentClasses: {select: {id: true}},
                            concurrentByClasses: {select: {id: true}},
                            course: {
                                select: {
                                    credits: true,
                                    courseType: true,
                                    name: true
                                }
                            },
                            faculty: {
                                select : {
                                    name: true
                                }
                            },
                            StudentGroup: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    } ,

                    facultyAvailability:{
                        select: { availability: true, facultyId: true, scheduleId: true }
                    } ,
                    studentGroupAvailability:{
                        select: { availability: true, studentGroupId: true, scheduleId: true }   
                    }
                                }
        });
        
        if (!data) {
            return c.json({ message: "No such Schedule" }, { status: 404 });
        }

        return c.json(data, { status: 200 })

    } catch (e) {
        console.error("Error fetching schedule data:", e);
        return c.json({ message: "Something went wrong" }, { status: 500 });
    }
});
export default app;