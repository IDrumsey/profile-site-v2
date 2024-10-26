/**
 * This file defines helper functions to run network requests from the client like calling apis and stuff.
 */

import axios from "axios"

export async function getPosts() {
  return await axios.get("/api/posts")
}
