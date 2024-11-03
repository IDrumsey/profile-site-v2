import { Vector3 } from "three"

export function isSamePoint(pointA: Vector3, pointB: Vector3): boolean {
  return pointA.x == pointB.x && pointA.y == pointB.y && pointA.z == pointB.z
}
