import { filterAndSortEvents, type EventData } from '../eventFilters'

describe('filterAndSortEvents', () => {
  const fixedNow = new Date('2025-10-28T12:00:00Z')

  beforeAll(() => {
    jest.useFakeTimers()
    // Use system time to make new Date() deterministic
    // Note: Date parsing without time is local; using UTC time avoids DST issues here
    jest.setSystemTime(fixedNow)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('splits into upcoming and past and sorts correctly', () => {
    const events: EventData[] = [
      { event_id: '1', event_name: 'Past Early', event_link: '#1', event_date: '2025-10-01' },
      { event_id: '2', event_name: 'Today Midnight', event_link: '#2', event_date: '2025-10-28' },
      { event_id: '3', event_name: 'Tomorrow', event_link: '#3', event_date: '2025-10-29' },
    ]

    const { upcomingEvents, pastEvents } = filterAndSortEvents(events)

    // upcoming: strictly greater than now -> only 2025-10-29
    expect(upcomingEvents.map(e => e.event_id)).toEqual(['3'])

    // past: <= now, sorted descending -> today, then early month
    expect(pastEvents.map(e => e.event_id)).toEqual(['2', '1'])
  })
})
