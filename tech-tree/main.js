import Theme from "./theme.js"

await import("./setup.js")
await import("./ui.js")

Theme.subscribe(() => window.world.update())

await Theme.setTheme("Default")