import { FC } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from '@/types/calendar';

interface ClassCalendarProps {
	classId: string;
	classEvents?: CalendarEvent[];
	groupEvents?: CalendarEvent[];
	onEventAdd?: (event: CalendarEvent) => void;
	onEventEdit?: (event: CalendarEvent) => void;
}

export const ClassCalendar: FC<ClassCalendarProps> = ({
	classId,
	classEvents = [],
	groupEvents = [],
	onEventAdd,
	onEventEdit
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Class Calendar</CardTitle>
			</CardHeader>

			<Tabs defaultValue="calendar" className="p-4">
				<TabsList>
					<TabsTrigger value="calendar">Calendar</TabsTrigger>
					<TabsTrigger value="activities">Activities</TabsTrigger>
				</TabsList>

				<TabsContent value="calendar">
					<CalendarView
						entityType="class"
						entityId={classId}
						events={classEvents}
						inheritedEvents={groupEvents}
						onEventAdd={onEventAdd}
						onEventEdit={onEventEdit}
					/>
				</TabsContent>

				<TabsContent value="activities">
					<div className="p-4">
						<h3 className="text-lg font-medium">Class Activities</h3>
						{/* Class activities list will be implemented separately */}
					</div>
				</TabsContent>
			</Tabs>
		</Card>
	);
};