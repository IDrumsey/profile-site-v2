"use client"

import React, {
  useState,
  useEffect,
  ReactNode,
  CSSProperties,
  useMemo,
  useRef,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  AlphabetGraphManager,
  LabeledNode,
  ThreeDGraphRenderer,
  ThreejsGraphRenderingStrategy,
} from "@/library/algorithms/graphs/3d/Graph"
import {
  IconButton,
  IconButtonProps,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  keyframes,
} from "@mui/material"
import {
  OrbitControls,
  PerspectiveCamera,
  Text,
  Text3D,
} from "@react-three/drei"
import { MyGridHelper } from "@/components/3d/MyGridHelper/MyGridHelper"
import Color from "color"

import { Global } from "@emotion/react"
import { styled, useTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { grey } from "@mui/material/colors"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import SettingsIcon from "@mui/icons-material/Settings"
import { IoMdCloseCircle, IoMdGrid } from "react-icons/io"
import Slider from "@mui/material/Slider"
import {
  genRandomInt,
  getContrastingTextColor,
  roundNumber,
} from "@/library/utility/general"
import { DirectionalLight, Vector3 } from "three"
import {
  DijkstraAlertGenerator,
  useDijkstraAlgorithmManager,
  DijkstrasAlgorithmSteps,
  DijkstraAlgStep,
} from "@/library/algorithms/dijkstras/AlgorithmManager"
import SphereNode from "@/components/3d/Nodes/SphereNode"
import { distanceBetweenPoints, isSamePoint } from "@/library/utility/threejs"
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md"
import Alert from "@/components/Alert/Alert"
import { useRouter } from "next/navigation"
import { FaWrench } from "react-icons/fa"
import CloseIcon from "@mui/icons-material/Close"
import { FaGear } from "react-icons/fa6"

const VISITED_NODE_COLOR = new Color("purple")
const CURRENT_NODE_COLOR = new Color("blue")
const UNVISITED_NEIGHBOR_NODE_COLOR = new Color("green")
const SELECTED_NEIGHBOR_NODE_COLOR = new Color("yellow")
const EDGE_CALC_DISTANCE_COLOR = new Color("#ff0370")
const STARTING_NODE_COLOR = new Color("#0392ff")
const ALREADY_KNOWN_CURRENT_NODE_DISTANCE_COLOR = new Color("#fa9c05")
const COMPARE_MIN_DISTANCE_COLOR = new Color("#0cf518")
const NEW_DISTANCE_TO_COMPARE_COLOR = new Color("yellow")
const IN_DEVELOPMENT_ALERT_TEXT_COLOR = new Color("#473d33")

type SubroutineType = "calcDistance"

const inDevelopmentAlertCloseButtonPulseAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
    background-color: transparent; // No background change at the start
  }
  20% {
    transform: scale(1.2) rotate(0deg);
    opacity: 0.8;
    background-color: rgba(255, 255, 255, .1); // Example pulse color (light orange)
  }
  40% {
    transform: scale(1) rotate(90deg);
    opacity: 1;
    background-color: transparent;
  }

  100% {
    transform: scale(1) rotate(90deg);
    opacity: 1;
    background-color: transparent;
  }
`

function NumberOfNodesPicker({
  value,
  setValue,
}: {
  value: [number, number]
  setValue: (newValues: [number, number]) => void
}) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as [number, number])
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <div>
      {/* number of nodes to show on graph */}
      <Typography
        variant="body1"
        fontSize={isMobile ? theme.typography.h5.fontSize : "auto"}
        fontWeight="bold"
        color="#fff"
      >
        Number of Nodes
      </Typography>
      <Typography
        variant="caption"
        color={new Color("#fff").alpha(0.5).toString()}
      >
        {value[0]} - {value[1]}
      </Typography>
      <Slider
        min={5}
        max={26}
        getAriaLabel={() => "# of nodes"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={(value: any) => `${value}`}
      />
    </div>
  )
}

function MaxDistancePicker({
  value,
  setValue,
}: {
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <div>
      <Typography
        variant="body1"
        fontSize={isMobile ? theme.typography.h5.fontSize : "auto"}
        fontWeight="bold"
        color="#fff"
      >
        Max distance from origin
      </Typography>
      <Typography
        variant="caption"
        color={new Color("#fff").alpha(0.5).toString()}
      >
        Max: {value} units from origin
      </Typography>
      <Slider
        min={5}
        max={50}
        getAriaLabel={() => "Max distance from origin"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={(value: any) => `${value}`}
      />
    </div>
  )
}

const AlwaysVisibleIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800], // Light background color
  "&:hover": {
    backgroundColor: theme.palette.grey[700], // Darker on hover
  },
  padding: theme.spacing(3),
}))

// -------------------------- draggable window -------------------------------

const drawerBleeding = 56

const DrawerWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
  }),
}))

const StyledBox = styled("div")(({ theme }) => ({
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}))

const PullerTab = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[800],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}))

const DesktopPullerToggle = ({
  onClick,
}: {
  onClick: IconButtonProps["onClick"]
}) => {
  const theme = useTheme()

  return (
    <>
      <AlwaysVisibleIconButton
        onClick={onClick}
        sx={{
          cursor: "pointer",
          zIndex: 1001,
          position: "absolute",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        }}
      >
        <SettingsIcon
          fontSize="small"
          sx={{ color: grey[300] }}
        />
      </AlwaysVisibleIconButton>
    </>
  )
}

function GridToggleButton({
  showingGrid,
  showingGridSetter,
  width,
}: {
  showingGrid: boolean
  showingGridSetter: React.Dispatch<React.SetStateAction<boolean>>
  width: CSSProperties["width"]
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <>
      <Stack
        spacing={2}
        width={width}
        alignItems="center"
        direction="row"
      >
        <IoMdGrid
          fontSize={isMobile ? 30 : 20}
          color={showingGrid ? "#02c4fa" : "#4d4d4d"}
        />

        <Typography
          variant="body1"
          fontSize={isMobile ? theme.typography.h5.fontSize : "auto"}
          fontWeight="bold"
          color="#fff"
        >
          Toggle Graph
        </Typography>

        <Switch
          checked={showingGrid}
          onChange={(e) => showingGridSetter(e.target.checked)}
          sx={{
            color: "#02c4fa",
          }}
          size={isMobile ? "medium" : "small"}
        />
      </Stack>
    </>
  )
}

function SwipeableEdgeDrawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  // This is used only for the example
  const container = window.document.body

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <DrawerWrapper>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: isMobile ? "75vh" : "25vh",
            overflow: "visible",
            backgroundColor: new Color(grey[900]).alpha(0.9).string(),
          },
        }}
      />
      {!isMobile && !open && (
        <DesktopPullerToggle onClick={toggleDrawer(true)} />
      )}
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={isMobile ? drawerBleeding : 0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          {isMobile && <PullerTab />}
        </StyledBox>
        <div style={{ padding: theme.spacing(4), zIndex: 1000000 }}>
          {children}
        </div>
      </SwipeableDrawer>
    </DrawerWrapper>
  )
}

// ------------------------------------ DIJKSTRAS TRACKING TABLE COMPONENT ------------------------------------

type TableCell<T> = {
  data: T
  backgroundHighlight?: {
    highlighted: boolean
    color: Color
  }
}

type DijkstraTrackingTableRowData = {
  label: TableCell<string>
  minDistance: TableCell<number>
  prevNodeLabel: TableCell<string | null>
}

type AlgorithmTrackingTableProps = {
  nodes: Array<DijkstraTrackingTableRowData>
}

const AlgorithmTrackingTable = (props: AlgorithmTrackingTableProps) => {
  const theme = useTheme()

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "max-content" }}
    >
      <Table
        sx={{
          minWidth: "auto",
          width: "auto",
          tableLayout: "auto",
          border: "1px solid rgba(224, 224, 224, 1)",
          ".MuiTableCell-root": {
            paddingInline: theme.spacing(1),
          },
        }}
        aria-label="algorithm tracking table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
            >
              Node
            </TableCell>
            <TableCell
              align="center"
              sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
            >
              Min
            </TableCell>
            <TableCell align="center">Prev</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.nodes.map((node, index) => (
            <TableRow
              key={index}
              sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
            >
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  backgroundColor: node.label.backgroundHighlight?.highlighted
                    ? node.label.backgroundHighlight.color.toString()
                    : "transparent",
                }}
              >
                {node.label.data}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  backgroundColor: node.minDistance.backgroundHighlight
                    ?.highlighted
                    ? node.minDistance.backgroundHighlight.color.toString()
                    : "transparent",
                }}
              >
                {node.minDistance.data}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  backgroundColor: node.prevNodeLabel.backgroundHighlight
                    ?.highlighted
                    ? node.prevNodeLabel.backgroundHighlight.color.toString()
                    : "transparent",
                }}
              >
                {node.prevNodeLabel.data}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// ----------------------------- Algorithm Steps list component -----------------------------

type AlgorithmStepListProps = {
  Items: Array<ReactNode>
}
const AlgorithmStepList = (props: AlgorithmStepListProps) => {
  const theme = useTheme()

  const endOfContentRef = useRef<HTMLDivElement>(null) // Create a ref for the dummy div

  // Scroll to the end of the content when Items changes
  useEffect(() => {
    if (endOfContentRef.current) {
      endOfContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [props.Items])

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, .2)",
        position: "absolute",
        right: theme.spacing(2),
        bottom: "50%",
        transform: "translateY(25%)",
        width: "30vw",
        maxHeight: "50vh",
        overflowY: "scroll",
        zIndex: 10000000,
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar in Chrome, Safari, and Edge
        },
        borderRadius: 1,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        paddingBlock={2}
      >
        {props.Items.map((Item, i) => (
          <Box paddingInline={4}>{Item}</Box>
        ))}
        <Box
          ref={endOfContentRef}
          paddingBottom={theme.spacing(8)}
        />
      </Stack>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          height: "20vh",
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
          pointerEvents: "none", // Ensures the overlay does not interfere with scroll or clicks
        }}
      />
    </Box>
  )
}

// --------------------------------- TABLE HIGHLIGHT TRACKER HOOK ---------------------------------

type TrackedCellMeta = {
  highlighted: boolean
  color: Color
}

type TrackedCell<IdType, ColumnNames extends string> = {
  idValue: IdType
  columnName: ColumnNames
  cellMeta: TrackedCellMeta
}

const useGenericTableMetaTracker = <IdType, ColumnNames extends string>() => {
  const [cells, setCells] = useState<Array<
    TrackedCell<IdType, ColumnNames>
  > | null>(null)

  // highlight a cell
  function highlightCell(
    targetId: IdType,
    columnToHighlight: ColumnNames,
    color: Color
  ) {
    if (cells == null) return

    // look for the row with this id
    const foundCellIndex = cells.findIndex(
      (cell) => cell.idValue == targetId && cell.columnName == columnToHighlight
    )

    if (foundCellIndex == -1) return

    // found the cell -> updated to include column highlighted
    const newObj = cells[foundCellIndex]

    newObj.cellMeta = {
      ...newObj.cellMeta,
      highlighted: true,
      color: color,
    }

    // drop the old cell data and add the new data
    setCells((oldCells) =>
      oldCells!
        .filter(
          (cell) =>
            cell.idValue !== targetId || cell.columnName !== columnToHighlight
        )
        .concat([newObj])
    )
  }

  function unhighlightCell(targetId: IdType, column: ColumnNames) {
    if (cells == null) return

    // look for the row with this id
    const foundCellIndex = cells.findIndex(
      (cell) => cell.idValue == targetId && cell.columnName == column
    )

    if (foundCellIndex == -1) return

    // found the cell -> updated to include column highlighted
    const newObj = cells[foundCellIndex]

    newObj.cellMeta = {
      ...newObj.cellMeta,
      highlighted: false,
    }

    // drop the old cell data and add the new data
    setCells((oldCells) =>
      oldCells!
        .filter(
          (cell) => cell.idValue !== targetId || cell.columnName !== column
        )
        .concat([newObj])
    )
  }

  function getCellMeta(
    targetId: IdType,
    columnToHighlight: ColumnNames
  ): TrackedCellMeta | undefined {
    return cells?.find(
      (cell) => cell.idValue == targetId && cell.columnName == columnToHighlight
    )?.cellMeta
  }

  return {
    defineCells(ids: Array<IdType>, columnNames: Array<ColumnNames>) {
      if (cells) throw new Error("rows already defined. Cannot change")

      const newCells: Array<TrackedCell<IdType, ColumnNames>> = []

      ids.forEach((id) => {
        columnNames.forEach((columnName) => {
          newCells.push({
            idValue: id,
            columnName: columnName,
            cellMeta: {
              highlighted: false,
              color: new Color("white"),
            },
          })
        })
      })
      setCells(newCells)
    },
    highlightCell,
    getCellMeta,
    unhighlightCell,
  }
}

// ------------------------------------ PAGE COMPONENTS ------------------------------------

// the whole purpose of this component is to be able to get the scene object for use in the graphManager
const NestedCanvasElement = ({
  graphRendererSetter,
  graphRendererDefined,
}: {
  graphRendererSetter: (manager: ThreeDGraphRenderer) => void
  graphRendererDefined: boolean
}) => {
  const { scene, camera } = useThree()

  const lightRef = useRef<DirectionalLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Offset the light slightly behind and above the camera
      const offset = new Vector3(0, 0.5, 0.2) // Adjust offset values as needed
      const lightPosition = camera.position.clone().add(offset)
      lightRef.current.position.copy(lightPosition)

      // Ensure the light still points in the same direction as the camera
      const target = new Vector3()
      camera.getWorldDirection(target)
      lightRef.current.target.position.copy(camera.position.clone().add(target))
      lightRef.current.target.updateMatrixWorld()
    }
  })

  useEffect(() => {
    if (!graphRendererDefined)
      graphRendererSetter(
        new ThreeDGraphRenderer(new ThreejsGraphRenderingStrategy(scene))
      )
  }, [scene, graphRendererSetter, graphRendererDefined])

  return (
    <>
      <directionalLight
        castShadow
        position={[10, 10, 10]}
        intensity={1}
        ref={lightRef}
      />
    </>
  )
}

const DijkstrasAlgorithmVisualizationPage = () => {
  const [graphRenderer, graphRendererSetter] =
    useState<ThreeDGraphRenderer | null>(null)
  const graphManager = useMemo(() => new AlphabetGraphManager(), [])
  const algorithmManager = useDijkstraAlgorithmManager()
  const algorithmUIManager = useMemo(() => new DijkstraAlertGenerator(), [])
  const tableMetaManager = useGenericTableMetaTracker<
    DijkstraTrackingTableRowData["label"]["data"],
    keyof DijkstraTrackingTableRowData
  >()

  const [showingGridLines, showingGridLinesSetter] = useState<boolean>(false)
  const [minNumNodes, minNumNodesSetter] = useState<number>(5)
  const [maxNumNodes, maxNumNodesSetter] = useState<number>(26)
  const [maxDistanceFromOrigin, maxDistanceFromOriginSetter] =
    useState<number>(7)
  const [minNumEdges, minNumEdgesSetter] = useState<number>(5)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [stepAlertTitle, stepAlertTitleSetter] = useState<string>()
  const [stepAlertDescription, stepAlertDescriptionSetter] = useState<string>()

  const [messagesToShowInLog, messagesToShowInLogSetter] = useState<
    Array<ReactNode>
  >([])

  const [subroutineStepNum, subroutineStepNumSetter] = useState<number>(0)
  const [runningSubroutine, runningSubroutineSetter] = useState<boolean>(false)

  useEffect(() => {
    const newStepAlertData = algorithmUIManager.getCurrentStepAlert(
      algorithmManager.userStep
    )
    stepAlertTitleSetter(newStepAlertData.title)
  }, [algorithmManager.userStep, algorithmUIManager])

  useEffect(() => {
    setTimeout(() => {
      showingGridLinesSetter(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (!graphManager || !graphRenderer) return

    // clear old nodes
    graphManager.clearNodes()
    graphManager.clearEdges()
    graphRenderer.clearNodeMeshes()
    graphRenderer.clearEdgeMeshes()

    // generate the nodes
    const numNodesToGenerate = genRandomInt(minNumNodes, maxNumNodes)
    for (let i = 0; i < numNodesToGenerate; i++) {
      graphManager.generateNode(maxDistanceFromOrigin)
    }

    // generate the edges

    // generate base edges (to make the graph connected)
    do {
      const edgeGenerated = graphManager.generateEdge()
      graphRenderer.addEdge({
        end1Location: edgeGenerated[0].location,
        end2Location: edgeGenerated[1].location,
        radius: 0.05,
      })
    } while (graphManager.edgesNeededToConnect() > 0)

    // generate more edges so that there are multiple paths to get somewhere in the graph

    const numEdgesPossibleLeft =
      graphManager.maxEdges - graphManager.allEdges.length
    const numExtraEdgesToGenerate = genRandomInt(1, numEdgesPossibleLeft) / 2

    for (let i = 0; i < numExtraEdgesToGenerate; i++) {
      const edgeGenerated = graphManager.generateEdge()
      graphRenderer.addEdge({
        end1Location: edgeGenerated[0].location,
        end2Location: edgeGenerated[1].location,
        radius: 0.05,
      })
    }

    // pass the nodes and edges to the algorithm manager
    algorithmManager.defineNodes(graphManager.allNodes)

    algorithmManager.defineEdges(
      graphManager.allEdges.map((edge) => {
        return [edge[0], edge[1]]
      })
    )

    // when the nodes become defined, relay them to the table meta manager
    tableMetaManager.defineCells(
      graphManager.allNodes.map((node) => node.label),
      ["label", "minDistance", "prevNodeLabel"]
    )
  }, [
    graphManager,
    maxDistanceFromOrigin,
    minNumNodes,
    maxNumNodes,
    graphRenderer,
    minNumEdges,
  ])

  function onSphereClick(nodeCoords: Vector3) {
    switch (algorithmManager.userStep) {
      case DijkstrasAlgorithmSteps.PickStartingNode: {
        const firstNode_labeled = graphManager.getNodeByCoordinates(nodeCoords)
        if (!firstNode_labeled) return
        algorithmManager.setStartNode(firstNode_labeled)
        addLogMessage(
          <Typography variant="body2">
            Picked starting node:{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: STARTING_NODE_COLOR.toString() }}
            >
              {firstNode_labeled.label}
            </Typography>
          </Typography>
        )
        algorithmManager.nextUserStep()
      }

      default:
        return
    }
  }

  // if user changes any of the settings of the graph, restart the algorithm
  useEffect(() => {
    algorithmManager.resetAlgorithm()
  }, [minNumNodes, maxNumNodes, maxDistanceFromOrigin])

  function takeNextInternalStep() {
    const stepTaken = algorithmManager.takeNextStep()

    messagesToShowInLogSetter((prev) => [
      ...prev,
      ...getStepMessages(stepTaken),
    ])
    const shouldRunSubroutineNext = getSubroutineTypeToRun(stepTaken) !== null
    runningSubroutineSetter(shouldRunSubroutineNext)
  }

  function onNextAlgorithmStep() {
    if (runningSubroutine) {
      const subroutineTypeToRun = getSubroutineTypeToRun(
        algorithmManager.stepsTaken[algorithmManager.currentlyShowingStepIndex]
      )
      runSubroutine(subroutineTypeToRun!)
    } else {
      takeNextInternalStep()
    }
  }

  function getSubroutineTypeToRun(
    lastStepShowing: DijkstraAlgStep
  ): SubroutineType | null {
    switch (lastStepShowing.stepType) {
      case "selectNewCurrentNode":
        return null
      case "determineUnvisitedNeighbors":
        return null
      case "calcNewDistance":
        return null
      case "checkCanContinue":
        return null
      case "compareNewDistance":
        return null
      case "pickOneOfTheNeighborNodesToCalcDistance":
        return "calcDistance"
    }
  }

  function addLogMessage(message: ReactNode) {
    messagesToShowInLogSetter((prev) => [...prev, message])
  }

  function runSubroutine(subroutineTypeToRun: SubroutineType): void {
    switch (subroutineTypeToRun) {
      case "calcDistance":
        runCalcDistanceSubroutine()
        break
    }
  }

  function runCalcDistanceSubroutine() {
    const neighborNode =
      algorithmManager.stepsTaken[algorithmManager.stepsTaken.length - 1]!
        .neighborNodeSelected
    const currentNode =
      algorithmManager.stepsTaken[algorithmManager.stepsTaken.length - 3]!
        .newCurrentNodeSelected

    const currentNodeNeighborDistance = roundNumber(
      distanceBetweenPoints(currentNode!.location, neighborNode!.location),
      2
    )

    const currentNodeMinDistanceKnown =
      algorithmManager.trackingTable.rows.find(
        (row) => row.node == currentNode
      )!.minDistance

    const neighborNodeMinDistanceKnown =
      algorithmManager.trackingTable.rows.find(
        (row) => row.node == neighborNode
      )!.minDistance

    const newDistanceToCompare =
      currentNodeNeighborDistance + currentNodeMinDistanceKnown

    // figure out which substep should run
    switch (subroutineStepNum) {
      case 0:
        // sending message to log that we're calculating distance between the two nodes
        addLogMessage(
          <Typography variant="body2">
            Calculating the path distance to node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: SELECTED_NEIGHBOR_NODE_COLOR.toString() }}
            >
              {neighborNode!.label}
            </Typography>{" "}
            through the current node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: CURRENT_NODE_COLOR.toString() }}
            >
              {currentNode!.label}
            </Typography>
          </Typography>
        )

        // change the color of the edge
        graphRenderer?.updateEdge({
          end1Location: neighborNode!.location,
          end2Location: currentNode!.location,
          color: EDGE_CALC_DISTANCE_COLOR,
          radius: 0.05,
        })
        break
      case 1:
        // add message about calculating the distance JUST between the current node and the neighbor node
        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            First step is to calculate the distance just between the current
            node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: CURRENT_NODE_COLOR.toString() }}
            >
              {currentNode!.label}
            </Typography>{" "}
            and the neighbor node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: SELECTED_NEIGHBOR_NODE_COLOR.toString() }}
            >
              {neighborNode!.label}
            </Typography>
          </Typography>
        )

        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            The distance between the current node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: CURRENT_NODE_COLOR.toString() }}
            >
              {currentNode!.label}
            </Typography>{" "}
            and the neighbor node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: SELECTED_NEIGHBOR_NODE_COLOR.toString() }}
            >
              {neighborNode!.label}
            </Typography>{" "}
            is{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: EDGE_CALC_DISTANCE_COLOR.toString() }}
              fontWeight="bold"
            >
              {currentNodeNeighborDistance} units
            </Typography>
          </Typography>
        )
        break
      case 2:
        // show message about adding distance tracked for current node
        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            Now we need to add this distance onto{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: ALREADY_KNOWN_CURRENT_NODE_DISTANCE_COLOR.toString(),
              }}
            >
              the already known shortest distance to the current node
            </Typography>{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: CURRENT_NODE_COLOR.toString() }}
            >
              {currentNode!.label}
            </Typography>{" "}
            which we can find by looking in the table on the left.
          </Typography>
        )

        // highlight the cell in the table that is the minDistance for the current node
        tableMetaManager.highlightCell(
          currentNode!.label,
          "minDistance",
          ALREADY_KNOWN_CURRENT_NODE_DISTANCE_COLOR.darken(0.3)
        )

        // add the new distance equation to the log
        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            The new total min distance contender length is{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: EDGE_CALC_DISTANCE_COLOR.toString() }}
            >
              {currentNodeNeighborDistance}
            </Typography>{" "}
            +{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: ALREADY_KNOWN_CURRENT_NODE_DISTANCE_COLOR.toString(),
              }}
            >
              {currentNodeMinDistanceKnown}
            </Typography>{" "}
            ={" "}
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: NEW_DISTANCE_TO_COMPARE_COLOR.toString(),
              }}
            >
              {newDistanceToCompare}
            </Typography>{" "}
            units
          </Typography>
        )
        break
      case 3:
        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            The next step is to compare this contender distance with the{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: COMPARE_MIN_DISTANCE_COLOR.toString() }}
            >
              currently known min distance for the neighbor node
            </Typography>{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: SELECTED_NEIGHBOR_NODE_COLOR.toString() }}
            >
              {neighborNode!.label}
            </Typography>{" "}
            which is now highlighted in the table.
          </Typography>
        )

        // highlight the mindistance cell for the neighbor node
        tableMetaManager.highlightCell(
          neighborNode!.label,
          "minDistance",
          COMPARE_MIN_DISTANCE_COLOR.darken(0.5)
        )

        addLogMessage(
          <Typography
            variant="body2"
            paddingLeft={1}
            sx={{ color: new Color("#fff").alpha(0.5).toString() }}
          >
            The minDistance already known is{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: COMPARE_MIN_DISTANCE_COLOR.toString() }}
            >
              {neighborNodeMinDistanceKnown}
            </Typography>{" "}
            and the new distance to compare is{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: NEW_DISTANCE_TO_COMPARE_COLOR.toString() }}
            >
              {newDistanceToCompare}
            </Typography>
            .
          </Typography>
        )

        if (newDistanceToCompare < neighborNodeMinDistanceKnown) {
          // replace
          addLogMessage(
            <Typography
              variant="body2"
              paddingLeft={1}
              sx={{ color: new Color("#fff").alpha(0.5).toString() }}
            >
              Since the new distance is smaller than the one in the table, we
              replace the one in the table for the smaller distance.{" "}
              <Typography
                variant="body2"
                sx={{ textDecoration: "underline" }}
              >
                Click the arrow to see this happen.
              </Typography>
            </Typography>
          )
        } else {
          addLogMessage(
            <Typography
              variant="body2"
              paddingLeft={1}
              sx={{ color: new Color("#fff").alpha(0.5).toString() }}
            >
              Since the new distance is larger than the one in the table, we
              keep the already existing distance since we're trying to find the
              SHORTEST path.
            </Typography>
          )

          // skip step 4 since that's only if the new distance was smaller
          subroutineStepNumSetter((prev) => prev + 1)
        }
        break
      case 4:
        // update the table if necessary
        // plug in the newDistanceToCompare into the neighbor node min distance
        algorithmManager.trackingTable.updateNodeRow(neighborNode!, {
          minDistance: newDistanceToCompare,
        })
        break
      case 5:
        // remove the highlights
        tableMetaManager.unhighlightCell(currentNode!.label, "minDistance")
        tableMetaManager.unhighlightCell(neighborNode!.label, "minDistance")

        // run next internal step
        takeNextInternalStep()
        break
      case 6:
        runningSubroutineSetter(false)
        subroutineStepNumSetter(0)
        return
    }

    subroutineStepNumSetter((prev) => prev + 1)
  }

  function getStepMessages(step: DijkstraAlgStep): Array<ReactNode> {
    switch (step.stepType) {
      case "selectNewCurrentNode":
        return [
          `Selected ${
            step.newCurrentNodeSelected!.label
          } as the new current node`,
        ]
      case "determineUnvisitedNeighbors":
        return [
          <Typography variant="body2">
            Found {step.unvisitedNeighborsDiscovered!.length} unvisited neighbor
            nodes:{" "}
            {step.unvisitedNeighborsDiscovered?.map((node, i) => (
              <Typography
                variant="body2"
                component="span"
                sx={{ color: UNVISITED_NEIGHBOR_NODE_COLOR.toString() }}
              >
                {node.label}
                {i !== step.unvisitedNeighborsDiscovered!.length - 1
                  ? ", "
                  : ""}
              </Typography>
            ))}
          </Typography>,
        ]
      case "calcNewDistance":
        return []
      case "checkCanContinue":
        return []
      case "compareNewDistance":
        return []
      case "pickOneOfTheNeighborNodesToCalcDistance":
        return [
          <Typography variant="body2">
            Picked node{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ color: SELECTED_NEIGHBOR_NODE_COLOR.toString() }}
            >
              {step.neighborNodeSelected!.label}
            </Typography>{" "}
            as the next unvisited neighbor
          </Typography>,
        ]
    }
  }

  function getSphereColor(node: LabeledNode): Color {
    // if it's a visited node -> VISITED_NODE_COLOR
    const isVisitedNode = algorithmManager.visitedNodes?.includes(node)
    const isUnvisitedCurrentNodeNeighboer =
      algorithmManager.unvisitedCurrentNodeNeighbors?.includes(node)
    const isSelectedNeighborNode =
      algorithmManager.currentlySelectedNeighborNode == node
    const isCurrentNode = node == algorithmManager.getCurrentNode()

    return isCurrentNode
      ? CURRENT_NODE_COLOR
      : isVisitedNode
      ? VISITED_NODE_COLOR
      : isSelectedNeighborNode
      ? SELECTED_NEIGHBOR_NODE_COLOR
      : isUnvisitedCurrentNodeNeighboer
      ? UNVISITED_NEIGHBOR_NODE_COLOR
      : new Color("#fff")
  }

  const [showingDevelopmentAlert, showingDevelopmentAlertSetter] =
    useState<boolean>(true)

  return (
    <>
      <SwipeableEdgeDrawer>
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={8}
          color="#fff"
          width="100%"
          flexWrap="wrap"
        >
          {/* toggle grid lines */}
          <GridToggleButton
            showingGrid={showingGridLines}
            showingGridSetter={showingGridLinesSetter}
            width={isMobile ? "100%" : "max-content"}
          />
          <NumberOfNodesPicker
            value={[minNumNodes, maxNumNodes]}
            setValue={(newValues) => {
              minNumNodesSetter(newValues[0])
              maxNumNodesSetter(newValues[1])
            }}
          />
          <MaxDistancePicker
            value={maxDistanceFromOrigin}
            setValue={maxDistanceFromOriginSetter}
          />
        </Stack>
      </SwipeableEdgeDrawer>

      <Box
        sx={{
          width: "max-content",
          position: "absolute",
          left: theme.spacing(2),
          bottom: "50%",
          maxHeight: "50vh",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar in Chrome, Safari, and Edge
          },
          transform: "translateY(50%)",
          zIndex: 10000000,
        }}
      >
        <AlgorithmTrackingTable
          nodes={algorithmManager.trackingTable.rows.map((row) => {
            return {
              label: {
                data: row.node.label,
                backgroundHighlight: {
                  highlighted:
                    tableMetaManager.getCellMeta(row.node.label, "label")
                      ?.highlighted ?? false,
                  color:
                    tableMetaManager.getCellMeta(row.node.label, "label")
                      ?.color ?? new Color("#fff"),
                },
              },
              minDistance: {
                data: row.minDistance,
                backgroundHighlight: {
                  highlighted:
                    tableMetaManager.getCellMeta(row.node.label, "minDistance")
                      ?.highlighted ?? false,
                  color:
                    tableMetaManager.getCellMeta(row.node.label, "minDistance")
                      ?.color ?? new Color("#fff"),
                },
              },
              prevNodeLabel: {
                data: row.prevNode?.label ?? null,
                backgroundHighlight: {
                  highlighted:
                    tableMetaManager.getCellMeta(
                      row.node.label,
                      "prevNodeLabel"
                    )?.highlighted ?? false,
                  color:
                    tableMetaManager.getCellMeta(
                      row.node.label,
                      "prevNodeLabel"
                    )?.color ?? new Color("#fff"),
                },
              },
            }
          })}
        />
      </Box>

      <AlgorithmStepList Items={messagesToShowInLog} />

      {/* user steps */}

      {/* step alert */}
      <Stack
        direction="column"
        spacing={2}
        style={{
          width: isMobile ? "90vw" : "max-content",
          position: "absolute",
          bottom: isMobile
            ? algorithmManager.userStep ==
              DijkstrasAlgorithmSteps.PickStartingNode
              ? theme.spacing(10)
              : theme.spacing(4)
            : theme.spacing(2),
          left: isMobile ? "50%" : theme.spacing(2),
          transform: isMobile ? "translateX(-50%)" : undefined,
          zIndex: 101,
        }}
      >
        <Snackbar
          open={true}
          message={stepAlertTitle}
          sx={{
            position: "static",
            zIndex: 100,
            ".MuiPaper-root": {
              fontSize: isMobile
                ? theme.typography.h5.fontSize
                : theme.typography.body2.fontSize,
              maxWidth: !isMobile ? "max-content" : undefined,
              minWidth: !isMobile ? "unset" : "auto",
            },
          }}
        />

        {/* arrows to control algorithm */}
        {algorithmManager.userStep !==
          DijkstrasAlgorithmSteps.PickStartingNode && (
          <Stack
            direction="row"
            sx={{ width: "100%", justifyContent: "space-between" }}
          >
            <MdOutlineKeyboardArrowLeft
              size={40}
              color="#fff"
              cursor="pointer"
            />
            <MdOutlineKeyboardArrowRight
              size={40}
              color="#fff"
              onClick={() => onNextAlgorithmStep()}
              cursor="pointer"
            />
          </Stack>
        )}
      </Stack>

      {showingDevelopmentAlert && (
        <Alert
          bgColor={new Color("#fcba03").alpha(0.9)}
          showShimmer={false}
          textColor={IN_DEVELOPMENT_ALERT_TEXT_COLOR}
          height="75vh"
        >
          <FaWrench
            size={475}
            style={{
              position: "absolute",
              color: "#deb547",
              left: -175,
              zIndex: -1,
            }}
          />
          <FaGear
            size={400}
            style={{
              position: "absolute",
              color: "#deb547",
              right: -100,
              bottom: -100,
              zIndex: -1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: isMobile ? "100%" : "max-content",
              maxWidth: "100%",
              marginInline: "auto",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              lineHeight={2}
            >
              In Development
            </Typography>
            <IconButton
              onClick={() => showingDevelopmentAlertSetter(false)}
              sx={{
                marginLeft: 2,
                animation: `${inDevelopmentAlertCloseButtonPulseAnimation} 3s infinite forwards`,
                animationDelay: "2s",
                transition: "background-color 80ms linear",
                ":hover": {
                  backgroundColor: "rgba(255, 255, 255, .2) !important",
                },
              }}
            >
              <CloseIcon
                sx={{
                  color:
                    IN_DEVELOPMENT_ALERT_TEXT_COLOR.lighten(0.5).toString(),
                }}
              />
            </IconButton>
          </Box>
        </Alert>
      )}

      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        shadows
      >
        <PerspectiveCamera
          makeDefault
          position={[-5, 10, 20]}
        />
        <OrbitControls />
        <NestedCanvasElement
          graphRendererDefined={!!graphRenderer}
          graphRendererSetter={(newGraphManager) => {
            graphRendererSetter(newGraphManager)
          }}
        />
        <MyGridHelper
          size={10}
          showing={showingGridLines}
        />
        {graphManager.allNodes.map((node, i) => (
          <>
            <SphereNode
              position={node.location}
              onSphereClick={onSphereClick}
              color={getSphereColor(node)}
            />
            {/* label for node */}
            <Text3D
              font="/Roboto_Bold.json"
              key={node.label}
              position={[
                node.location.x - 0.15,
                node.location.y + 0.75,
                node.location.z,
              ]}
              size={0.3}
              height={0.1}
            >
              {node.label}
              <meshStandardMaterial color="#ffa724" />
            </Text3D>
          </>
        ))}
      </Canvas>
    </>
  )
}

export default DijkstrasAlgorithmVisualizationPage
