export default class Tooltip {
    constructor({
        offset = 8,
        duration = 120
    } = {}) {
        this.offset = offset

        this.element = document.createElement("div")
        this.element.id = "tooltip"

        this.element.style.transitionDuration =
            `${duration}ms`

        document.body.append(this.element)

        document.addEventListener("mouseover", e => {
            const target = e.target.closest("[data-tooltip]")

            if(!target) return

            this.show(
                target.dataset.tooltip,
                target
            )
        })

        document.addEventListener("mouseout", e => {
            const target = e.target.closest("[data-tooltip]")

            if(!target) return

            this.hide()
        })
    }

    show(text, target) {
        this.element.textContent = text

        const rect = target.getBoundingClientRect()

        this.element.style.left =
            rect.left + rect.width / 2 + "px"

        this.element.style.top =
            rect.top - this.offset + "px"

        this.element.classList.add("visible")
    }

    hide() {
        this.element.classList.remove("visible")
    }
}