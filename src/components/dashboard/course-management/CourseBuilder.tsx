'use client';

import { useState } from 'react';
import { Course, Subject, CourseStructureType } from '@/types/course-management';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface CourseBuilderProps {
	onCourseCreated?: (course: Course) => void;
}

export const CourseBuilder = ({ onCourseCreated }: CourseBuilderProps) => {
	const [courseData, setCourseData] = useState<Partial<Course>>({
		name: '',
		academicYear: '',
		program: { id: '', name: '' },
		subjects: []
	});

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
		
		if (!courseData.name || !courseData.academicYear || !courseData.program?.name) {
			toast.error('Please fill in all required fields');
			return;
		}

		const newCourse: Course = {
			id: crypto.randomUUID(),
			...courseData as Course
		};

		try {
			// TODO: Add API call to create course
			onCourseCreated?.(newCourse);
			toast.success('Course created successfully');
			
			// Reset form
			setCourseData({
				name: '',
				academicYear: '',
				program: { id: '', name: '' },
				subjects: []
			});
		} catch (error) {
			toast.error('Failed to create course');
		}
	};

	const handleAddSubject = () => {
		if (currentSubject.name) {
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
		}
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