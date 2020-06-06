import document from "document";
import {PieTrace} from "./pie";
import {BarTrace} from "./bar";
import {EventEmitter} from "./event"

const DEFAULT_MARKER_SIZE = 6;
const DEFAULT_LINE_WIDTH = 2;

class Plot {
    constructor(id) {
        this.id = id;

        this.paper = document.getElementById(id);
        this.plot_body = this.paper.getElementById("plot-body");

        this.bars = this.paper.getElementsByTypeName("bar")
        this.lines = this.paper.getElementsByTypeName("line");
        this.circles = this.paper.getElementsByClassName("marker");
        this.texts = this.paper.getElementsByTagName("text");
        this.pies = this.paper.getElementsByTypeName("pie")

        this.eventEmitter = new EventEmitter()
        const eventEmitter = this.eventEmitter;
        this.paper.on = function (eventName, listener) {
            eventEmitter.on(eventName, listener)
        };

    }

    getPie(fromBottom = false) {
        let pie = fromBottom ? this.pies.shift() : this.pies.pop();
        if (pie === undefined) throw "Not enough pies defined for this pie chart."
        return pie
    }

    getText() {
        let text = this.texts.pop();
        if (text === undefined) throw "Not enough text elements for axes."
        return text
    }

    drawTrace(trace, index) {
        switch (trace.type) {
            case 'bar':
                let barTrace = new BarTrace(this, trace)
                barTrace.draw(index)
                break;
            case 'pie':
                let pieTrace = new PieTrace(this, trace)
                pieTrace.draw(index)
                break;
            case 'scatter':
            default:
                this.drawScatter(trace, index);
                break;
        }
    }

    drawYAxis() {
        let [tickvals, ticktexts] = this.getTicks('y')
        let layoutAxis = this.layout[this.toLayoutAttributeName('y')];
        let defaultColor = layoutAxis.color;
        let fontFamily = layoutAxis.tickfont.family;
        let fontSize = layoutAxis.tickfont.size;
        let fontColor = layoutAxis.tickfont.color;

        let [min, max] = this.getRange('x');
        let x1 = this.toPlotXCoordinate(min)
        let x2 = this.toPlotXCoordinate(max)


        for (let i = 0; i < tickvals.length; i++) {
            let tickval = tickvals[i];
            let ticktext = ticktexts[i];

            let y = this.toPlotYCoordinate(tickval);

            let line = this.lines.pop();
            line.x1 = x1;
            line.y1 = y;
            line.x2 = x2;
            line.y2 = y;
            line.style.fill = defaultColor;

            let text = this.getText()
            text.x = x1;
            text.y = y + fontSize / 2;
            text.text = ticktext;
            text.style.fontSize = fontSize
            text.style.fill = fontColor;
            text.style.fontFamily  = fontFamily;
            text.textAnchor = "end"
        }
    }

    drawXAxis() {
        let [tickvals, ticktexts] = this.getTicks('x')
        let layoutAxis = this.layout[this.toLayoutAttributeName('x')];
        let defaultColor = layoutAxis.color;
        let fontFamily = layoutAxis.tickfont.family;
        let fontSize = layoutAxis.tickfont.size;
        let fontColor = layoutAxis.tickfont.color;

        let [min, max] = this.getRange('y');
        let y1 = this.toPlotYCoordinate(min)
        let y2 = this.toPlotYCoordinate(max)

        for (let i = 0; i < tickvals.length; i++) {
            let tickval = tickvals[i];
            let ticktext = ticktexts[i];

            let x = this.toPlotXCoordinate(tickval);

            let line = this.lines.pop();
            line.x1 = x;
            line.y1 = y1;
            line.x2 = x;
            line.y2 = y2;
            line.style.fill = defaultColor;

            let text = this.getText();
            text.x = x;
            text.y = y1 + 10 + fontSize / 2;
            text.text = ticktext;
            text.style.fontSize = fontSize;
            text.style.fill = fontColor;
            text.style.fontFamily  = fontFamily;
            text.textAnchor = "middle";
        }
    }

    hideExcessiveBars() {
        for (let bar of this.bars) {
            bar.style.display = 'none';
        }
    }

    hideExcessiveMarkers() {
        for (let circle of this.circles) {
            circle.style.display = 'none';
        }
    }

    draw(data, layout) {
        this.data = data
        this.layout = layout
        this.preprocessLayout()

        this.setupPaperAndPlot()

        this.drawYAxis()
        this.drawXAxis()

        for (let i = 0; i < data.length; i++) {
            let trace = data[i];
            this.drawTrace(trace, i);
        }

        this.hideExcessiveBars()
        this.hideExcessiveMarkers()
    }

    setupPaperAndPlot() {
        this.plot_body.x = this.layout.margin.l;
        this.plot_body.y = this.layout.margin.t;
        this.plot_body.width = this.paper.getBBox().width - (this.layout.margin.l + this.layout.margin.r);
        this.plot_body.height = this.paper.getBBox().height - (this.layout.margin.t + this.layout.margin.b);

        this.plot_height = this.plot_body.height;
        this.plot_width = this.plot_body.width;

        this.paper.getElementById("paperRect").style.fill = this.layout.paper_bgcolor
        this.plot_body.getElementById("plotRect").style.fill = this.layout.plot_bgcolor
    }

    drawScatter(trace, index) {
        console.log(JSON.stringify(trace))
        let traceColor = trace.color || this.layout.colorway[index % this.layout.colorway.length]
        let mode = trace.mode || "lines+markers";
        const drawMarkers = mode.indexOf("markers") !== -1;
        const drawLines = mode.indexOf("lines") !== -1;

        let x1 = this.toPlotXCoordinate(trace.x[0]);
        let y1 = this.toPlotYCoordinate(trace.y[0]);

        for (let i = 1; i < trace.x.length; i++) {
            let x2 = this.toPlotXCoordinate(trace.x[i]);
            let y2 = this.toPlotYCoordinate(trace.y[i]);

            if (drawLines) {
                let line = this.lines.pop();

                line.x1 = x1;
                line.y1 = y1;
                line.x2 = x2;
                line.y2 = y2;
                line.style.strokeWidth = (trace.line !== undefined && trace.line.width !== undefined) ? trace.line.width : 1;
                line.style.fill = (trace.line !== undefined && trace.line.color !== undefined) ? trace.line.color : traceColor;
            }
            if (drawMarkers) {
                this.drawMarker(x1, y1, trace, traceColor);
            }

            x1 = x2;
            y1 = y2;
        }

        // draw last marker
        if (drawMarkers) {
            this.drawMarker(x1, y1, trace, traceColor);
        }
    }

    drawMarker(x1, y1, trace, traceColor) {
        let circle = this.circles.pop();
        if (circle === undefined) throw "Not enough circles defined for markers."
        const color = (trace.marker !== undefined && trace.marker.color !== undefined) ? trace.marker.color : traceColor;

        let size = (trace.marker !== undefined && trace.marker.size !== undefined) ? trace.marker.size : DEFAULT_MARKER_SIZE;
        console.log(`drawMarker ${x1} ${y1} ${color}`)

        circle.cx = x1;
        circle.cy = y1;
        circle.r = size / 2;
        circle.style.fill = color;

        const eventEmitter = this.eventEmitter;
        circle.onclick = function () {
            eventEmitter.emit('plotly_click', x1, y1);
        }
    }

    toPlotXCoordinate(x) {
        return this.toPlotXUnit(x) + this.layout.margin.l;
    }

    toPlotXUnit(x) {
        let [min, max] = this.getRange('x')
        return this.plot_width / (max - min) * (x - min);
    }

    toPlotYCoordinate(y) {
        return this.toPlotYUnit(y) + this.layout.margin.t;
    }

    toPlotYUnit(y) {
        let [min, max] = this.getRange('y')
        return this.plot_height / (max - min) * (max - y);
    }

    getRange(axis) {
        let axisAttributeName = this.toLayoutAttributeName(axis)
        return this.layout[axisAttributeName].range
    }

    preprocessLayout() {
        if (!this.layout.margin) this.layout.margin = {}
        if (!this.layout.margin.l) this.layout.margin.l = 20
        if (!this.layout.margin.r) this.layout.margin.r = 20
        if (!this.layout.margin.t) this.layout.margin.t = 20
        if (!this.layout.margin.b) this.layout.margin.b = 20
        if (!this.layout.margin.pad) this.layout.margin.pad = 0

        if (!this.layout.paper_bgcolor) this.layout.paper_bgcolor = "#fff";
        if (!this.layout.plot_bgcolor) this.layout.plot_bgcolor = "#fff";

        if (!this.layout.colorway) this.layout.colorway = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

        this.preprocessAxisLayout('x');
        this.preprocessAxisLayout('y');

        console.log(JSON.stringify(this.layout))
    }

    preprocessAxisLayout(axis) {
        let axisAttributeName = this.toLayoutAttributeName(axis);
        if (!this.layout[axisAttributeName]) this.layout[axisAttributeName] = {};
        // if (!this.layout[axisAttributeName].visible) this.layout[axisAttributeName].visible =;
        if (!this.layout[axisAttributeName].color) this.layout[axisAttributeName].color = "#444";
        if (!this.layout[axisAttributeName].type) this.layout[axisAttributeName].type = this.guessLayoutAxisType(axis);
        if (!this.layout[axisAttributeName].autorange) this.layout[axisAttributeName].autorange = (this.layout[axisAttributeName].range === undefined);
        if (!this.layout[axisAttributeName].rangemode) this.layout[axisAttributeName].rangemode = "tozero"; // normal/tozero
        if (!this.layout[axisAttributeName].range) this.layout[axisAttributeName].range = this.getRangeFromData(axis);
        if (!this.layout[axisAttributeName].tickmode) this.layout[axisAttributeName].tickmode = this.guessTickMode(axis)
        if (!this.layout[axisAttributeName].nticks) this.layout[axisAttributeName].nticks = 5;
        if (!this.layout[axisAttributeName].tickfont) this.layout[axisAttributeName].tickfont = {};
        if (!this.layout[axisAttributeName].tickfont.family) this.layout[axisAttributeName].tickfont.family = "System-Regular";
        if (!this.layout[axisAttributeName].tickfont.size) this.layout[axisAttributeName].tickfont.size = 20;
        if (!this.layout[axisAttributeName].tickfont.color) this.layout[axisAttributeName].tickfont.color = this.layout[axisAttributeName].color;

        // if (this.layout[axisAttributeName].tickvals)
    }

    guessLayoutAxisType(axis) {
        // let axisAttributeName = this.toLayoutAttributeName(axis);
        try {
            if (this.data.every(trace => trace[axis].some(value => isNaN(value)))) {
                return "category"
            }
        } catch (e) {
        }
        return "-"
    }

    guessTickMode(axis) {
        let axisAttributeName = this.toLayoutAttributeName(axis);
        if (axis === 'x' && this.data.some(trace => trace.type === 'bar')) {
            return "array"
        }
        return (this.layout[axisAttributeName].tickvals !== undefined) ? "array" : "auto";  // TODO linear default
    }

    toLayoutAttributeName(axis) {
        return axis + 'axis';
    }

    getRangeFromData(axis) {
        let axisAttributeName = this.toLayoutAttributeName(axis);

        let min = Number.MAX_VALUE;
        let max = 0;
        switch (this.layout[axisAttributeName].type) {
            case "category":
                min = - 0.5;
                max = this.data[0][axis].length - 0.5;
                break;
            case "linear":
            default:
                for (let trace of this.data) {
                    min = Math.min(min, ...trace[axis]);
                    max = Math.max(max, ...trace[axis]);
                }
                if (this.layout[axisAttributeName].rangemode === "tozero") {
                    min = Math.min(0, min);
                }
                break;
        }
        return [min, max];
    }

    getTicks(axis) {
        let axisAttributeName = this.toLayoutAttributeName(axis);

        let [min, max] = this.getRange(axis)
        let stepGuess = (max - min) / this.layout[axisAttributeName].nticks
        let step = Math.round(stepGuess / 1) * 1; // TODO auto scaling step

        let ticks = []
        for (let i = Math.round(min / step) * step; i < max; i += step) {
            ticks.push(i)
        }

        switch (this.layout[axisAttributeName].tickmode) {
            case "auto":

                console.log("ticks", min, max, stepGuess, step, ticks)
                return [ticks, ticks]
            case "linear":
                // TODO
                return [[], []]
            case "array":
                let tickvals = (this.layout[axisAttributeName].tickvals !== undefined) ? this.layout[axisAttributeName].tickvals : ticks
                const ticktext = (this.layout[axisAttributeName].ticktext !== undefined) ? this.layout[axisAttributeName].ticktext : this.data[0][axis];
                return [tickvals, ticktext]
        }
    }
}

export function newPlot(id, data, layout = {}) {
    let plot = new Plot(id);

    plot.draw(data, layout)
}