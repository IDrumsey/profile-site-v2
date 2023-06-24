import GiphyGif from "./giphy-gif/giphy-gif"

export const HeadShakeNoGif = () => {
  return (
    <GiphyGif options={{ style: { margin: "auto", marginTop: 25 } }}>
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
