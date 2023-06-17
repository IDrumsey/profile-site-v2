import { MotionConfig } from "framer-motion"
import Head from "next/head"

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        {/* 
          // https://stackoverflow.com/questions/37924959/why-am-i-getting-different-font-sizes-when-displaying-my-page-in-chrome-android
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
          // https://webmasters.stackexchange.com/a/138119
          // https://stackoverflow.com/questions/26572138/meta-viewport-and-width-device-width-vs-percent-dimentions#:~:text=Yes%2C%20you%20are%20on%20the%20right%20track%3A%20setting%20width%3Ddevice%2Dwidth%20means%20that%20the%20device%20gets%20to%20choose%20how%20%22big%22%20the%20viewport%20is%20in%20terms%20of%20pixels%2C%20e.g.%20for%20responsive%20layouts.
          // https://web.dev/responsive-web-design-basics/
        */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <body>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  )
}
