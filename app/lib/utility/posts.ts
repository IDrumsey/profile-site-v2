import { PostItem } from "app/types"
import { TagIconResolver } from "../TagIconResolver"

const determinePostHighlightColor_DARKEN_FACTOR = 0.3

export function determinePostHighlightColor(
  post: PostItem,
  DEFAULT_HIGHLIGHT_COLOR: string
): string {
  // if no tags, then just use a default color
  if (post.tags.length == 0) {
    return DEFAULT_HIGHLIGHT_COLOR
  }

  // if one tag, use that tag color
  else if (post.tags.length == 1) {
    return (
      TagIconResolver.getTagIconColor(post.tags[0])
        ?.darken(determinePostHighlightColor_DARKEN_FACTOR)
        ?.toString() ?? DEFAULT_HIGHLIGHT_COLOR
    )
  }

  // if more than one tag, idk we could make a gradient, but that's more complicated than it's worth
  // we could just use the first tag color
  // we could use the most popular tag or least popular tag
  // I'm going to just use the first tag... maybe that will make it semi random since those are manually typed in on the mdx files.
  else {
    // TODO: Could probably go through each tag in case the first ones don't have a color instead of using the default highlight color as a backup, but this is fine for now.
    return (
      TagIconResolver.getTagIconColor(post.tags[0])
        ?.darken(determinePostHighlightColor_DARKEN_FACTOR)
        ?.toString() ?? DEFAULT_HIGHLIGHT_COLOR
    )
  }
}
