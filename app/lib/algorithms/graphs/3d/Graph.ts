/**
 * Classes for working with 3d graph elements
 */

import Color from "color"
import {
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from "three"

export type I3DNode = Vector3

export interface ISphere_Graphics {
  radius?: number
  color?: Color
  location: I3DNode
}

export type INode_Graphics = ISphere_Graphics

class ThreejsNode implements INode_Graphics {
  private _sphereGeom: SphereGeometry
  radius: number
  color: Color
  location: Vector3

  constructor(node: INode_Graphics) {
    this.location = node.location
    if (node.radius) {
      this.radius = node.radius
    } else {
      this.radius = 1
    }

    if (node.color) {
      this.color = node.color
    } else {
      this.color = new Color("#fff")
    }

    this._sphereGeom = new SphereGeometry(this.radius)
  }

  get sphereMesh(): SphereGeometry {
    return this._sphereGeom
  }
}

export interface ICylinder {
  radius?: number
  color?: Color
  end1Location: Vector3
  end2Location: Vector3
}

export type IEdge = ICylinder

class ThreejsEdge implements IEdge {
  private _cylinderGeom: CylinderGeometry

  radius?: number
  color?: Color
  end1Location: Vector3
  end2Location: Vector3

  constructor(edge: IEdge) {
    this.end1Location = edge.end1Location
    this.end2Location = edge.end2Location

    if (edge.radius) {
      this.radius = edge.radius
    } else {
      this.radius = 1
    }

    if (edge.color) {
      this.color = edge.color
    } else {
      this.color = new Color("#fff")
    }

    this._cylinderGeom = new CylinderGeometry(this.radius, this.radius)
  }
}

interface IGraphStrategy {
  addNode: (node: INode_Graphics) => void
  addCylinder: (cylinderData: ICylinder) => void
  clearNodes: () => void
}

interface IGraph extends IGraphStrategy {}

export class ThreeDGraph implements IGraph {
  private graphStrategy: IGraphStrategy

  constructor(graphStrategy: IGraphStrategy) {
    this.graphStrategy = graphStrategy
  }

  addNode(node: INode_Graphics): void {
    this.graphStrategy.addNode(node)
  }

  addCylinder(cylinderData: ICylinder): void {
    this.graphStrategy.addCylinder(cylinderData)
  }

  clearNodes(): void {
    this.graphStrategy.clearNodes()
  }
}

export class ThreejsGraphStrategy implements IGraphStrategy {
  private scene: Scene

  private nodeMeshes: Array<Mesh> = []

  constructor(scene: Scene) {
    this.scene = scene
  }

  addNode(node: INode_Graphics) {
    const threejsSphere = new ThreejsNode(node)
    const nodeMesh = new Mesh(
      threejsSphere.sphereMesh,
      new MeshBasicMaterial({ color: threejsSphere.color.toString() })
    )

    nodeMesh.position.set(
      threejsSphere.location.x,
      threejsSphere.location.y,
      threejsSphere.location.z
    )
    this.scene.add(nodeMesh)

    this.nodeMeshes.push(nodeMesh)
  }

  // used gpt to help with this implementation
  addCylinder(cylinderData: ICylinder): void {
    const midPoint = {
      x: (cylinderData.end1Location.x + cylinderData.end2Location.x) / 2,
      y: (cylinderData.end1Location.y + cylinderData.end2Location.y) / 2,
      z: (cylinderData.end1Location.z + cylinderData.end2Location.z) / 2,
    }

    const distance = Math.sqrt(
      Math.pow(cylinderData.end1Location.x - cylinderData.end2Location.x, 2) +
        Math.pow(cylinderData.end1Location.y - cylinderData.end2Location.y, 2) +
        Math.pow(cylinderData.end1Location.z - cylinderData.end2Location.z, 2)
    )

    const cylinderGeom = new CylinderGeometry(
      cylinderData.radius,
      cylinderData.radius,
      distance,
      100
    )
    const cylinderMaterial = new MeshBasicMaterial({
      color: cylinderData.color?.string(),
    })

    const cylinderMesh = new Mesh(cylinderGeom, cylinderMaterial)

    cylinderMesh.position.set(midPoint.x, midPoint.y, midPoint.z)

    const direction = new Vector3(
      cylinderData.end2Location.x - cylinderData.end1Location.x,
      cylinderData.end2Location.y - cylinderData.end1Location.y,
      cylinderData.end2Location.z - cylinderData.end1Location.z
    )

    direction.normalize()

    cylinderMesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction)

    this.scene.add(cylinderMesh)
  }

  clearNodes() {
    for (let i = 0; i < this.nodeMeshes.length; i++) {
      const mesh = this.nodeMeshes[i]
      this.scene.remove(mesh)

      if (mesh.geometry) mesh.geometry.dispose()
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          // Dispose of each material if mesh has multiple materials
          mesh.material.forEach((material) => material.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    }
    this.nodeMeshes = []
  }
}

export class GraphGenerator {
  private nodes: Array<I3DNode> = []

  generateNode(maxDistanceFromOrigin: number): I3DNode {
    let generatedNode: I3DNode

    // generate a random point in 3d space and then check that it fits the constraints
    generatedNode = this.getRandomCoordinate(maxDistanceFromOrigin)

    // add node to list of existing nodes
    this.nodes.push(generatedNode)
    return generatedNode
  }

  private getRandomCoordinate(max: number): I3DNode {
    return new Vector3(
      (Math.random() * 2 - 1) * max,
      (Math.random() * 2 - 1) * max,
      (Math.random() * 2 - 1) * max
    )
  }

  clearNodes() {
    this.nodes = []
  }

  get allNodes(): Array<I3DNode> {
    return this.nodes
  }
}
