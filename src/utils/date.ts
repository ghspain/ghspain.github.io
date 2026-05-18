export const formatDateEs = (dateString: string): string => {
  try {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}
