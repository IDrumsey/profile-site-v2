import Color from "color"
import { IconType } from "react-icons"
import {
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaPython,
  FaCloud,
} from "react-icons/fa"

import { RiNextjsFill } from "react-icons/ri"
import { SiJavascript } from "react-icons/si"
import { BiLogoTypescript, BiBible } from "react-icons/bi"
import { FaNpm } from "react-icons/fa"
import { LuListTree } from "react-icons/lu"

const PostTagMeta: Array<{ tag: string; Icon?: IconType; iconColor: Color }> = [
  {
    tag: "nodejs",
    Icon: FaNodeJs,
    iconColor: Color("#6da767"),
  },

  {
    tag: "typescript",
    Icon: BiLogoTypescript,
    iconColor: Color("#3178c6"),
  },

  {
    tag: "javascript",
    Icon: SiJavascript,
    iconColor: Color("#f7e025"),
  },

  {
    tag: "CSS",
    Icon: FaCss3Alt,
    iconColor: Color("#2966f2"),
  },

  {
    tag: "React",
    Icon: FaReact,
    iconColor: Color("#58c4dc"),
  },

  {
    tag: "Next.js",
    Icon: RiNextjsFill,
    iconColor: Color("#c7c7c7"),
  },

  {
    tag: "Python",
    Icon: FaPython,
    iconColor: Color("#356f9f"),
  },

  {
    tag: "Git",
    Icon: FaGitAlt,
    iconColor: Color("#f44c27"),
  },

  {
    tag: "SQL",
    iconColor: Color("#fa43df"),
  },

  {
    tag: "npm",
    Icon: FaNpm,
    iconColor: Color("#c53635"),
  },

  {
    tag: "dependency management",
    Icon: LuListTree,
    iconColor: Color("#3fafeb"),
  },

  {
    tag: "cloud",
    Icon: FaCloud,
    iconColor: Color("#fff"),
  },

  {
    tag: "Bible",
    Icon: BiBible,
    iconColor: Color("#a28e78"),
  },
]

export default PostTagMeta
