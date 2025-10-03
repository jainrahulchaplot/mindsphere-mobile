/**
 * Environment validation
 * Strict validation with clear error messages
 */

export function validateAppUrl(): string {
  const url = process.env.EXPO_PUBLIC_APP_URL;
  
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_APP_URL is required but not set.\n' +
      'Please set it in your .env file with a valid HTTPS URL.\n' +
      'Example: EXPO_PUBLIC_APP_URL=https://your-app.vercel.app/'
    );
  }
  
  if (!url.startsWith('https://')) {
    throw new Error(
      `EXPO_PUBLIC_APP_URL must be HTTPS.\n` +
      `Got: ${url}\n` +
      'Please update your .env file with a valid HTTPS URL.'
    );
  }
  
  try {
    new URL(url);
  } catch {
    throw new Error(
      `EXPO_PUBLIC_APP_URL is not a valid URL.\n` +
      `Got: ${url}\n` +
      'Please update your .env file with a valid URL.'
    );
  }
  
  return url;
}
