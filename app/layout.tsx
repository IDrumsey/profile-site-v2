import { MotionConfig } from "framer-motion"
import { Viewport } from "next"
import "./styles/globals.scss"
import { Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Navbar from "@/components/navbar/navbar"
import { Box, ThemeProvider } from "@mui/material"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import theme from "./styles/theme"
import { GoogleAnalytics } from "@next/third-parties/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

// https://stackoverflow.com/questions/37924959/why-am-i-getting-different-font-sizes-when-displaying-my-page-in-chrome-android
// https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
// https://webmasters.stackexchange.com/a/138119
// https://stackoverflow.com/questions/26572138/meta-viewport-and-width-device-width-vs-percent-dimentions#:~:text=Yes%2C%20you%20are%20on%20the%20right%20track%3A%20setting%20width%3Ddevice%2Dwidth%20means%20that%20the%20device%20gets%20to%20choose%20how%20%22big%22%20the%20viewport%20is%20in%20terms%20of%20pixels%2C%20e.g.%20for%20responsive%20layouts.
// https://web.dev/responsive-web-design-basics/
export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={roboto.className}
    >
      <body>
        <div>
          <Navbar />
          <img
            src="/top-gradient.png"
            alt="Gradient"
            id="top-gradient"
          />
          {/* <MotionConfig reducedMotion="user">{children}</MotionConfig> */}
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppRouterCacheProvider>
        </div>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-1SCMBMP7P4" />
    </html>
  )
}
