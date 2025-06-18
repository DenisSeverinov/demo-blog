export const TIME_CONSTANTS = {
	MILLISECONDS_IN_SECOND: 1000,
	MILLISECONDS_IN_MINUTE: 60 * 1000,
	MILLISECONDS_IN_HOUR: 60 * 60 * 1000,
	MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,
} as const;

export const TimeUtils = {
	minutesToMs: (minutes: number) =>
		minutes * TIME_CONSTANTS.MILLISECONDS_IN_MINUTE,
	hoursToMs: (hours: number) => hours * TIME_CONSTANTS.MILLISECONDS_IN_HOUR,
	daysToMs: (days: number) => days * TIME_CONSTANTS.MILLISECONDS_IN_DAY,
} as const;
