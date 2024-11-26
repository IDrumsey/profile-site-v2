"use client"

import Masonry from "@mui/lab/Masonry"
import { Box, Dialog, DialogContent, useTheme } from "@mui/material"
import { PhotoMeta } from "app/types"
import axios from "axios"
import { useState, useEffect } from "react"
import CloseIcon from "@mui/icons-material/Close"
import AlwaysVisibleIconButton from "@/components/AlwaysVisibleIconButton"
import Color from "color"

const PhotoGalleryPage = () => {
  const [photos, setPhotos] = useState<Array<PhotoMeta>>([])
  const [popupPhotoToShow, setPopupPhotoToShow] = useState<PhotoMeta | null>(
    null
  )

  useEffect(() => {
    const loadHandler = async () => {
      const res = await axios.get("/api/photo-gallery")

      if (res.status == 200) {
        setPhotos(res.data)
      }
    }

    loadHandler()
  }, [])

  const handlePhotoClicked = (photoClicked: PhotoMeta) => {
    setPopupPhotoToShow(photoClicked)
  }

  return (
    <>
      <div style={{ marginBlock: 64 }}>
        <PhotoGallery
          photos={photos}
          onPhotoClick={handlePhotoClicked}
        />
        <PhotoPopup
          photos={photos}
          showingPhoto={popupPhotoToShow}
          onCloseBtnClick={() => setPopupPhotoToShow(null)}
        />
      </div>
    </>
  )
}

export default PhotoGalleryPage

const PhotoGallery = ({
  photos,
  onPhotoClick,
}: {
  photos: Array<PhotoMeta>
  onPhotoClick: (photoClicked: PhotoMeta) => void
}) => {
  return (
    <Masonry
      columns={{ xs: 2, sm: 3, md: 4 }}
      spacing={2}
    >
      {photos.map((photo, index) => (
        <Box
          onClick={() => onPhotoClick(photo)}
          key={index}
          component="img"
          src={photo.url}
          alt={`Photo ${index + 1}`}
          sx={{
            width: "100%",
            height: photo.orientation === "portrait" ? "300px" : "150px", // Adjust height based on type
            borderRadius: "8px",
            objectFit: "cover",
            boxShadow: 2,
          }}
        />
      ))}
    </Masonry>
  )
}

const PhotoPopup = ({
  photos,
  showingPhoto,
  onCloseBtnClick,
}: {
  photos: Array<PhotoMeta>
  showingPhoto: PhotoMeta | null
  onCloseBtnClick: () => void
}) => {
  const theme = useTheme()

  return (
    <Dialog
      open={showingPhoto != null}
      onClose={onCloseBtnClick}
      fullScreen
      sx={{ zIndex: 100000000 }}
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          backgroundColor: "rgba(0, 0, 0, .6)",
        }}
      >
        {showingPhoto && (
          <img
            src={showingPhoto.url}
            alt="Selected"
            style={{
              width: "auto",
              maxWidth: "90vw",
              height: "90vh",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
        <AlwaysVisibleIconButton
          onClick={onCloseBtnClick}
          sx={{
            color: "#fff",
            position: "absolute",
            top: theme.spacing(2),
            right: theme.spacing(3),
          }}
          size="small"
          bgColor={new Color("#fff").alpha(0.2).toString()}
          hoverColor={new Color("#fff").alpha(0.3).toString()}
        >
          <CloseIcon />
        </AlwaysVisibleIconButton>
      </DialogContent>
    </Dialog>
  )
}
