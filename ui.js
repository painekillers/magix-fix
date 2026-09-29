import Theme from "./theme.js"

import Tooltip from "./tooltip.js"

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

function updateThemeMenu() {
    themeGrid.replaceChildren()

    for(const [name, theme] of Object.entries(Theme.themes)) {
        const entry = document.createElement("button")
        entry.className = "theme-entry"

        const preview = document.createElement("div")
        preview.className = "theme-preview"

        const label = document.createElement("div")
        label.className = "theme-name"
        label.textContent = name

        if(theme === Theme.current) {
            entry.classList.add("selected")
        }

        entry.append(preview, label)

        entry.addEventListener("click", async () => {
            await Theme.setTheme(name)
            themeMenu.style.display = "none"
        })

        themeGrid.append(entry)
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