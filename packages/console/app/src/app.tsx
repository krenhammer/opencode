import { MetaProvider, Title, Meta } from "@solidjs/meta"
import { Router, useNavigate } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense, onMount } from "solid-js"
import { Favicon } from "@opencode-ai/ui/favicon"
import { Font } from "@opencode-ai/ui/font"
import "@ibm/plex/css/ibm-plex.css"
import "./app.css"
import { LanguageProvider } from "~/context/language"
import { I18nProvider, useI18n } from "~/context/i18n"
import { strip } from "~/lib/language"
import { setVowelNavigate, setVowelGetCurrentPath } from "~/lib/vowel"
import { VoiceToggle } from "~/component/voice-toggle"

function AppMeta() {
  const i18n = useI18n()
  return (
    <>
      <Title>opencode</Title>
      <Meta name="description" content={i18n.t("app.meta.description")} />
      <Favicon />
      <Font />
    </>
  )
}

function VowelInitializer(props: { children: any }) {
  const navigate = useNavigate()

  onMount(() => {
    setVowelNavigate((path) => navigate(path))
    setVowelGetCurrentPath(() => window.location.pathname)
  })

  return (
    <>
      <div data-component="voice-widget-container">
        <VoiceToggle />
      </div>
      {props.children}
    </>
  )
}

export default function App() {
  return (
    <Router
      explicitLinks={true}
      transformUrl={strip}
      root={(props) => (
        <LanguageProvider>
          <I18nProvider>
            <MetaProvider>
              <AppMeta />
              <VowelInitializer>
                <Suspense>{props.children}</Suspense>
              </VowelInitializer>
            </MetaProvider>
          </I18nProvider>
        </LanguageProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
