const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const strokeFactor : number = 90
const containerSizeFactor : number = 2.9
const colors : Array<String> = new Array("#3F51B5", "#4CAF50", "#f44336", "#0D47A1", "#E65100")
const backColor : String = "#BDBDBD"
const containerColor : String = "#212121"

const sinify = (scale) => Math.sin(scale * Math.PI)

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawContainer(context : CanvasRenderingContext2D) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = containerColor
        const containerSize : number = Math.min(w, h) / containerSizeFactor
        context.save()
        context.translate(w / 2, h / 2)
        const x : number = containerSize / 2
        for (var i = 0; i < 2; i++) {
            const sf : number = 1 - 2 * i
            DrawingUtil.drawLine(context, x * sf, 0, x * sf, -containerSize)
        }
        DrawingUtil.drawLine(context, -x, 0, x, 0)
        context.restore()
    }

    static drawColorBarNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const size = Math.min(w, h) / containerSizeFactor
        context.fillStyle = colors[i]
        const sf = sinify(scale)
        context.save()
        context.translate(w / 2, h / 2)
        context.fillRect(-size / 2, -size * sf, size, size * sf)
        context.restore()
     }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    constructor() {
        this.initCanvas()
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
