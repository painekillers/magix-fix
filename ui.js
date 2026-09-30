import Theme from "./theme.js"

import Tooltip from "./tooltip.js"

import World from "./world/world.js"
import Camera from "./world/camera.js"

import {
    Node,
    Graph
} from "./graph.js"

import Bridge from "./world/bridge.js"

new Tooltip({
    offset: 12,
    duration: 120
})

const searchButton = document.querySelector("#search-button")
const searchMenu = document.querySelector("#search-menu")
const searchInput = document.querySelector("#search-input")
const searchResults = document.querySelector("#search-results")
const searchMenuClose = document.querySelector("#search-menu-close")

const themeButton = document.querySelector("#theme-button")
const themeMenu = document.querySelector("#theme-menu")
const themeGrid = document.querySelector("#theme-grid")
const themeMenuClose = document.querySelector("#theme-menu-close")

const nodeMenu = document.querySelector("#node-menu")
const nodeMenuTitle = document.querySelector("#node-menu-title")
const nodeMenuContent = document.querySelector("#node-menu-content")
const nodeMenuClose = document.querySelector("#node-menu-close")

const menus = [
    searchMenu,
    themeMenu,
    nodeMenu
]

function closeMenus() {
    for(const menu of menus) {
        menu.style.display = "none"
    }
}

function openMenu(menu) {
    closeMenus()
    menu.style.display = "block"
}

searchButton.dataset.tooltip = "Search"
themeButton.dataset.tooltip = "Theme"

searchButton.innerHTML = window.theme.searchButton
themeButton.innerHTML = window.theme.themeButton

searchButton.addEventListener("click", () => {
    if(searchMenu.style.display === "block") {
        searchMenu.style.display = "none"
    } else {
        openMenu(searchMenu)
    }
})

themeButton.addEventListener("click", () => {
    if(themeMenu.style.display === "block") {
        themeMenu.style.display = "none"
    } else {
        openMenu(themeMenu)
    }
})

searchMenuClose.addEventListener("click", () => {
    searchMenu.style.display = "none"
})

themeMenuClose.addEventListener("click", () => {
    themeMenu.style.display = "none"
})

nodeMenuClose.addEventListener("click", () => {
    nodeMenu.style.display = "none"
})

const blank = new Image()
blank.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="

const previewGraph = new Graph([
    new Node("A", [], ["B", "C"], {icon: blank}),
    new Node("B", ["A"], [], {icon: blank}),
    new Node("C", ["A"], [], {icon: blank})
])

function updateThemeMenu() {
    themeGrid.replaceChildren()

    const hidden = getComputedStyle(themeMenu).display === "none"

    if(hidden) {
        themeMenu.style.visibility = "hidden"
        themeMenu.style.display = "block"
    }

    for(const [name, theme] of Object.entries(Theme.themes)) {
        const entry = document.createElement("button")
        entry.className = "theme-entry"

        const preview = document.createElement("canvas")
        preview.className = "theme-preview"

        const label = document.createElement("div")
        label.className = "theme-name"
        label.textContent = name

        entry.append(preview, label)
        themeGrid.append(entry)

        const rect = preview.getBoundingClientRect()

        preview.width = rect.width
        preview.height = rect.height

        const world = new World(preview, theme)
        world.background = theme.background

        const camera = new Camera(world)

        world.camera = camera

        world.resize(
            preview.width,
            preview.height
        )

        const bridge = new Bridge(
            previewGraph,
            world
        )

        bridge.calculateLayout(
            "A",
            false
        )

        bridge.calculateDraw(
            50,
            50,
            70,
            50
        )

        bridge.createObjects(null)

        camera.zoom = 0.4
        camera.pos = [-40, 40]

        world.update()

        if(theme === Theme.current) {
            entry.classList.add("selected")
        }

        entry.addEventListener("click", async () => {
            await Theme.setTheme(name)
            themeMenu.style.display = "none"
        })
    }

    if(hidden) {
        themeMenu.style.display = "none"
        themeMenu.style.visibility = ""
    }
}

function updateThemeButtons() {
    searchButton.innerHTML = window.theme.searchButton
    themeButton.innerHTML = window.theme.themeButton
}

function updateSearchResults() {
    const query = searchInput.value

    const results = query
        ? window.search.search(query)
        : window.search.entries.map(entry => ({
            entry,
            score: 1
        }))

    searchResults.replaceChildren()

    for(const result of results) {
        const entry = document.createElement("div")
        entry.className = "search-entry"

        const info = document.createElement("div")

        const name = document.createElement("div")
        name.className = "search-entry-name"
        name.textContent = result.entry.name

        info.append(name)

        if(result.entry.name !== result.entry.value.id) {
            const alias = document.createElement("div")
            alias.className = "search-entry-alias"
            alias.textContent = `(alias of ${result.entry.value.id})`

            info.append(alias)
        }

        const actions = document.createElement("div")
        actions.className = "search-entry-actions"

        const focus = document.createElement("button")
        focus.dataset.tooltip = "Focus"
        focus.innerHTML = window.theme.focusButton

        if(!window.bridge.toObj?.has(result.entry.value)) {
            focus.disabled = true
        }

        focus.addEventListener("click", () => {
            window.bridge.focus(result.entry.value)
            searchMenu.style.display = "none"
        })

        const root = document.createElement("button")
        root.dataset.tooltip = "Set root"
        root.innerHTML = window.theme.rootButton

        root.addEventListener("click", () => {
            window.bridge.calculateLayout(
                result.entry.value.id,
                window.recurse
            )

            window.bridge.calculateDraw(
                50,
                50,
                100,
                50
            )

            window.bridge.createObjects(window.depth)

            searchMenu.style.display = "none"

            updateSearchResults()
        })

        actions.append(focus, root)
        entry.append(info, actions)
        searchResults.append(entry)
    }
}

window.nodeMenu = node => {
    nodeMenuTitle.textContent = node.id
    nodeMenuContent.replaceChildren()

    openMenu(nodeMenu)
}

Theme.subscribe(updateSearchResults)
Theme.subscribe(updateThemeMenu)
Theme.subscribe(updateThemeButtons)

searchInput.addEventListener("input", updateSearchResults)

updateThemeButtons()
updateThemeMenu()
updateSearchResults()