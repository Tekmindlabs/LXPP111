import { z } from "zod";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED"
}

export const attendanceSchema = z.object({
  studentId: z.string(),
  status: z.enum([
    AttendanceStatus.PRESENT,
    AttendanceStatus.ABSENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED
  ]),
  date: z.date(),
  classId: z.string(),
  notes: z.string().optional()
});

export type AttendanceRecord = z.infer<typeof attendanceSchema>;