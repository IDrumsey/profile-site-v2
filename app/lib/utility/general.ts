import Color from "color"

export function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function getContrastingTextColor(backgroundColor: Color) {
  const luminance = backgroundColor.luminosity()

  // Decide text color based on luminance threshold (e.g., 0.5)
  return luminance > 0.5 ? new Color("#000000") : new Color("#FFFFFF")
}
