/**
 * Gets the base path considering PUBLIC_URL environment variable
 * Removes trailing slashes to avoid double slashes in constructed URLs
 * @returns Base path (empty string if PUBLIC_URL is root)
 */
export const getBasePath = (): string => {
  const publicUrl = 
    typeof process.env.PUBLIC_URL === 'string' && process.env.PUBLIC_URL.trim() !== ''
      ? process.env.PUBLIC_URL
      : ''
  
  return publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
}
