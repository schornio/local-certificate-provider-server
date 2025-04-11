export function enforceEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Required environment variable "${name}" not set.`);
  }

  return value;
}
