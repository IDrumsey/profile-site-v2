import { AlgorithmUIManager } from "../AlgorithmUIManager"

enum DijkstrasAlgorithmSteps {
  PickStartingNode = "Pick Starting Node",
  // Add more steps as needed
}

export class DijkstrasAlgorithmManager {
  step: DijkstrasAlgorithmSteps = DijkstrasAlgorithmSteps.PickStartingNode
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
    }
  }
}
