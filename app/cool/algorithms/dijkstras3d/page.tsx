"use client"

import React, { useState, useEffect, ReactNode, CSSProperties } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
  ThreeDGraph,
  ThreejsGraphStrategy,
} from "@/library/algorithms/graphs/3d/Graph"
import {
  IconButton,
  IconButtonProps,
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
        <Box
          padding={4}
          sx={{ zIndex: 1000000 }}
        >
          {children}
        </Box>
      </SwipeableDrawer>
    </DrawerWrapper>
  )
}

// the whole purpose of this component is to be able to get the scene object for use in the graphManager
const NestedCanvasElement = ({
  graphManagerSetter,
}: {
  graphManagerSetter: (manager: ThreeDGraph) => void
}) => {
  const { scene } = useThree()

  useEffect(() => {
    graphManagerSetter(new ThreeDGraph(new ThreejsGraphStrategy(scene)))
  }, [scene, graphManagerSetter])

  return <></>
}

const DijkstrasAlgorithmVisualizationPage = () => {
  const [graphManager, graphManagerSetter] = useState<ThreeDGraph | null>(null)

  const [showingGridLines, showingGridLinesSetter] = useState<boolean>(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <>
      <SwipeableEdgeDrawer>
        <GridToggleButton
          showingGrid={showingGridLines}
          showingGridSetter={showingGridLinesSetter}
          width={isMobile ? "100%" : "max-content"}
        />
      </SwipeableEdgeDrawer>
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ambientLight />
        <PerspectiveCamera
          makeDefault
          position={[-1, -1, -1]}
        />
        <OrbitControls />
        <NestedCanvasElement graphManagerSetter={graphManagerSetter} />
        <MyGridHelper
          size={10}
          showing={showingGridLines}
        />
      </Canvas>
    </>
  )
}

export default DijkstrasAlgorithmVisualizationPage
