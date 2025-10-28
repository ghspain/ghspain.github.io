import { formatDateEs } from '../date'

describe('formatDateEs', () => {
  it('formats a valid date as dd/mm/yyyy in es-ES', () => {
    const formatted = formatDateEs('2025-10-05')
    // Spanish locale uses dd/mm/yyyy
    expect(formatted).toBe('05/10/2025')
  })

  it('returns the original string for invalid dates', () => {
    const input = 'not-a-date'
    const formatted = formatDateEs(input)
    expect(formatted).toBe(input)
  })
})
