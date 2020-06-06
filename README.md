
# Fitbit-Plotty
A plotting library for Fitbit, based on the awesome [Plotly](https://plotly.com/javascript/).
> :warning: **Fitbit-Plotty is work in progress, consider it as alpha quality.** The usage may change any time! :warning:

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
Download and copy the js files and widgets.gui to your project.
More user-friendly installation coming soon.
# Usage
TODO
## Limitations
color only hex, no rgb(12, 67, 191)

# Known issues
* Pie chart has to be double tapped to emit a click event.
There is an issue with the `onclick` listener of an element that uses mask. As a result, the onclick listener is called only if it is tapped twice.

# Apps with Fitbit-Plotty
| | | |
| --- | --- | --- |
| [Covid-19 Tracker](https://gallery.fitbit.com/details/c62da0a1-381a-4861-a0da-d8e3c47663c0): by me | [![Alt text](test_image.png?raw=true "Title")](https://gallery.fitbit.com/details/c62da0a1-381a-4861-a0da-d8e3c47663c0) | Track the corona virus from your Fitbit. This app is the main reason I made this library. |
| Your project here |  | Create an issue, or a pull request to include your app here. |

# Support
Found a bug? Missing a specific feature?

Feel free to file a new issue, or if you already have a solution create a pull request. 
# Donations
You can help further development of Fitbit-Plotty by buying me a coffee. Also consider donating if you are using Fitbit-Plotty in a paid app.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z71MIWA)

# License
TODO