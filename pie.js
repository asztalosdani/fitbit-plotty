const COUNTERCLOCKWISE = "counterclockwise";
const CLOCKWISE = "clockwise";


function zip(rows) {
    return rows[0].map((_,c)=>rows.map(row=>row[c]))
}

export class PieTrace {
    constructor(plot, trace) {
        this.plot = plot;
        this.trace = trace
    }

    getSize() {
        let paperBBox = this.plot.paper.getBBox();
        let min = Math.min(paperBBox.width, paperBBox.height);
        return min / 2 - 20; // TODO margin
    }

    getCenter() {
        let paperBBox = this.plot.paper.getBBox();
        return {x:paperBBox.width/2, y: paperBBox.height / 2}
    }

    draw(traceIndex) {

        let direction = this.trace.direction === undefined ? COUNTERCLOCKWISE : this.trace.direction
        let clockwise = direction === CLOCKWISE
        // TODO hole https://plotly.com/javascript/reference/#pie-hole
        let rotation = this.trace.rotation === undefined ? 0 : this.trace.rotation
        let sort = this.trace.sort === undefined || this.trace.sort;


        let traceData = zip([this.trace.values, this.trace.labels])
        if (sort) {
            traceData.sort((a, b) => b[0] - a[0])
        }

        let pieMaskCircle = this.plot.paper.getElementById("piemask-circle")
        if (pieMaskCircle) {
            pieMaskCircle.r = this.getSize()
        }

        let sum = this.trace.values.reduce((a, b) => a + b);
        let startingAngle = rotation;
        if (!clockwise) {
            let value = traceData[0][0];
            let percent = value / sum;
            startingAngle = 360 * percent;
        }
        for (let i = 0; i < traceData.length; i++) {
            let value = traceData[i][0];
            let percent = value / sum;
            let angle = 360 * percent;
            console.log(`drawPie ${percent} ${angle} ${startingAngle}`)
            this._drawPie(percent, angle, startingAngle, clockwise, i)
            startingAngle += clockwise ? angle : -angle
        }

        for (let pie of this.plot.pies) {
            pie.style.display = "none";
        }
    }

    getScaleFromDegree(deg) {
        let rad = deg / 2 * Math.PI / 180;
        return Math.tan(rad);
    }

    _drawPie(percent, angle, startingAngle, clockwise, pieIndex) {
        let pie = this.plot.getPie(angle > 180)
        let pieRect = pie.getElementById("pie-rect")
        let t1 = pie.getElementById("g1").groupTransform;
        let t2 = pie.getElementById("g2").groupTransform;

        let rotateAngle = startingAngle + 180
        rotateAngle += clockwise ? angle / 2 : - angle / 2
        let size = this.getSize();
        if (angle === 180) {
            // t1.rotate.angle = startingAngle + angle / 2
            t1.scale.x = 2
            t2.translate.x = - size
            t1.rotate.angle = rotateAngle
        } else if (angle > 180) {
            t1.translate.x = - size
            t1.translate.y = - size
            t1.scale.x = 2
            t1.scale.y = 2
        } else {
            t2.rotate.angle = 45;
            t1.scale.x = this.getScaleFromDegree(angle)
            t1.rotate.angle = rotateAngle
            // t1.translate.x = pie.getBBox().width / 2
            // t1.translate.y = pie.getBBox().height / 2
        }
        pieRect.style.fill = this.plot.layout.colorway[pieIndex % this.plot.layout.colorway.length]

        const eventEmitter = this.plot.eventEmitter;
        pieRect.onclick = function (e) {
            eventEmitter.emit('plotly_click', angle);
        }

        let center = this.getCenter()
        let textAngle = rotateAngle + 90;
        let x = size * 0.7 * Math.cos(textAngle * Math.PI / 180)
        let y = size * 0.7 * Math.sin(textAngle * Math.PI / 180)
        let text = this.plot.getText()
        text.text = Math.round(percent * 100) + "%"
        text.x = center.x + x + 5 // font size adjustment
        text.y = center.y + y
        text.style.fontSize = 10
        text.layer = 4
        text.textAnchor = "middle"
        text.style.fill = "black"
    }
}