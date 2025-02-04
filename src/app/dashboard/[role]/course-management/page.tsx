'use client';

import { useState } from 'react';
import { CourseBuilder } from '../../../../components/dashboard/course-management/CourseBuilder';
import { CourseStructureEditor } from '../../../../components/dashboard/course-management/CourseStructureEditor';
import { Course, Subject } from '../../../../types/course-management';
import { Card } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

export default function CourseManagementPage() {
	const [activeTab, setActiveTab] = useState('create');
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	const handleCourseCreated = (course: Course) => {
		setSelectedCourse(course);
		setActiveTab('structure');
	};

	const handleStructureSaved = async (subjectId: string, structure: any) => {
		// Implementation will be added to save structure
		console.log('Saving structure for subject:', subjectId, structure);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Course Management</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="create">Create Course</TabsTrigger>
					<TabsTrigger value="structure">Course Structure</TabsTrigger>
				</TabsList>

				<TabsContent value="create">
					<CourseBuilder />
				</TabsContent>

				<TabsContent value="structure">
					{selectedSubject ? (
						<CourseStructureEditor
							initialStructure={selectedSubject.courseStructure}
							onSave={(structure) => handleStructureSaved(selectedSubject.id, structure)}
						/>
					) : (
						<Card className="p-6">
							<p className="text-center text-gray-500">
								Please create a course or select a subject to edit its structure
							</p>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}