import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { courseService } from "../../../lib/course-management/course-service";

export const courseRouter = createTRPCRouter({
	createTemplate: protectedProcedure
		.input(z.object({
			name: z.string(),
			programId: z.string(),
			subjects: z.array(z.string()),
			settings: z.record(z.any()).optional()
		}))
		.mutation(async ({ input }) => {
			return courseService.createCourseTemplate(input);
		}),

	getTemplates: protectedProcedure
		.query(async () => {
			return courseService.getTemplates();
		}),

	createClassGroupWithCourse: protectedProcedure
		.input(z.object({
			name: z.string(),
			description: z.string().optional(),
			programId: z.string(),
			calendarId: z.string(),
			course: z.object({
				name: z.string(),
				subjects: z.array(z.string()),
				inheritFromTemplate: z.string().optional(),
				settings: z.record(z.any()).optional()
			})
		}))
		.mutation(async ({ input }) => {
			return courseService.createClassGroupWithCourse(input);
		})
});