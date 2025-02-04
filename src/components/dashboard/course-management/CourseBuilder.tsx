'use client';

import { useState } from 'react';
import { Course, Subject, CourseStructureType } from '@/types/course-management';
import { CourseManagementService } from '@/lib/course-management/course-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/utils/api';

interface CourseBuilderProps {
	onCourseCreated?: (course: Course) => void;
}

const courseManagementService = new CourseManagementService();

export const CourseBuilder = ({ onCourseCreated }: CourseBuilderProps) => {
	const [courseData, setCourseData] = useState<Partial<Course>>({
		name: '',
		academicYear: '',
		classGroupId: '',
		subjects: []
	});

	const { data: classGroups } = api.classGroup.getAllClassGroups.useQuery();

	const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({
		name: '',
		description: '',
		courseStructure: {
			type: 'CHAPTER',
			units: []
		}
	});

	const handleCourseSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!courseData.name || !courseData.academicYear || !courseData.classGroupId) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!courseData.subjects?.length) {
			toast.error('Please add at least one subject before creating the course');
			return;
		}

		try {
			// First create all subjects
			const createdSubjects = await Promise.all(
				courseData.subjects.map(subject => 
					courseManagementService.createSubject({
						name: subject.name,
						description: subject.description || '',
						courseStructure: subject.courseStructure
					})
				)
			);

			// Then create the course with the created subject IDs
			const newCourse = await courseManagementService.createCourse({
				name: courseData.name,
				academicYear: courseData.academicYear,
				classGroupId: courseData.classGroupId,
				subjectIds: createdSubjects.map(subject => subject.id)
			});

			toast.success('Course and subjects created successfully');
			onCourseCreated?.(newCourse);
			
			// Reset form
			setCourseData({
				name: '',
				academicYear: '',
				classGroupId: '',
				subjects: []
			});
		} catch (error) {
			console.error('Error creating course:', error);
			toast.error('Failed to create course and subjects');
		}
	};

	const handleAddSubject = () => {
		if (!currentSubject.name) {
			toast.error('Subject name is required');
			return;
		}

		setCourseData(prev => ({
			...prev,
			subjects: [...(prev.subjects || []), currentSubject as Subject]
		}));
		
		setCurrentSubject({
			name: '',
			description: '',
			courseStructure: {
				type: 'CHAPTER',
				units: []
			}
		});
		
		toast.success('Subject added successfully');
	};


	return (
		<div className="space-y-6 p-6">
			<Card className="p-6">
				<h2 className="text-2xl font-bold mb-4">Create New Course</h2>
				<form onSubmit={handleCourseSubmit} className="space-y-4">
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
						<label className="block text-sm font-medium mb-1">Class Group</label>
						<Select
							value={courseData.classGroupId}
							onValueChange={(value) => {
								setCourseData(prev => ({
									...prev,
									classGroupId: value
								}));
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Class Group" />
							</SelectTrigger>
							<SelectContent>
								{classGroups?.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="border-t pt-4 mt-4">
						<h3 className="text-lg font-semibold mb-3">Add Subject</h3>
						<div className="space-y-3">
							<Input
								value={currentSubject.name}
								onChange={(e) => setCurrentSubject(prev => ({ ...prev, name: e.target.value }))}
								placeholder="Subject name"
							/>
							<Input
								value={currentSubject.description}
								onChange={(e) => setCurrentSubject(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Subject description"
							/>
							<Select
								value={currentSubject.courseStructure?.type}
								onValueChange={(value: CourseStructureType) => 
									setCurrentSubject(prev => ({
										...prev,
										courseStructure: { ...prev.courseStructure!, type: value }
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select structure type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="CHAPTER">Chapter Based</SelectItem>
									<SelectItem value="BLOCK">Block Based</SelectItem>
									<SelectItem value="WEEKLY">Weekly Based</SelectItem>
								</SelectContent>
							</Select>
							<Button type="button" onClick={handleAddSubject}>Add Subject</Button>
						</div>
					</div>

					<div className="border-t pt-4">
						<h3 className="text-lg font-semibold mb-3">Added Subjects</h3>
						<div className="space-y-2">
							{courseData.subjects?.map((subject, index) => (
								<div key={index} className="p-3 bg-gray-50 rounded">
									<p className="font-medium">{subject.name}</p>
									<p className="text-sm text-gray-600">{subject.description}</p>
								</div>
							))}
						</div>
					</div>

					<Button type="submit" className="mt-6">Create Course</Button>
				</form>
			</Card>
		</div>
	);

};