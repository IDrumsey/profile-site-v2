/**
 * Classes for working with 3d graph elements
 */

import { getRandomElement } from "@/library/utility/general"
import { isSamePoint } from "@/library/utility/threejs"
import Color from "color"
import { randomUUID } from "crypto"
import {
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from "three"

export type I3DNode = Vector3
export type LabeledNode = { location: I3DNode; label: string }
export type I3DEdge = [LabeledNode, LabeledNode]

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
      this.radius = 0.05
    }

    if (edge.color) {
      this.color = edge.color
    } else {
      this.color = new Color("#fff")
    }

    this._cylinderGeom = new CylinderGeometry(this.radius, this.radius)
  }
}

interface IGraphRenderingStrategy {
  addNode: (node: INode_Graphics) => void
  addEdge: (cylinderData: ICylinder) => void
  clearNodeMeshes: () => void
  clearEdgeMeshes: () => void
  updateEdge: (cylinderData: ICylinder) => void
}

interface IGraphRenderer extends IGraphRenderingStrategy {}

export class ThreeDGraphRenderer implements IGraphRenderer {
  private renderStrategy: IGraphRenderingStrategy

  constructor(graphStrategy: IGraphRenderingStrategy) {
    this.renderStrategy = graphStrategy
  }

  addNode(node: INode_Graphics): void {
    this.renderStrategy.addNode(node)
  }

  addEdge(cylinderData: ICylinder): void {
    this.renderStrategy.addEdge(cylinderData)
  }

  clearNodeMeshes(): void {
    this.renderStrategy.clearNodeMeshes()
  }

  clearEdgeMeshes(): void {
    this.renderStrategy.clearEdgeMeshes()
  }

  updateEdge(cylinderData: ICylinder): void {
    this.renderStrategy.updateEdge(cylinderData)
  }
}

export class ThreejsGraphRenderingStrategy implements IGraphRenderingStrategy {
  private scene: Scene

  private nodeMeshes: Array<Mesh> = []
  private edgeMeshes: Array<Mesh> = []

  constructor(scene: Scene) {
    this.scene = scene
  }

  addNode(node: INode_Graphics) {
    const threejsSphere = new ThreejsNode(node)
    const nodeMesh = new Mesh(
      threejsSphere.sphereMesh,
      new MeshStandardMaterial({ color: threejsSphere.color.toString() })
    )

    nodeMesh.position.set(
      threejsSphere.location.x,
      threejsSphere.location.y,
      threejsSphere.location.z
    )
    nodeMesh.castShadow = true
    nodeMesh.receiveShadow = true
    this.scene.add(nodeMesh)

    this.nodeMeshes.push(nodeMesh)
  }

  // used gpt to help with this implementation
  addEdge(cylinderData: ICylinder): void {
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
    const cylinderMaterial = new MeshStandardMaterial({
      color: cylinderData.color?.string(),
    })

    const cylinderMesh = new Mesh(cylinderGeom, cylinderMaterial)

    cylinderMesh.position.set(midPoint.x, midPoint.y, midPoint.z)

    // enable shadows
    cylinderMesh.castShadow
    cylinderMesh.receiveShadow

    const direction = new Vector3(
      cylinderData.end2Location.x - cylinderData.end1Location.x,
      cylinderData.end2Location.y - cylinderData.end1Location.y,
      cylinderData.end2Location.z - cylinderData.end1Location.z
    )

    direction.normalize()

    cylinderMesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction)

    cylinderMesh.userData = {
      end1Location: cylinderData.end1Location,
      end2Location: cylinderData.end2Location,
    }

    this.scene.add(cylinderMesh)

    this.edgeMeshes.push(cylinderMesh)
  }

  clearNodeMeshes() {
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

  updateEdge(edge: ICylinder) {
    // remove the old one and replace with new one
    this.removeEdge(edge)
    this.addEdge(edge)
  }

  private removeEdge(targetEdge: ICylinder): void {
    // Find the matching cylinder in edgeMeshes based on endpoints
    const index = this.edgeMeshes.findIndex((mesh) => {
      const { end1Location: meshEnd1, end2Location: meshEnd2 } = mesh.userData

      // Check if both endpoints match
      const isMatch =
        (meshEnd1.x === targetEdge.end1Location.x &&
          meshEnd1.y === targetEdge.end1Location.y &&
          meshEnd1.z === targetEdge.end1Location.z &&
          meshEnd2.x === targetEdge.end2Location.x &&
          meshEnd2.y === targetEdge.end2Location.y &&
          meshEnd2.z === targetEdge.end2Location.z) ||
        (meshEnd1.x === targetEdge.end2Location.x &&
          meshEnd1.y === targetEdge.end2Location.y &&
          meshEnd1.z === targetEdge.end2Location.z &&
          meshEnd2.x === targetEdge.end1Location.x &&
          meshEnd2.y === targetEdge.end1Location.y &&
          meshEnd2.z === targetEdge.end1Location.z)

      return isMatch
    })

    // If a matching edge is found, remove it
    if (index !== -1) {
      const cylinderMesh = this.edgeMeshes[index]
      this.scene.remove(cylinderMesh)
      this.edgeMeshes.splice(index, 1)

      // Dispose of geometry and material to free memory
      cylinderMesh.geometry.dispose()
      if (Array.isArray(cylinderMesh.material)) {
        // Dispose of each material if cylinderMesh has multiple materials
        cylinderMesh.material.forEach((material) => material.dispose())
      } else {
        cylinderMesh.material.dispose()
      }
    }
  }

  clearEdgeMeshes() {
    for (let i = 0; i < this.edgeMeshes.length; i++) {
      const mesh = this.edgeMeshes[i]
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

export class GraphManager {
  private nodes: Array<LabeledNode> = []
  private edges: Array<I3DEdge> = []

  generateNode(maxDistanceFromOrigin: number): I3DNode {
    let generatedNode: I3DNode

    // generate a random point in 3d space and then check that it fits the constraints
    generatedNode = this.getRandomCoordinate(maxDistanceFromOrigin)

    // add node to list of existing nodes
    this.nodes.push({ location: generatedNode, label: this.getLabel() })
    return generatedNode
  }

  protected getLabel(): string {
    return randomUUID()
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

  clearEdges() {
    this.edges = []
  }

  get allNodes(): Array<LabeledNode> {
    return this.nodes
  }

  get allEdges(): Array<I3DEdge> {
    return this.edges
  }

  get maxEdges(): number {
    return (this.allNodes.length * (this.allNodes.length - 1)) / 2
  }

  generateEdge(): I3DEdge {
    // Make sure there are at least two nodes
    if (this.allNodes.length < 2) {
      throw new Error("Not enough nodes to generate an edge.")
    }

    // Make sure there is at least one other possible edge
    const numPossibleEdges = this.maxEdges - this.edges.length
    if (numPossibleEdges === 0) {
      throw new Error("Out of possible edges.")
    }

    let nodeA: LabeledNode
    let nodeB: LabeledNode
    let edgeAlreadyExists: boolean

    // Ensure the graph remains connected by creating edges between unconnected nodes
    const unconnectedNodes = this.nodes.filter(
      (node) => !this.isNodeConnected(node.location)
    )
    const connectedNodes = this.nodes.filter((node) =>
      this.isNodeConnected(node.location)
    )

    // If there are unconnected nodes, pick one and connect it to an already connected node
    if (unconnectedNodes.length > 0) {
      nodeA = getRandomElement(unconnectedNodes) as LabeledNode
      nodeB = getRandomElement(
        connectedNodes.length > 0 ? connectedNodes : unconnectedNodes
      ) as LabeledNode
    } else {
      // Pick two random nodes for additional edges if all nodes are already connected
      do {
        nodeA = getRandomElement(this.nodes) as LabeledNode
        nodeB = getRandomElement(this.nodes) as LabeledNode

        // Check to make sure this edge doesn't already exist
        const hasMatchCheck1 = this.edges.some(
          (edge) =>
            edge[0].location === nodeA.location &&
            edge[1].location === nodeB.location
        )
        const hasMatchCheck2 = this.edges.some(
          (edge) =>
            edge[0].location === nodeB.location &&
            edge[1].location === nodeA.location
        )

        edgeAlreadyExists = hasMatchCheck1 || hasMatchCheck2
      } while (nodeB === nodeA || edgeAlreadyExists)
    }

    const generatedEdge: I3DEdge = [nodeA, nodeB]
    this.edges.push(generatedEdge)

    return generatedEdge
  }

  // Helper method to check if a node is connected
  isNodeConnected(targetNodeLocation: I3DNode): boolean {
    return this.edges.some(
      (edge) =>
        edge[0].location === targetNodeLocation ||
        edge[1].location === targetNodeLocation
    )
  }

  // checks if the graph is connected or not
  isConnectedGraph(): boolean {
    return this.allNodes.every((node) => this.isNodeConnected(node.location))
  }

  public edgesNeededToConnect(): number {
    const numberOfComponents = this.countConnectedComponents()

    // If the graph is already connected, no edges are needed
    if (numberOfComponents <= 1) return 0

    // Minimum edges needed to connect all components
    return numberOfComponents - 1
  }

  private countConnectedComponents(): number {
    const visited = new Set<I3DNode>()
    let componentCount = 0

    // go through each node and find unvisited components
    for (const node of this.nodes) {
      if (!visited.has(node.location)) {
        componentCount++
        this.traverseComponent(node.location, visited)
      }
    }

    return componentCount
  }

  private traverseComponent(startNode: I3DNode, visited: Set<I3DNode>): void {
    const queue = [startNode]

    while (queue.length > 0) {
      const node = queue.shift()!
      if (!visited.has(node)) {
        visited.add(node)

        // Add all unvisited neighbors to the queue
        for (const edge of this.edges) {
          const neighbor =
            edge[0].location === node
              ? edge[1].location
              : edge[1].location === node
              ? edge[0].location
              : null
          if (neighbor && !visited.has(neighbor)) {
            queue.push(neighbor)
          }
        }
      }
    }
  }

  getNodeByCoordinates(coords: Vector3): LabeledNode | undefined {
    return this.allNodes.find((labeledNode) =>
      isSamePoint(labeledNode.location, coords)
    )
  }
}

export class AlphabetGraphManager extends GraphManager {
  getLabel(): string {
    // Extract labels from existing nodes and convert to a Set for quick lookup
    const existingLabels = new Set(
      this.allNodes.map((node) => node.label.toUpperCase())
    )

    // Loop through the alphabet to find the first available letter
    for (let i = 0; i <= 26; i++) {
      const letter = String.fromCharCode(65 + i) // 'A' is 65 in ASCII
      if (!existingLabels.has(letter)) {
        return letter // Return the first available letter
      }
    }

    throw new Error("out of letters to use as labels")
  }
}
