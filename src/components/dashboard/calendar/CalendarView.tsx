import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CalendarEvent } from '@/types/calendar';

export const CalendarView = () => {
	const [selectedLevel, setSelectedLevel] = useState<string>('CALENDAR');
	const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
	const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Calendar Management</h2>
				<Button onClick={() => setIsCreateEventOpen(true)}>Create Event</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>View Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex space-x-4">
						<Select value={selectedLevel} onValueChange={setSelectedLevel}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select Level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="CALENDAR">Calendar</SelectItem>
								<SelectItem value="PROGRAM">Program</SelectItem>
								<SelectItem value="CLASS_GROUP">Class Group</SelectItem>
								<SelectItem value="CLASS">Class</SelectItem>
							</SelectContent>
						</Select>

						{selectedLevel !== 'CALENDAR' && (
							<EntitySelector 
								level={selectedLevel} 
								value={selectedEntity}
								onChange={setSelectedEntity}
							/>
						)}
					</div>
				</CardContent>
			</Card>

			<CalendarGrid 
				level={selectedLevel}
				entityId={selectedEntity}
			/>

			<EventDialog 
				open={isCreateEventOpen}
				onOpenChange={setIsCreateEventOpen}
				level={selectedLevel}
				entityId={selectedEntity}
			/>
		</div>
	);
};