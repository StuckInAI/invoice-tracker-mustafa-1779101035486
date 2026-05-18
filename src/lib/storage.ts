export function loadState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveState<T>(key: string, state: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // ignore
  }
}
