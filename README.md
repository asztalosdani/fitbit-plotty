
# Fitbit-Plotty
A plotting library for Fitbit, based on [Plotly](https://plotly.com/javascript/).
> :warning: **Fitbit-Plotty is work in progress, consiter it as alpha quality.** The usage may change any time!

# Features
* 100% Compatibility with [Plotly](https://plotly.com/javascript/) API (soon)
* Supported plot types
  * Scatter plot
  * Bar chart
  * Pie chart
# Quickstart
1\. Import the gui in your `widgets.gui`
```xml
<link rel="import" href="/fitbit_plotly.gui"/>
```
2\. Setup the chart and add enough elements in your `index.gui`.
```xml
<svg>
    <use id="myDiv" href="#chart" x="0" y="0" width="100%" height="200">
        <use href="#line"/>
        <use href="#line"/>
        <use href="#line"/>
        <use href="#line"/>
        <use href="#line"/>

        <use href="#bar"/>
        <use href="#bar"/>
        <use href="#bar"/>

        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
        <text text-length="16"/>
    </use>
</svg>
```
3\. Setup the plot in your javascript code.
```javascript
import * as Plotly from "./fitbit-plotly"

var data = [
  {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    type: 'bar'
  }
];

Plotly.newPlot('myDiv', data);
```
4\. Enjoy :)

![Alt text](test_image.png?raw=true "Title")
# Installation

# API
## Limitations
color only hex, no rgb(12, 67, 191)

# Known issues
* Pie chart has to be double tapped to emit a click event.
There is an issue with the `onclick` listener of an element that uses mask.

# Apps with Fitbit-Plotty
| | |
| ------------ | ------------- |
| Covid-19 Tracker | ![Alt text](test_image.png?raw=true "Title") |
|  |  |
* Covid-19 Tracker: by me.
the main reason I made this library 
* Your project here: create an issue, or a pull request.

# Support
Found a bug? Missing a specific feature?

Feel free to file a new issue, or if you already have a solution create a pull request. 
# Coffee
