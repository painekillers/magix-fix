import World from "./world/world.js"
import Camera from "./world/camera.js"
import SearchIndex from './search.js'

import {
    Node,
    Graph
} from "./graph.js"

import Bridge from "./world/bridge.js"

import nodes from "./nodes.js"

const canvas = document.querySelector("#canvas")

// Create world
const world = new World(canvas, window.theme)

const cam = new Camera(world)

world.camera = cam

window.cam = cam
window.world = world

world.resize(
    window.innerWidth,
    window.innerHeight
)

window.addEventListener("resize", () => {
    world.resize(
        window.innerWidth,
        window.innerHeight
    )
})

// Interaction

let hovered = null

canvas.addEventListener("mousemove", e => {
    if (world.paused) return

    const pos = world.mouseWorldPosition(e)
    const object = world.objectAt(pos.x, pos.y)

    if (object === hovered) return

    hovered?.mouseLeave?.()

    hovered = object

    hovered?.mouseEnter?.()
})

canvas.addEventListener("mousedown", e => {
    if (world.paused) return

    const pos = world.mouseWorldPosition(e)
    const object = world.objectAt(pos.x, pos.y)

    if(object) {
        console.log("clicked node:", object.node.val)

        if(object.drawNode.layoutNode.original === null) {
            window.nodeMenu(object.node)
        } else {
            bridge.focus(object.drawNode.layoutNode.original.node)
        }
    }
})


// Create graph
const graph = new Graph(nodes)

const bridge = new Bridge(
    graph,
    world
)

window.graph = graph
window.bridge = bridge

// Deal with Camera

let dragging = false

let lastX = 0
let lastY = 0


// Pan

canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return

    dragging = true

    lastX = e.clientX
    lastY = e.clientY
})


canvas.addEventListener("mouseup", () => {
    dragging = false
})


canvas.addEventListener("mouseleave", () => {
    dragging = false
})


canvas.addEventListener("mousemove", e => {
    if (!dragging) return

    const dx = e.clientX - lastX
    const dy = e.clientY - lastY

    lastX = e.clientX
    lastY = e.clientY

    const pos = cam.pos

    cam.pos = [
        pos.x - dx / cam.zoom,
        pos.y - dy / cam.zoom
    ]
})


// Zoom toward mouse

canvas.addEventListener("wheel", e => {
    e.preventDefault()

    const rect = canvas.getBoundingClientRect()

    const mouseX =
        e.clientX - rect.left - canvas.width / 2

    const mouseY =
        e.clientY - rect.top - canvas.height / 2

    const oldZoom = cam.zoom

    const pos = cam.pos

    // World position currently underneath mouse
    const worldX = pos.x + mouseX / oldZoom
    const worldY = pos.y + mouseY / oldZoom

    const zoomSpeed = 0.001

    let newZoom =
        oldZoom * (1 - e.deltaY * zoomSpeed)

    newZoom = Math.max(
        0.1,
        Math.min(newZoom, 5)
    )

    cam.zoom = newZoom

    // Keep the same world point underneath the mouse
    cam.pos = [
        worldX - mouseX / newZoom,
        worldY - mouseY / newZoom
    ]
}, { passive: false })

window.recurse = true // Actual amount of layers parsed

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