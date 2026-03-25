import { Vowel, createDirectAdapters } from "@vowel.to/client"

let vowelInstance: Vowel | null = null
let currentPath = "/"

const pageContextMap: Record<string, string> = {
  "/": "Home page - OpenCode AI coding agent",
  "/docs": "Documentation page",
  "/download": "Download page for desktop app",
  "/zen": "OpenCode Zen page",
  "/go": "OpenCode Go quick start page",
  "/black": "OpenCode Black pricing page",
  "/bench": "Benchmark page",
  "/enterprise": "Enterprise features page",
  "/changelog": "Changelog page",
  "/brand": "Brand assets page",
}

export function getCurrentPageContext(): string {
  const basePath = "/" + currentPath.split("/").filter(Boolean)[0]
  return pageContextMap[basePath] || "OpenCode website"
}

export function notifyPageChange(path: string) {
  currentPath = path
  if (vowelInstance && vowelInstance.notifyEvent) {
    vowelInstance.notifyEvent(`Viewing: ${getCurrentPageContext()}`)
  }
}

const routes = [
  { path: "/", description: "Home page - OpenCode AI coding agent landing page" },
  { path: "/docs", description: "Documentation - learn how to use OpenCode" },
  { path: "/download", description: "Download page - get OpenCode desktop app" },
  { path: "/zen", description: "OpenCode Zen - hosted AI coding service with privacy" },
  { path: "/go", description: "OpenCode Go - quick start with one command" },
  { path: "/black", description: "OpenCode Black - premium subscription plans" },
  { path: "/bench", description: "Benchmark - compare AI coding agents performance" },
  { path: "/enterprise", description: "Enterprise - custom deployment and support" },
  { path: "/changelog", description: "Changelog - latest updates and releases" },
  { path: "/docs/getting-started", description: "Getting started guide for new users" },
  { path: "/docs/installation", description: "Installation instructions for all platforms" },
  { path: "/docs/providers", description: "Supported LLM providers - OpenAI, Anthropic, Google, etc." },
  { path: "/docs/configuration", description: "Configuration options and settings" },
  { path: "/docs/agents", description: "Built-in agents - build and plan modes" },
  { path: "/docs/share", description: "Share links for collaborative coding" },
  { path: "/docs/workspace", description: "Workspace management and team features" },
  { path: "/docs/enterprise", description: "Enterprise features and deployment" },
  { path: "/docs/web", description: "Web interface usage" },
  { path: "/brand", description: "Brand assets and logos" },
]

function createSolidJSNavigationAdapter() {
  let navigateFn: ((path: string) => void) | null = null
  let getCurrentPathFn: (() => string) | null = null

  const { navigationAdapter, automationAdapter } = createDirectAdapters({
    navigate: (path) => {
      if (navigateFn) {
        navigateFn(path)
      }
    },
    getCurrentPath: () => {
      if (getCurrentPathFn) {
        return getCurrentPathFn()
      }
      return window.location.pathname
    },
    routes,
    enableAutomation: true,
  })

  return {
    navigationAdapter,
    automationAdapter,
    setNavigate: (fn: (path: string) => void) => {
      navigateFn = fn
    },
    setGetCurrentPath: (fn: () => string) => {
      getCurrentPathFn = fn
    },
  }
}

const adapter = createSolidJSNavigationAdapter()

export function getVowel(): Vowel | null {
  return vowelInstance
}

export function initializeVowel(appId: string) {
  if (vowelInstance) return vowelInstance

  vowelInstance = new Vowel({
    appId,
    navigationAdapter: adapter.navigationAdapter,
    automationAdapter: adapter.automationAdapter,
    _caption: { enabled: true },
    voiceConfig: {
      provider: "vowel-prime",
      vowelPrimeConfig: { environment: "staging" },
      llmProvider: "groq",
      model: "openai/gpt-oss-120b",
      voice: "Timothy",
      language: "en-US",
      initialGreetingPrompt:
        "Welcome to OpenCode! I'm your voice assistant for opencode.ai - the open source AI coding agent. I can help you navigate this site, learn about features, get quick start instructions, find documentation, or answer questions about OpenCode. Just say things like 'go to docs', 'show me pricing', or 'how do I install' and I'll help you out. How can I assist you today?",
    },
  })

  vowelInstance.registerAction(
    "navigateTo",
    {
      description: "Navigate to a specific page on the website",
      parameters: {
        page: {
          type: "string",
          description: "The page path to navigate to (e.g., /docs, /download, /zen)",
        },
      },
    },
    async ({ page }) => {
      const path = page.startsWith("/") ? page : `/${page}`
      const validRoute = routes.find((r) => r.path === path || r.path === path + "/")
      if (validRoute) {
        adapter.navigationAdapter.navigate(path)
        return { success: true, message: `Navigated to ${path}` }
      }
      return { success: false, message: `Unknown page: ${page}` }
    },
  )

  vowelInstance.registerAction(
    "getOpenCodeStats",
    {
      description: "Get current stats about OpenCode project",
      parameters: {},
    },
    async () => {
      return {
        stars: "120K+",
        contributors: "800+",
        commits: "10,000+",
        monthlyUsers: "5M+",
        description: "OpenCode is an open source AI coding agent with LSP support",
      }
    },
  )

  vowelInstance.registerAction(
    "searchDocs",
    {
      description: "Search documentation",
      parameters: {
        query: { type: "string", description: "Search query" },
      },
    },
    async ({ query }) => {
      const results = routes.filter(
        (r) =>
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.path.toLowerCase().includes(query.toLowerCase()),
      )
      return {
        success: true,
        results: results.map((r) => ({ path: r.path, description: r.description })),
      }
    },
  )

  vowelInstance.registerAction(
    "openExternal",
    {
      description: "Open an external URL",
      parameters: {
        url: { type: "string", description: "URL to open" },
      },
    },
    async ({ url }) => {
      window.open(url, "_blank")
      return { success: true, message: `Opened ${url}` }
    },
  )

  vowelInstance.registerAction(
    "getFeatures",
    {
      description: "Get list of OpenCode features",
      parameters: {},
    },
    async () => {
      return {
        features: [
          "LSP support for code intelligence",
          "Multi-model support (Claude, OpenAI, Google, local models)",
          "Share links for pair programming",
          "Multiple editor support (VS Code, Neovim, etc.)",
          "Desktop and web interfaces",
          "Open source (MIT license)",
        ],
      }
    },
  )

  vowelInstance.registerAction(
    "getQuickStart",
    {
      description: "Get quick start instructions",
      parameters: {},
    },
    async () => {
      return {
        instructions: [
          "Run: curl -fsSL https://opencode.ai/install | bash",
          "Or: npm i -g opencode-ai",
          "Or: bun add -g opencode-ai",
          "Then run: opencode in your project directory",
          "Use Tab to switch between build and plan agents",
        ],
      }
    },
  )

  vowelInstance.registerAction(
    "getPricing",
    {
      description: "Get pricing information",
      parameters: {},
    },
    async () => {
      return {
        plans: [
          { name: "Free", price: "$0", features: "Basic usage, community support" },
          { name: "Pro", price: "$20/month", features: "Unlimited usage, priority support" },
          { name: "Team", price: "$40/user/month", features: "Team features, shared workspaces" },
          { name: "Enterprise", price: "Custom", features: "Self-hosted, SLA, dedicated support" },
        ],
      }
    },
  )

  vowelInstance.registerAction(
    "getSupportedProviders",
    {
      description: "Get list of supported LLM providers",
      parameters: {},
    },
    async () => {
      return {
        providers: [
          "OpenAI (GPT-4, GPT-4o, etc.)",
          "Anthropic (Claude 3.5, Claude 3, etc.)",
          "Google (Gemini)",
          "Azure OpenAI",
          "OpenRouter",
          "Ollama (local models)",
          "LM Studio (local models)",
          "Any OpenAI-compatible API",
        ],
      }
    },
  )

  vowelInstance.registerAction(
    "openDownloadPage",
    {
      description: "Navigate to the download page",
      parameters: {},
    },
    async () => {
      adapter.navigationAdapter.navigate("/download")
      return { success: true, message: "Navigated to download page" }
    },
  )

  vowelInstance.registerAction(
    "openDocs",
    {
      description: "Navigate to documentation",
      parameters: {
        topic: { type: "string", description: "Documentation topic (optional)" },
      },
    },
    async ({ topic }) => {
      const path = topic ? `/docs/${topic}` : "/docs"
      adapter.navigationAdapter.navigate(path)
      return { success: true, message: `Navigated to docs${topic ? `: ${topic}` : ""}` }
    },
  )

  return vowelInstance
}

export function setVowelNavigate(fn: (path: string) => void) {
  adapter.setNavigate(fn)
}

export function setVowelGetCurrentPath(fn: () => string) {
  adapter.setGetCurrentPath(fn)
  currentPath = fn()
}

export function isVowelReady(): boolean {
  return vowelInstance !== null
}
