import { useEffect, useMemo, useState } from "react"
import { Vector3 } from "three"
import { AlgorithmUIManager } from "../AlgorithmUIManager"
import { LabeledNode } from "../graphs/3d/Graph"
import { isSamePoint } from "@/library/utility/threejs"
import { getRandomElement } from "@/library/utility/general"

export enum DijkstrasAlgorithmSteps {
  PickStartingNode = "Pick Starting Node",
  // Add more steps as needed
  StepThroughNodes = "Step Through Nodes",
}

export class DijkstraAlertGenerator implements AlgorithmUIManager {
  getCurrentStepAlert(step: DijkstrasAlgorithmSteps): {
    title: string
    description: string
  } {
    switch (step) {
      case DijkstrasAlgorithmSteps.PickStartingNode:
        return {
          title: "Pick the starting node",
          description: "Click on one of the nodes to get started",
        }
      case DijkstrasAlgorithmSteps.StepThroughNodes:
        return {
          title: "Click the arrows to view the algorithm in action",
          description: "asdf",
        }
    }
  }
}

type DijkstraAlgStepType =
  | "selectNewCurrentNode"
  | "determineUnvisitedNeighbors"
  | "calcNewDistance"
  | "compareNewDistance"
  | "checkCanContinue"
  | "pickOneOfTheNeighborNodesToCalcDistance"

export interface DijkstraAlgStep {
  stepType: DijkstraAlgStepType
  unvisitedNeighborsDiscovered?: Array<LabeledNode>
  newCurrentNodeSelected?: LabeledNode
  neighborNodeSelected?: LabeledNode
}

export interface DijkstraNodeInternalDistanceTracker {
  node: LabeledNode
  minDistance: number
  prevNode: LabeledNode | null
}

const useTrackingTable = (allNodes: Array<LabeledNode> | null) => {
  const [rows, setRows] = useState<Array<DijkstraNodeInternalDistanceTracker>>(
    []
  )

  useEffect(() => {
    if (allNodes == null) return
    setRows(
      allNodes.map((node) => {
        return { node: node, minDistance: Infinity, prevNode: null }
      })
    )
  }, [allNodes])

  function updateNodeRow(
    targetNode: LabeledNode,
    newData: Partial<Omit<DijkstraNodeInternalDistanceTracker, "node">>
  ) {
    // find old row data
    const matchingRow = rows.find((row) => row.node == targetNode)
    if (matchingRow == undefined) return

    // set defaults for type matching
    const updatedNode: DijkstraNodeInternalDistanceTracker = {
      node: targetNode,
      minDistance: newData.minDistance ?? matchingRow.minDistance,
      prevNode: newData.prevNode ?? matchingRow.prevNode,
    }
    // remove the old data
    setRows((prevRows) =>
      prevRows.filter((row) => row.node !== targetNode).concat([updatedNode])
    )
  }

  function getSortedRows() {
    return rows.sort((a, b) => a.node.label.localeCompare(b.node.label))
  }

  return {
    get rows() {
      return getSortedRows()
    },
    updateNodeRow,
  }
}

export const useDijkstraAlgorithmManager = () => {
  const [allNodes, allNodesSetter] = useState<Array<LabeledNode> | null>(null)
  const [allEdges, allEdgesSetter] = useState<Array<
    [LabeledNode, LabeledNode]
  > | null>(null)

  const [currentNode, currentNodeSetter] = useState<LabeledNode | null>(null)

  const trackingTable = useTrackingTable(allNodes)

  const [userStep, userStepSetter] = useState<DijkstrasAlgorithmSteps>(
    DijkstrasAlgorithmSteps.PickStartingNode
  )
  const [startNode, startNodeSetter] = useState<LabeledNode | null>(null)

  const [stepsTaken, stepsTakenSetter] = useState<Array<DijkstraAlgStep>>([])
  const [currentlyShowingStepIndex, currentlyShowingStepIndexSetter] =
    useState<number>(-1)

  const [unvisitedNodes, unvisitedNodesSetter] =
    useState<Array<LabeledNode> | null>()

  const visitedNodes = useMemo<Array<LabeledNode>>(() => {
    try {
      return getVisitedNodes()
    } catch (e) {
      return []
    }
  }, [unvisitedNodes])

  const [unvisitedCurrentNodeNeighbors, unvisitedCurrentNodeNeighborsSetter] =
    useState<Array<LabeledNode>>([])
  const [currentlySelectedNeighborNode, currentlySelectedNeighborNodeSetter] =
    useState<LabeledNode | null>(null)

  function nextUserStep() {
    switch (userStep) {
      case DijkstrasAlgorithmSteps.PickStartingNode:
        userStepSetter(DijkstrasAlgorithmSteps.StepThroughNodes)
        break
    }
  }

  function resetAlgorithm() {
    userStepSetter(DijkstrasAlgorithmSteps.PickStartingNode)
  }

  function hasSelectedStartNode(): boolean {
    return !!startNode
  }

  function getCurrentlyShowingStep(): DijkstraAlgStep {
    if (stepsTaken.length == 0) throw new Error("no steps taken yet")
    return stepsTaken[currentlyShowingStepIndex!]
  }

  function takeNextStep(): DijkstraAlgStep {
    // determine what the next algorithm step is
    if (!hasSelectedStartNode()) throw new Error("no selected start node")

    // if the currently viewing index is < total amount of steps taken, just return the next step, don't need to run any further steps yet
    if (
      currentlyShowingStepIndex < stepsTaken.length - 1 &&
      currentlyShowingStepIndex != -1
    ) {
      const nextStep = stepsTaken[currentlyShowingStepIndex + 1]
      currentlyShowingStepIndexSetter((prev) => prev + 1)
      return nextStep
    } else {
      const nextStepRan = runAlgorithmNextStepInternal()
      return nextStepRan
    }
  }

  function runAlgorithmNextStepInternal(): DijkstraAlgStep {
    // figure out what type of step is next
    let nextStepType: DijkstraAlgStepType

    // check if this is the first step
    if (stepsTaken.length == 0) {
      nextStepType = "determineUnvisitedNeighbors"
    } else {
      // get the last taken step
      const lastTakenStep = stepsTaken[stepsTaken.length - 1]

      switch (lastTakenStep.stepType) {
        case "calcNewDistance":
          nextStepType = "compareNewDistance"
          break
        case "compareNewDistance":
          const thereAreOtherNeighborsToCalcDistanceFor =
            unvisitedCurrentNodeNeighbors
          nextStepType = thereAreOtherNeighborsToCalcDistanceFor
            ? "pickOneOfTheNeighborNodesToCalcDistance"
            : "checkCanContinue"
          break
        case "determineUnvisitedNeighbors":
          nextStepType = "pickOneOfTheNeighborNodesToCalcDistance"
          break
        case "selectNewCurrentNode":
          nextStepType = "determineUnvisitedNeighbors"
          break
        case "checkCanContinue":
          nextStepType = "selectNewCurrentNode"
        case "pickOneOfTheNeighborNodesToCalcDistance":
          nextStepType = "calcNewDistance"
      }
    }

    // now we have the step type, so we need to actually run the step functionality

    let newStep: DijkstraAlgStep

    switch (nextStepType) {
      case "calcNewDistance":
        break
      case "compareNewDistance":
        break
      case "determineUnvisitedNeighbors":
        const unvisitedConnectedNodes = determineUnvisitedNeighbors(
          currentNode!
        )
        newStep = {
          stepType: "determineUnvisitedNeighbors",
          unvisitedNeighborsDiscovered: unvisitedConnectedNodes,
        }
        unvisitedCurrentNodeNeighborsSetter(unvisitedConnectedNodes)
        break

      case "selectNewCurrentNode":
        break
      case "checkCanContinue":
        throw new Error("Algorithm done")
      case "pickOneOfTheNeighborNodesToCalcDistance":
        // pick one of the remaining nodes that haven't been checked for distance
        const newlySelectedNeighborNode = getRandomElement(
          unvisitedCurrentNodeNeighbors
        )
        if (!newlySelectedNeighborNode)
          throw new Error("failed to pick newly selected neighbor node")
        currentlySelectedNeighborNodeSetter(newlySelectedNeighborNode)
        newStep = {
          stepType: "pickOneOfTheNeighborNodesToCalcDistance",
          neighborNodeSelected: newlySelectedNeighborNode,
        }
        break
    }

    stepsTakenSetter((prev) => [...prev, newStep])
    currentlyShowingStepIndexSetter((prev) => prev + 1)
    return newStep!
  }

  function canRunAlgorithmStep(): boolean {
    return (
      currentNode !== null &&
      allNodes !== null &&
      allEdges !== null &&
      unvisitedNodes !== null
    )
  }

  function determineUnvisitedNeighbors(
    targetNode: LabeledNode
  ): Array<LabeledNode> {
    if (!canRunAlgorithmStep())
      throw new Error(
        "Cannot run algorithm right now. Make sure nodes and edges have been defined."
      )

    const neighbors = getNodeNeighbors(targetNode)

    return neighbors.filter((neighborNode) =>
      unvisitedNodes!.includes(neighborNode)
    )
  }

  function getNodeNeighbors(node: LabeledNode): Array<LabeledNode> {
    const neighbors: Array<LabeledNode> = []

    const nodeEdges = allEdges?.filter(
      (edge) =>
        isSamePoint(edge[0].location, node.location) ||
        isSamePoint(edge[1].location, node.location)
    )

    nodeEdges?.forEach((edge) => {
      // get the end of the edge that IS NOT the target node
      const neighborNode = isSamePoint(edge[0].location, node.location)
        ? edge[1]
        : edge[0]
      neighbors.push(neighborNode)
    })

    return neighbors
  }

  function getVisitedNodes(): Array<LabeledNode> {
    if (allNodes == null || unvisitedNodes == null)
      throw new Error("cannot get visited nodes")
    return allNodes?.filter((node) => !unvisitedNodes?.includes(node))
  }

  // anytime the current node changes -> move that node from unvisited to visited
  useEffect(() => {
    unvisitedNodesSetter((prev) => prev?.filter((node) => node !== currentNode))
  }, [currentNode])

  function getCurrentNode(): LabeledNode | undefined {
    // looks at where we are in the step history and finds the last step that is of type selecting new current node
    let index = currentlyShowingStepIndex

    while (
      index > -1 &&
      stepsTaken[index].stepType !== "selectNewCurrentNode"
    ) {
      index -= 1
    }

    return stepsTaken[index]?.newCurrentNodeSelected
  }

  return {
    defineNodes: (nodes: Array<LabeledNode>) => {
      allNodesSetter(nodes)
      unvisitedNodesSetter(nodes)
    },
    defineEdges: allEdgesSetter,
    nextUserStep,
    resetAlgorithm,
    setStartNode: (selectedNode: LabeledNode) => {
      stepsTakenSetter([
        {
          stepType: "selectNewCurrentNode",
          newCurrentNodeSelected: selectedNode,
        },
      ])
      currentlyShowingStepIndexSetter((prev) => prev + 1)
      currentNodeSetter(selectedNode)
      trackingTable.updateNodeRow(selectedNode, { minDistance: 0 })
      startNodeSetter(selectedNode)
    },
    startNode,
    userStep,
    stepsTaken,
    currentlyShowingStepIndex: currentlyShowingStepIndex,
    takeNextStep,
    visitedNodes,
    unvisitedCurrentNodeNeighbors,
    currentlySelectedNeighborNode,
    getCurrentNode,
    trackingTable,
  }
}
