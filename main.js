import Theme from "./theme.js"

await import("./setup.js")
await import('./ui.js')

Theme.subscribe(() => window.world.update())

Theme.setTheme("Default")