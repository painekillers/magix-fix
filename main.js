import SearchIndex from './search.js'

import "./setup.js"

window.recurse = false // Actual amount of layers parsed

window.bridge.calculateLayout(
    "A",
    window.recurse
)

window.bridge.calculateDraw(
    50,     // node width
    50,     // node height
    100,    // layer spacing
    50      // node spacing
)

window.depth = null // Amount of nodes rendered

window.bridge.createObjects(window.depth)

window.search = new SearchIndex(
    Array.from(window.graph.nodes.values()).map(node => ({
        name: node.id,
        value: node
    }))
)

await import('./ui.js')