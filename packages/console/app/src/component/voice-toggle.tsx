import { createSignal, onMount, onCleanup, Show } from "solid-js"
import { getVowel, isVowelReady } from "~/lib/vowel"
import "./voice-toggle.css"

export function VoiceToggle() {
  const [isConnected, setIsConnected] = createSignal(false)
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(() => {
    const checkVowel = () => {
      if (isVowelReady()) {
        const vowel = getVowel()
        if (vowel) {
          setIsLoading(false)
          setIsConnected(vowel.state.isConnected)

          vowel.onStateChange((state) => {
            setIsConnected(state.isConnected)
          })
          return true
        }
      }
      return false
    }

    if (!checkVowel()) {
      const checkInterval = setInterval(() => {
        if (checkVowel()) {
          clearInterval(checkInterval)
        }
      }, 100)

      onCleanup(() => clearInterval(checkInterval))
    }
  })

  const handleToggle = async () => {
    const vowel = getVowel()
    if (!vowel) return

    try {
      if (vowel.state.isConnected) {
        vowel.stopSession()
      } else {
        await vowel.startSession()
      }
    } catch (err) {
      console.error("Vowel session error:", err)
    }
  }

  return (
    <Show when={!isLoading()}>
      <button
        type="button"
        data-component="voice-toggle"
        class={isConnected() ? "connected" : ""}
        onClick={handleToggle}
        aria-label={isConnected() ? "Stop voice session" : "Start voice session"}
        title={isConnected() ? "Click to stop voice assistant" : "Click to start voice assistant"}
      >
        <Show
          when={isConnected()}
          fallback={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 19V23M8 23H16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            <path
              d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 19V23M8 23H16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
      </button>
    </Show>
  )
}
