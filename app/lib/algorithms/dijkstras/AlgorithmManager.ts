import { useState } from "react"
import { Vector3 } from "three"
import { AlgorithmUIManager } from "../AlgorithmUIManager"

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

export const useDijkstraAlgorithmManager = () => {
  const [step, stepSetter] = useState<DijkstrasAlgorithmSteps>(
    DijkstrasAlgorithmSteps.PickStartingNode
  )
  const [selectedNode, selectedNodeSetter] = useState<Vector3 | null>(null)

  function nextStep() {
    switch (step) {
      case DijkstrasAlgorithmSteps.PickStartingNode:
        stepSetter(DijkstrasAlgorithmSteps.StepThroughNodes)
        break
    }
  }

  function resetAlgorithm() {
    stepSetter(DijkstrasAlgorithmSteps.PickStartingNode)
  }

  return {
    nextStep,
    resetAlgorithm,
    setSelectedNode: (selectedNode: Vector3) => {
      selectedNodeSetter(selectedNode)
    },
    selectedNode,
    step,
  }
}
