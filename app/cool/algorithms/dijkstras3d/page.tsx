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
  GraphGenerator,
  ThreeDGraph,
  ThreejsGraphStrategy,
} from "@/library/algorithms/graphs/3d/Graph"
import {
  IconButton,
  IconButtonProps,
  Snackbar,
  Stack,
  Switch,
  useMediaQuery,
} from "@mui/material"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
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
import { IoMdGrid } from "react-icons/io"
import Slider from "@mui/material/Slider"
import { genRandomInt } from "@/library/utility/general"
import { DirectionalLight, Vector3 } from "three"
import {
  DijkstraAlertGenerator,
  useDijkstraAlgorithmManager,
  DijkstrasAlgorithmSteps,
} from "@/library/algorithms/dijkstras/AlgorithmManager"
import SphereNode from "@/components/3d/Nodes/SphereNode"
import { isSamePoint } from "@/library/utility/threejs"

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
        max={50}
        getAriaLabel={() => "# of nodes"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={(value) => `${value}`}
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
        getAriaValueText={(value) => `${value}`}
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

// the whole purpose of this component is to be able to get the scene object for use in the graphManager
const NestedCanvasElement = ({
  graphManagerSetter,
  graphManagerDefined,
}: {
  graphManagerSetter: (manager: ThreeDGraph) => void
  graphManagerDefined: boolean
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
    if (!graphManagerDefined)
      graphManagerSetter(new ThreeDGraph(new ThreejsGraphStrategy(scene)))
  }, [scene, graphManagerSetter, graphManagerDefined])

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
  const [graphManager, graphManagerSetter] = useState<ThreeDGraph | null>(null)
  const graphGenerator = useMemo(() => new GraphGenerator(), [])
  const algorithmManager = useDijkstraAlgorithmManager()
  const algorithmUIManager = useMemo(() => new DijkstraAlertGenerator(), [])

  const [showingGridLines, showingGridLinesSetter] = useState<boolean>(false)
  const [minNumNodes, minNumNodesSetter] = useState<number>(5)
  const [maxNumNodes, maxNumNodesSetter] = useState<number>(50)
  const [maxDistanceFromOrigin, maxDistanceFromOriginSetter] =
    useState<number>(7)
  const [minNumEdges, minNumEdgesSetter] = useState<number>(5)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [stepAlertTitle, stepAlertTitleSetter] = useState<string>()
  const [stepAlertDescription, stepAlertDescriptionSetter] = useState<string>()

  useEffect(() => {
    const newStepAlertData = algorithmUIManager.getCurrentStepAlert(
      algorithmManager.step
    )
    stepAlertTitleSetter(newStepAlertData.title)
  }, [algorithmManager.step, algorithmUIManager])

  useEffect(() => {
    setTimeout(() => {
      showingGridLinesSetter(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (!graphGenerator || !graphManager) return

    // clear old nodes
    graphGenerator.clearNodes()
    graphGenerator.clearEdges()
    graphManager.clearNodes()
    graphManager.clearEdges()

    // generate the nodes
    const numNodesToGenerate = genRandomInt(minNumNodes, maxNumNodes)
    for (let i = 0; i < numNodesToGenerate; i++) {
      graphGenerator.generateNode(maxDistanceFromOrigin)
    }

    // generate the edges

    // generate base edges (to make the graph connected)
    do {
      const edgeGenerated = graphGenerator.generateEdge()
      graphManager.addEdge({
        end1Location: edgeGenerated[0],
        end2Location: edgeGenerated[1],
        radius: 0.05,
      })
    } while (graphGenerator.edgesNeededToConnect() > 0)

    // generate more edges so that there are multiple paths to get somewhere in the graph

    const numEdgesPossibleLeft =
      graphGenerator.maxEdges - graphGenerator.allEdges.length
    const numExtraEdgesToGenerate = genRandomInt(1, numEdgesPossibleLeft) / 2

    for (let i = 0; i < numExtraEdgesToGenerate; i++) {
      const edgeGenerated = graphGenerator.generateEdge()
      graphManager.addEdge({
        end1Location: edgeGenerated[0],
        end2Location: edgeGenerated[1],
        radius: 0.05,
      })
    }
  }, [
    graphGenerator,
    maxDistanceFromOrigin,
    minNumNodes,
    maxNumNodes,
    graphManager,
    minNumEdges,
  ])

  function onSphereClick(nodeCoords: Vector3) {
    switch (algorithmManager.step) {
      case DijkstrasAlgorithmSteps.PickStartingNode: {
        algorithmManager.setSelectedNode(nodeCoords)
        algorithmManager.nextStep()
      }

      default:
        return
    }
  }

  // if user changes any of the settings of the graph, restart the algorithm
  useEffect(() => {
    algorithmManager.resetAlgorithm()
  }, [minNumNodes, maxNumNodes, maxDistanceFromOrigin])

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

      {/* alerts */}

      {/* step alert */}
      <Snackbar
        open={true}
        message={stepAlertTitle}
        sx={{
          bottom: isMobile ? "10vh" : "auto",
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
          graphManagerDefined={!!graphManager}
          graphManagerSetter={(newGraphManager) => {
            graphManagerSetter(newGraphManager)
          }}
        />
        <MyGridHelper
          size={10}
          showing={showingGridLines}
        />
        {graphGenerator.allNodes.map((node, i) => (
          <SphereNode
            position={node}
            onSphereClick={onSphereClick}
            color={
              algorithmManager.selectedNode &&
              isSamePoint(node, algorithmManager.selectedNode)
                ? new Color("red")
                : new Color("#fff")
            }
          />
        ))}
      </Canvas>
    </>
  )
}

export default DijkstrasAlgorithmVisualizationPage
