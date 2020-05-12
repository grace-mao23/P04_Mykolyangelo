// Data variable
let raw_data, data = [];

// SVG constants
const chartWidth = 650, chartHeight = 500;
const margin = [50, 30, 55, 100];
let startYear, endYear, years, values, index = 0;
let chartSvg, group, rect;
let x, y;

// Animation constant
let chartAnimation, startDrawing = false;
let graphLastTimed = d3.now();
function startChartAnimation() {
  startDrawing = true;
}

// SVG axis functions
let xAxis, yAxis;

// Load Data
const chartLoadData = (callback) => {
  const query = `
  {
    allCo2Emissions {
      country {
        countryName
      }
      year
      amount
    }
  }
  `;
  d3.json('/graphql', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query })
  })
    .then(({ data: { allCo2Emissions } }) => callback(allCo2Emissions));
};


chartLoadData(function (allCo2Emissions) {
  raw_data = allCo2Emissions;

  startYear = d3.min(raw_data, d => d.year);
  endYear = d3.max(raw_data, d => d.year);

  // Please optimize years and values
  years = (new Array(endYear - startYear + 1).fill(startYear - 1))
    .map((year, acc) => Date.parse(`${year + (acc += 1)}`));
  values = years.map(yearA =>
    raw_data.filter(({ year }) => yearA === Date.parse(year))
      .map(({ amount }) => amount)
      .reduce((cur, acc) => acc += cur)
  );

  years.forEach((ele, index) => {
    data.push({ date: ele, value: values[index] })
  });

  x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin[3], chartWidth - margin[1]]);
  y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([chartHeight - margin[2], margin[0]]);

  var svg = d3.select("#world-graph")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  var yAxis = g => g
    .attr("transform", `translate(${margin[3]},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  var xAxis = g => g
    .attr("transform", `translate(0,${chartHeight - margin[2]})`)
    .call(d3.axisBottom(x).ticks(chartWidth / 60).tickSizeOuter(0))

  var line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value))

  svg.append("g")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-60)")
    .attr("font-size", "xx-smaller");;

  svg.append("g")
    .call(yAxis);

  svg.append("text")
    .attr("transform",
          "translate(" + (30) + " ," +
                         (height/2 - 150) + "), rotate(-90)")
    .style("text-anchor", "start")
    .style("font", "14px times")
    .text("Emissions (kilotons)");

  svg.append("text")
    .attr("transform",
          "translate(" + (width/2 - 400) + " ," +
                         (height - 390) + ")")
    .style("text-anchor", "start")
    .style("font", "14px times")
    .text("Year");

  d3.select("#world-stats")
    .on("mouseover", startChartAnimation);

  chartAnimation = d3.timer(function (elasped) {
    let now = d3.now();
    if (startDrawing === false) return;
    if (index >= years.length) {
      chartAnimation.stop()
    } else if ((now - graphLastTimed) < elasped) {
      svg.append("path")
        .datum(data.slice(0, index++))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("d", line);
    }
    graphLastTimed = now;
  })
});
