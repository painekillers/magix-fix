const loadTheme = async path => (await import(path)).default

const merge = (base, theme) => {
    const result = {...base}

    for (const [key, value] of Object.entries(theme)) {
        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            value.constructor === Object &&
            base[key]?.constructor === Object
        ) {
            result[key] = merge(base[key], value)
        } else {
            result[key] = value
        }
    }

    return result
}

const defaultTheme = await loadTheme("./themes/default.js")

const themes = {
    Default: defaultTheme
}

const load = async (name, path) => {
    themes[name] = merge(
        defaultTheme,
        await loadTheme(path)
    )
}

// Load themes here

await load("Dark", "./themes/dark.js")

let subscription = []

window.theme = defaultTheme

const css = document.getElementById("theme-css")

const applyCSS = async name => {
    const path = `./themes/${name}.css`

    try {
        const response = await fetch(path, {
            method: "HEAD"
        })

        if (!response.ok) {
            throw new Error()
        }

        css.href = path
    } catch {
        css.href = "./themes/default.css"
    }
}

export default {
    load,

    get themes() {
        return themes
    },

    get current() {
        return window.theme
    },

    async setTheme(name) {
        if (!(name in themes)) {
            console.warn(`Could not find theme with name ${name}`)
            return
        }
        
        window.theme = themes[name]
        
        // Yeah its weird we only load the CSS lowercase 
        // Tbh I dont like loading the CSS differently to the js, might change this later
        name = name.toLowerCase()
        await applyCSS(name)

        for (const func of subscription) {
            func()
        }

        if (window.world) {
            window.world.background = window.theme.background
        }
    },

    subscribe(func) {
        subscription.push(func)
    }
}