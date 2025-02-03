export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	level: 'CALENDAR' | 'PROGRAM' | 'CLASS_GROUP' | 'CLASS';
	calendarId: string;
	programId?: string;
	classGroupId?: string;
	classId?: string;
	status: 'ACTIVE' | 'INACTIVE';
}