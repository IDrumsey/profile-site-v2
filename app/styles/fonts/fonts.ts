import localFont from "next/font/local"
import { Poppins } from "next/font/google"

export const ProtestStrikeFont = localFont({
  src: "./ProtestStrike-Regular.ttf",
  display: "swap",
})

export const PoppinsFont = Poppins({
  weight: "500",
  subsets: ["latin"],
})
