export class BarTrace {
    constructor(plot, trace) {
        this.plot = plot;
        this.trace = trace
    }

    draw(traceIndex) {
        let defaultColor = this.plot.layout.colorway[traceIndex % this.plot.layout.colorway.length]

        let bar_count = this.trace.x.length;
        let padding = 5
        let defaultWidth = this.plot.plot_width / bar_count - 2 * padding

        for (let i = 0; i < bar_count; i++) {
            let bar = this.plot.bars.pop();
            const value = this.trace.y[i];
            let position = this.trace.x[i];
            if (isNaN(position)) {
                position = i;
            }

            let y = this.plot.toPlotYCoordinate(value);
            let height = this.plot.toPlotYCoordinate(0) - y;
            let x = this.plot.toPlotXCoordinate(position);
            let width = this.trace.width ? this.plot.toPlotXUnit(this.trace.width[i]) : defaultWidth

            bar.x = x - width / 2;
            bar.y = y;
            bar.height = height;
            bar.width = width;

            let color = this.trace.marker !== undefined && this.trace.marker.color !== undefined ? this.trace.marker.color[i] : defaultColor;
            bar.style.fill = color;

            const eventEmitter = this.plot.eventEmitter;
            bar.onclick = function () {
                eventEmitter.emit('plotly_click', value);
            }
        }
    }
}