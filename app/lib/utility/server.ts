export function getEnv(key: string): string {
  const value = process.env[key]

  if (value == undefined) throw new Error(`Could not find env var : ${key}`)

  return value
}
