import Color from "color"
import PostTagMeta from "@/library/post_tag_meta"
import { IconType } from "react-icons"

export class TagIconResolver {
  static getTagMeta(targetTag: string) {
    const foundTagMeta = PostTagMeta.find((tagMetaObj) => {
      return tagMetaObj.tag == targetTag
    })

    return foundTagMeta
  }
  static getTagIconColor(targetTag: string): Color | null {
    const foundTagMeta = TagIconResolver.getTagMeta(targetTag)

    return foundTagMeta?.iconColor ?? null
  }

  static getTagIcon(targetTag: string): IconType | null {
    const foundTagMeta = TagIconResolver.getTagMeta(targetTag)

    return foundTagMeta?.Icon ?? null
  }
}
