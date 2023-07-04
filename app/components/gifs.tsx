import GiphyGif from "./giphy-gif/giphy-gif"

export const HeadShakeNoGif = () => {
  return (
    <GiphyGif
      options={{ style: { margin: "auto", marginTop: 25 } }}
      link="https://giphy.com/gifs/cEGwQzpKFKcUw"
    >
      <iframe
        src="https://giphy.com/embed/cEGwQzpKFKcUw"
        width="480"
        height="214"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </GiphyGif>
  )
}

export const FallOnFaceGif = () => {
  return (
    <GiphyGif
      options={{ style: { margin: "auto", marginTop: 25 } }}
      link="https://giphy.com/gifs/falling-bike-face-plant-hWgeMEUncId9u"
    >
      <iframe
        src="https://giphy.com/embed/hWgeMEUncId9u"
        width="480"
        height="308"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </GiphyGif>
  )
}
