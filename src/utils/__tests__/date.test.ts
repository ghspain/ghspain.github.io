import { formatDateEs } from '../date'

describe('formatDateEs', () => {
  it('formats valid dates for the Spanish locale', () => {
    expect(formatDateEs('2025-10-05')).toBe('05/10/2025')
  })

  it('returns the original string for invalid dates', () => {
    expect(formatDateEs('not-a-date')).toBe('not-a-date')
  })
})
