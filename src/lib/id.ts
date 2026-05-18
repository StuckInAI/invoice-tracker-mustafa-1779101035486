let counter = 0;

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${++counter}`;
}

export { generateId as nanoid };
