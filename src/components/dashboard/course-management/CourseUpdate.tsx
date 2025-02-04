'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourseStructureEditor } from './CourseStructureEditor';
import type { Course, Subject } from '@/types/course-management';
import { CourseManagementService } from '@/lib/course-management/course-service';
import { toast } from 'sonner';

interface CourseUpdateProps {
	course?: Course;
	onUpdate?: (updatedCourse: Course) => void;
}

const courseManagementService = new CourseManagementService();

export const CourseUpdate = ({ course, onUpdate }: CourseUpdateProps) => {
	const [courseData, setCourseData] = useState<Partial<Course>>(course || {
		name: '',
		academicYear: '',
		program: { id: '', name: '' },
		subjects: []
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!courseData.id) return;

		try {
			const updatedCourse = await courseManagementService.updateCourse(courseData.id, {
				name: courseData.name,
				academicYear: courseData.academicYear,
				programId: courseData.program?.id
			});

			// Update subjects
			if (courseData.subjects) {
				for (const subject of courseData.subjects) {
					await courseManagementService.updateSubject(subject.id, {
						name: subject.name,
						description: subject.description,
						courseStructure: subject.courseStructure
					});
				}
			}

			onUpdate?.(updatedCourse);
			toast.success('Course updated successfully');
		} catch (error) {
			toast.error('Failed to update course');
			console.error('Error updating course:', error);
		}
	};

	const handleSubjectUpdate = (index: number, updatedSubject: Subject) => {
		setCourseData(prev => ({
			...prev,
			subjects: prev.subjects?.map((subject, i) => 
				i === index ? updatedSubject : subject
			)
		}));
	};

	if (!course) {
		return (
			<div className="text-center py-8 text-gray-500">
				Please select a course to update
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Course Name</label>
					<Input
						value={courseData.name}
						onChange={(e) => setCourseData(prev => ({ ...prev, name: e.target.value }))}
						placeholder="Enter course name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Academic Year</label>
					<Input
						value={courseData.academicYear}
						onChange={(e) => setCourseData(prev => ({ ...prev, academicYear: e.target.value }))}
						placeholder="YYYY-YYYY"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Program Name</label>
					<Input
						value={courseData.program?.name}
						onChange={(e) => setCourseData(prev => ({
							...prev,
							program: { ...prev.program!, name: e.target.value }
						}))}
						placeholder="Enter program name"
						required
					/>
				</div>

				<Button type="submit">Update Course</Button>
			</form>

			<div className="border-t pt-6">
				<h3 className="text-lg font-semibold mb-4">Subjects</h3>
				{courseData.subjects?.map((subject, index) => (
					<Card key={index} className="p-4 mb-4">
						<h4 className="font-medium mb-2">{subject.name}</h4>
						<CourseStructureEditor
							initialStructure={subject.courseStructure}
							onSave={(structure) => handleSubjectUpdate(index, {
								...subject,
								courseStructure: structure
							})}
						/>
					</Card>
				))}
			</div>
		</div>
	);
};