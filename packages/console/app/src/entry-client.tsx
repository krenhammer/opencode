// @refresh reload
import { mount, StartClient } from "@solidjs/start/client"
import { initializeVowel } from "~/lib/vowel"

mount(() => {
  initializeVowel("opencode-console-app")
  return <StartClient />
}, document.getElementById("app")!)
