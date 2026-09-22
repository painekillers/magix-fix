export default {
    background: Object.assign(new Image(),
        {src: "data:image/svg+xml," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
                <defs>
                    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#202124"/>
                        <stop offset="100%" stop-color="#151618"/>
                    </linearGradient>

                    <radialGradient id="light" cx="50%" cy="42%" r="65%">
                        <stop offset="0%" stop-color="#3a3c40" stop-opacity="0.8"/>
                        <stop offset="60%" stop-color="#282a2e" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#202124" stop-opacity="0"/>
                    </radialGradient>

                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#858990"
                            stroke-width="1"
                            opacity="0.18"
                        />
                    </pattern>

                    <radialGradient id="fade" cx="50%" cy="50%" r="70%">
                        <stop offset="60%" stop-color="#202124" stop-opacity="0"/>
                        <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
                    </radialGradient>
                </defs>

                <rect width="1920" height="1080" fill="url(#base)"/>
                <rect width="1920" height="1080" fill="url(#light)"/>
                <rect width="1920" height="1080" fill="url(#grid)"/>
                <rect width="1920" height="1080" fill="url(#fade)"/>
            </svg>
        `)}
    ),

    draw: {
        line(ctx, object) {
            ctx.save()

            ctx.lineCap = "round"

            ctx.shadowColor = "rgba(0, 0, 0, 0.35)"
            ctx.shadowBlur = 4
            ctx.shadowOffsetY = 1

            ctx.beginPath()

            ctx.moveTo(
                object.from.x,
                object.from.y
            )

            ctx.lineTo(
                object.to.x,
                object.to.y
            )

            ctx.lineWidth = object.width
            ctx.strokeStyle = "#666"
            ctx.stroke()

            ctx.restore()
        },

        node(ctx, object) {
            const pos = object.pos
            const size = object.size

            const width = size.width * object.scale
            const height = size.height * object.scale

            const x = pos.x - width / 2
            const y = pos.y - height / 2

            const radius = 10

            ctx.save()

            ctx.shadowColor = "rgba(0, 0, 0, 0.45)"
            ctx.shadowBlur = object.hovered ? 16 : 8
            ctx.shadowOffsetY = object.hovered ? 4 : 2

            ctx.fillStyle = "#252525"

            ctx.beginPath()
            ctx.roundRect(x, y, width, height, radius)
            ctx.fill()

            ctx.shadowColor = "transparent"

            ctx.save()

            ctx.beginPath()
            ctx.roundRect(x, y, width, height, radius)
            ctx.clip()

            ctx.globalAlpha = object.hovered ? 1 : 0.92

            ctx.drawImage(
                object.image,
                x,
                y,
                width,
                height
            )

            ctx.restore()

            ctx.beginPath()
            ctx.roundRect(x, y, width, height, radius)

            ctx.lineWidth = 1
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"
            ctx.stroke()

            if(object.root) {
                ctx.beginPath()
                ctx.arc(
                    x + width - 9,
                    y + 9,
                    3,
                    0,
                    Math.PI * 2
                )

                ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
                ctx.fill()
            }

            ctx.restore()
        }
    }
}