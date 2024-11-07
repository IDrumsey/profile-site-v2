import { Vector3 } from "three"

export function isSamePoint(pointA: Vector3, pointB: Vector3): boolean {
  return pointA.x == pointB.x && pointA.y == pointB.y && pointA.z == pointB.z
}

export function distanceBetweenPoints(
  pointA: Vector3,
  pointB: Vector3
): number {
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) +
      Math.pow(pointB.y - pointA.y, 2) +
      Math.pow(pointB.z - pointA.z, 2)
  )
}
