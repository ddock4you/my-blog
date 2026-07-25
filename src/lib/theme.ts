export function resolveDarkModePreference(storedValue: string | null, prefersDark: boolean) {
  return storedValue === null ? prefersDark : storedValue === 'true';
}
