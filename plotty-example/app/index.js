import * as Plotly from "../../fitbit-plotly"
import document from "document";

// console.log("start")
// let t = document.getElementById("test");
// t.onclick = function (e) {
//     console.log("huh");
// };

var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'scatter'
};

var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter'
};

var data = [trace1, trace2];

// Plotly.newPlot('myDiv', data);


var data = [{
    values: [19, 26, 55],
    labels: ['Residential', 'Non-Residential', 'Utility'],
    type: 'pie',
    direction: "clockwise",
    rotation: 0,
    sort: false
}];

var layout = {
    height: 400,
    width: 500
};

// Plotly.newPlot('myDiv', data, layout);

var trace0 = {
    type: 'bar',
    x: [1, 2, 3, 5.5, 10],
    y: [10, 8, 6, 4, 2],
    // width: [0.8, 0.8, 0.8, 3.5, 4]
}

var data = [trace0]

var layout = {
    barmode: 'stack',
    paper_bgcolor: 'beige',
    margin: {
        l: 30,
        r: 10,
        b: 20,
        t: 30,
        pad: 30
    }
};

// Plotly.newPlot('myDiv', data, layout);

var data = [
    {
        x: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        y: [20, 14, 23, 12, 10, 30, 40],
        type: 'bar'
    }
];

var layout = {
    paper_bgcolor: 'beige',
    plot_bgcolor: 'lavender',
}


Plotly.newPlot('myDiv', data, layout);

let myPlot = document.getElementById('myDiv')
myPlot.on('plotly_click', function(data){
    console.log("huh", data);
});

function test() {
    var data = [
        {
            x: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            y: [10, 20, 23, 42, 10, 24, 13],
            type: 'bar',
        }
    ];

    var layout = {
        paper_bgcolor: 'beige',
        plot_bgcolor: 'lavender',
    }


    Plotly.newPlot('myDiv', data, layout);
}

// setTimeout(test, 5000)