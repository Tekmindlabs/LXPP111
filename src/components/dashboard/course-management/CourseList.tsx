'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Course } from '@/types/course-management';

interface CourseListProps {
	courses?: Course[];
	onSelect?: (course: Course) => void;
	isLoading?: boolean;
}

const LoadingSkeleton = () => (
	<div className="space-y-4">
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div key={i} className="p-4 border rounded-lg">
					<Skeleton className="h-6 w-3/4 mb-2" />
					<Skeleton className="h-4 w-1/2 mb-2" />
					<Skeleton className="h-4 w-1/3" />
				</div>
			))}
		</div>
	</div>
);

export const CourseList = ({ courses = [], onSelect, isLoading = false }: CourseListProps) => {
	if (isLoading) {
		return <LoadingSkeleton />;
	}

	const [searchTerm, setSearchTerm] = useState('');
	const [programFilter, setProgramFilter] = useState('all');
	const [yearFilter, setYearFilter] = useState('all');

	// Get unique programs and years for filters
	const uniquePrograms = Array.from(new Set(courses.map(course => course.program.name)));
	const uniqueYears = Array.from(new Set(courses.map(course => course.academicYear)));

	const filteredCourses = courses.filter(course => {
		const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesProgram = programFilter === 'all' || course.program.name === programFilter;
		const matchesYear = yearFilter === 'all' || course.academicYear === yearFilter;
		return matchesSearch && matchesProgram && matchesYear;
	});

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Input
					placeholder="Search courses..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Select value={programFilter} onValueChange={setProgramFilter}>
					<SelectTrigger>
						<SelectValue placeholder="Select Program" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Programs</SelectItem>
						{uniquePrograms.map((program) => (
							<SelectItem key={program} value={program}>
								{program}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={yearFilter} onValueChange={setYearFilter}>
					<SelectTrigger>
						<SelectValue placeholder="Select Year" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Years</SelectItem>
						{uniqueYears.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredCourses.map((course) => (
					<Card key={course.id} className="p-4">
						<h3 className="text-lg font-semibold">{course.name}</h3>
						<p className="text-sm text-gray-600">{course.program.name}</p>
						<p className="text-sm text-gray-600">{course.academicYear}</p>
						<div className="mt-4 space-x-2">
							<Button 
								variant="outline" 
								size="sm"
								onClick={() => onSelect?.(course)}
							>
								Edit
							</Button>
						</div>
					</Card>
				))}
			</div>

			{filteredCourses.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					No courses found matching your criteria
				</div>
			)}
		</div>
	);
};