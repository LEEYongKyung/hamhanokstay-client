const PROD_URLS = [
    '/hamhanokstay-client/docs/ics/booking.ics',
    '/hamhanokstay-client/docs/ics/airbnb.ics',
    '/hamhanokstay-client/docs/ics/agoda.ics',
];

const DEV_URLS = [
    "/booking/v1/export?t=2b9c85f1-2ce8-4686-b829-2ecfde2044cb",
    "/airbnb/calendar/ical/1141509028517381236.ics?s=4ff6139029b739ac857b7faa0e522542",
    "/agoda/en-us/api/ari/icalendar?key=Mq%2f3dKl3aQT1CaFASpd7juPktu8s1wp%2f",
];

export const SHARE_CALENDARS = import.meta.env.PROD ? PROD_URLS : DEV_URLS;

export const PROD_SHARE_CALENDARS = [
    "docs/ics/booking.ics",
    "docs/ics/airbnb.ics",
    "docs/ics/agoda.ics",
]