import { Course, Subject, TeacherAssignment, CourseStructure, ClassActivity, ProgressTracking } from '../../types/course-management';
import { db } from '../db';

export class CourseManagementService {
	async createCourse(courseData: Omit<Course, 'id' | 'subjects'>): Promise<Course> {
		const course = await db.course.create({
			data: {
				name: courseData.name,
				academicYear: courseData.academicYear,
				program: {
					connect: {
						id: courseData.program.id
					}
				}
			},
			include: {
				subjects: {
					include: {
						teachers: true,
						activities: true
					}
				},
				program: true
			}
		});

		return {
			id: course.id,
			name: course.name,
			academicYear: course.academicYear,
			subjects: course.subjects.map(s => ({
				id: s.id,
				name: s.name,
				description: s.description || undefined,
				courseStructure: s.courseStructure as unknown as CourseStructure,
				teachers: s.teachers.map(t => ({
					id: t.id,
					teacherId: t.teacherId,
					subjectId: t.subjectId,
					classId: t.classId,
					isClassTeacher: t.isClassTeacher,
					assignedAt: t.assignedAt
				})),
				activities: s.activities.map(a => ({
					id: a.id,
					type: a.type as ClassActivity['type'],
					title: a.title,
					description: a.description,
					dueDate: a.dueDate || undefined,
					points: a.points || undefined,
					status: a.status as ClassActivity['status']
				}))
			})),
			program: {
				id: course.program.id,
				name: course.program.name || ''
			}
		};
	}

	async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
		const course = await db.course.update({
			where: { id: courseId },
			data: {
				name: courseData.name,
				academicYear: courseData.academicYear,
				...(courseData.program && {
					program: {
						connect: {
							id: courseData.program.id
						}
					}
				})
			},
			include: {
				subjects: {
					include: {
						teachers: true,
						activities: true
					}
				},
				program: true
			}
		});

		return {
			id: course.id,
			name: course.name,
			academicYear: course.academicYear,
			subjects: course.subjects.map(s => ({
				id: s.id,
				name: s.name,
				description: s.description || undefined,
				courseStructure: s.courseStructure as unknown as CourseStructure,
				teachers: s.teachers.map(t => ({
					id: t.id,
					teacherId: t.teacherId,
					subjectId: t.subjectId,
					classId: t.classId,
					isClassTeacher: t.isClassTeacher,
					assignedAt: t.assignedAt
				})),
				activities: s.activities.map(a => ({
					id: a.id,
					type: a.type as ClassActivity['type'],
					title: a.title,
					description: a.description,
					dueDate: a.dueDate || undefined,
					points: a.points || undefined,
					status: a.status as ClassActivity['status']
				}))
			})),
			program: {
				id: course.program.id,
				name: course.program.name || ''
			}
		};
	}

	async addSubjectToCourse(courseId: string, subjectData: Omit<Subject, 'id' | 'teachers' | 'activities'>): Promise<Subject> {
		const subject = await db.subject.create({
			data: {
				name: subjectData.name,
				description: subjectData.description,
				code: `SUB-${Date.now()}`,
				courseStructure: subjectData.courseStructure as any,
				course: {
					connect: { id: courseId }
				}
			},
			include: {
				teachers: true,
				activities: true
			}
		});

		return {
			id: subject.id,
			name: subject.name,
			description: subject.description || undefined,
			courseStructure: subject.courseStructure as unknown as CourseStructure,
			teachers: subject.teachers.map(t => ({
				id: t.id,
				teacherId: t.teacherId,
				subjectId: t.subjectId,
				classId: t.classId,
				isClassTeacher: t.isClassTeacher,
				assignedAt: t.assignedAt
			})),
			activities: subject.activities.map(a => ({
				id: a.id,
				type: a.type as ClassActivity['type'],
				title: a.title,
				description: a.description,
				dueDate: a.dueDate || undefined,
				points: a.points || undefined,
				status: a.status as ClassActivity['status']
			}))
		};
	}

	async updateSubject(subjectId: string, subjectData: Partial<Subject>): Promise<Subject> {
		const subject = await db.subject.update({
			where: { id: subjectId },
			data: {
				name: subjectData.name,
				description: subjectData.description,
				...(subjectData.courseStructure && {
					courseStructure: subjectData.courseStructure as any
				})
			},
			include: {
				teachers: true,
				activities: true
			}
		});

		return {
			id: subject.id,
			name: subject.name,
			description: subject.description || undefined,
			courseStructure: subject.courseStructure as unknown as CourseStructure,
			teachers: subject.teachers.map(t => ({
				id: t.id,
				teacherId: t.teacherId,
				subjectId: t.subjectId,
				classId: t.classId,
				isClassTeacher: t.isClassTeacher,
				assignedAt: t.assignedAt
			})),
			activities: subject.activities.map(a => ({
				id: a.id,
				type: a.type as ClassActivity['type'],
				title: a.title,
				description: a.description,
				dueDate: a.dueDate || undefined,
				points: a.points || undefined,
				status: a.status as ClassActivity['status']
			}))
		};
	}

	async assignTeacher(assignment: Omit<TeacherAssignment, 'id'>): Promise<TeacherAssignment> {
		const teacherAssignment = await db.teacherAssignment.create({
			data: {
				teacherId: assignment.teacherId,
				subjectId: assignment.subjectId,
				classId: assignment.classId,
				isClassTeacher: assignment.isClassTeacher,
				assignedAt: assignment.assignedAt
			}
		});

		return teacherAssignment;
	}

	async updateTeacherAssignment(assignmentId: string, updates: Partial<TeacherAssignment>): Promise<TeacherAssignment> {
		const assignment = await db.teacherAssignment.update({
			where: { id: assignmentId },
			data: updates
		});

		return assignment;
	}

	async updateCourseStructure(subjectId: string, structure: CourseStructure): Promise<Subject> {
		const isValid = await this.validateCourseStructure(structure);
		if (!isValid) {
			throw new Error('Invalid course structure');
		}

		const subject = await db.subject.update({
			where: { id: subjectId },
			data: {
				courseStructure: structure as any
			},
			include: {
				teachers: true,
				activities: true
			}
		});

		return {
			...subject,
			teachers: subject.teachers || [],
			activities: subject.activities || [],
			courseStructure: subject.courseStructure as CourseStructure
		};
	}

	async updateActivityStatus(activityId: string, status: ClassActivity['status']): Promise<ClassActivity> {
		const activity = await db.classActivity.update({
			where: { id: activityId },
			data: { status }
		});

		return {
			...activity,
			type: activity.type as ClassActivity['type'],
			status: activity.status as ClassActivity['status']
		};
	}

	async createActivity(subjectId: string, activity: Omit<ClassActivity, 'id'>): Promise<ClassActivity> {
		const newActivity = await db.classActivity.create({
			data: {
				title: activity.title,
				description: activity.description,
				type: activity.type,
				status: activity.status,
				dueDate: activity.dueDate,
				points: activity.points,
				subject: {
					connect: { id: subjectId }
				}
			}
		});

		return {
			...newActivity,
			type: newActivity.type as ClassActivity['type'],
			status: newActivity.status as ClassActivity['status']
		};
	}

	async updateStudentProgress(tracking: Omit<ProgressTracking, 'id'>): Promise<ProgressTracking> {
		const progress = await db.progressTracking.upsert({
			where: {
				studentId_subjectId: {
					studentId: tracking.studentId,
					subjectId: tracking.subjectId
				}
			},
			update: {
				progress: tracking.progress as any
			},
			create: {
				studentId: tracking.studentId,
				subjectId: tracking.subjectId,
				progress: tracking.progress as any
			}
		});

		return {
			...progress,
			progress: progress.progress as ProgressTracking['progress']
		};
	}

	async getStudentProgress(studentId: string, subjectId: string): Promise<ProgressTracking | null> {
		const progress = await db.progressTracking.findUnique({
			where: {
				studentId_subjectId: {
					studentId,
					subjectId
				}
			}
		});

		if (progress) {
			return {
				...progress,
				progress: progress.progress as ProgressTracking['progress']
			};
		}

		return null;
	}

	// Validation Methods
	async validateCourseStructure(structure: CourseStructure): Promise<boolean> {
		// Basic validation logic
		if (!structure.type || !structure.units) {
			return false;
		}

		switch (structure.type) {
			case 'CHAPTER':
				return this.validateChapterStructure(structure);
			case 'BLOCK':
				return this.validateBlockStructure(structure);
			case 'WEEKLY':
				return this.validateWeeklyStructure(structure);
			default:
				return false;
		}
	}

	private validateChapterStructure(structure: CourseStructure): boolean {
		const units = structure.units as any[];
		return units.every(unit => 
			unit.chapterNumber && 
			unit.title && 
			Array.isArray(unit.sections) &&
			unit.sections.every((section: any) => 
				section.title && 
				Array.isArray(section.content)
			)
		);
	}

	private validateBlockStructure(structure: CourseStructure): boolean {
		const units = structure.units as any[];
		return units.every(unit => 
			typeof unit.position === 'number' && 
			unit.title && 
			Array.isArray(unit.content)
		);
	}

	private validateWeeklyStructure(structure: CourseStructure): boolean {
		const units = structure.units as any[];
		return units.every(unit => 
			unit.weekNumber && 
			unit.startDate && 
			unit.endDate && 
			Array.isArray(unit.dailyActivities) &&
			unit.dailyActivities.every((daily: any) => 
				typeof daily.day === 'number' && 
				Array.isArray(daily.content)
			)
		);
	}
}