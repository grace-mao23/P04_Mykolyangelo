var title = document.getElementById('title');
var transitionbtn = document.getElementById('transition');
var count = 0;

const carbonData = original['co2EmissionByCode'];
title.innerHTML = "CO2 Emissions";
var i = 0;
var data = {};
data["year"] = [];
data["amount"] = [];
for (; i < carbonData.length; i++) {
  data['year'].push(carbonData[i]['year']);
  data['amount'].push(carbonData[i]['amount']);
};

var list = [];
for (var i = 0; i < data['year'].length; i++) {
  list.push({ x: Date.parse(data['year'][i]), y: data['amount'][i] })
}
console.log(list);

for (var i = 0; i < list.length; i++) {
  //console.log(list[i]['x'])
  //console.log(list[i]['y'])
}

// D3 Chart

var margin = { top: 30, right: 30, bottom: 30, left: 150 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(150)")
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

console.log(d3.extent(data, d => d))

var x = d3.scaleUtc()
  .domain(d3.extent(list, d => d.x))
  .range([0, width]);

xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0));

var y = d3.scaleLinear()
  .domain([0, d3.max(data['amount']) + (0.1 * d3.max(data['amount']))])
  .range([height, 0]);

yAxis = svg.append("g")
  .call(d3.axisLeft(y));

var clip = svg.append("defs").append("svg:clipPath")
  .attr("id", "clip")
  .append("svg:rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0);

var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
  .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

var line = svg.append('g')
  .attr("clip-path", "url(#clip)")

line.append("path")
  .datum(list)
  .attr("class", "line")  // I add the class line to be able to modify this line later on.
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 2.0)
  .attr("d", d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y)));

line
  .append("g")
  .attr("class", "brush")
  .call(brush);

svg.append("text")
  .attr("transform",
    "translate(" + (width - 345) + " ," +
    (height + 30) + ")")
  .style("font", "14px times")
  .style("text-anchor", "middle")
  .text("Year");

svg.append("text")
  .attr("transform",
    "translate(" + (width - 800) + " ," +
    (height - 200) + ")")
  .style("font", "14px times")
  .style("text-anchor", "middle")
  .text("Emissions (kilotons)");
var idleTimeout
function idled() { idleTimeout = null; }

function updateChart() {

  // What are the selected boundaries?
  extent = d3.event.selection

  // If no selection, back to initial coordinate. Otherwise, update X axis domain
  if (!extent) {
    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    x.domain([4, 8])
  } else {
    x.domain([x.invert(extent[0]), x.invert(extent[1])])
    line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  }

  xAxis.transition().duration(1000).call(d3.axisBottom(x))
  line
    .select('.line')
    .transition()
    .duration(1000)
    .attr("d", d3.line()
      .x(function (d) { return x(d.x); })
      .y(function (d) { return y(d.y); }))
}

svg.on("dblclick", function () {
  x.domain([d3.min(data['year']), d3.max(data['year'])])
  xAxis.transition().call(d3.axisBottom(x))
  line
    .select('.line')
    .transition()
    .attr("d", d3.line()
      .x(function (d) { return x(d.x); })
      .y(function (d) { return y(d.y); }))
});

var change = function (e) {
  count += 1;
  console.log(count)

  if (count % 3 == 1) { // first transition, hospitalizations
    title.innerHTML = "Greenhouse Gas Emissions";
    const greenHouse = original['greenhouseGasEmissionByCode'];

    var i = 0;
    var gdata = {};
    gdata["year"] = [];
    gdata["amount"] = [];
    for (; i < greenHouse.length; i++) {
      gdata['year'].push(greenHouse[i]['year']);
      gdata['amount'].push(greenHouse[i]['amount']);
    };

    var list = [];
    for (var i = 0; i < gdata['year'].length; i++) {
      list.push({ x: gdata['year'][i], y: gdata['amount'][i] })
    }

    // D3 Chart

    var margin = { top: 30, right: 30, bottom: 30, left: 150 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    chart.innerHTML = "";
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(150)")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      //.domain(([d3.min(data['year']), d3.max(data['year'])]))
      //.domain(d3.extent(data, function (d) { return d.x; }))
      .domain([d3.min(gdata['year']), d3.max(gdata['year'])])
      .range([0, width]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    var y = d3.scaleLinear()
      .domain([0, d3.max(gdata['amount']) + (0.1 * d3.max(gdata['amount']))])
      .range([height, 0]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    line.append("path")
      .datum(list)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2.0)
      .attr("d", d3.line()
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); }));

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 345) + " ," +
        (height + 30) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 800) + " ," +
        (height - 200) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Emissions (kilotons)");

    line
      .append("g")
      .attr("class", "brush")
      .call(brush);

    var idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4, 8])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    }

    svg.on("dblclick", function () {
      x.domain([d3.min(gdata['year']), d3.max(gdata['year'])])
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    });

  };

  if (count % 3 == 2) { // second transition, deaths
    title.innerHTML = "Methane Emissions";
    const methane = original['methaneEmissionByCode'];

    var i = 0;
    var mdata = {};
    mdata["year"] = [];
    mdata["amount"] = [];
    for (; i < methane.length; i++) {
      mdata['year'].push(methane[i]['year']);
      mdata['amount'].push(methane[i]['amount']);
    };

    var list = [];
    for (var i = 0; i < mdata['year'].length; i++) {
      list.push({ x: mdata['year'][i], y: mdata['amount'][i] })
    }

    // D3 Chart

    var margin = { top: 30, right: 30, bottom: 30, left: 150 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    chart.innerHTML = "";
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(150)")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      //.domain(([d3.min(data['year']), d3.max(data['year'])]))
      //.domain(d3.extent(data, function (d) { return d.x; }))
      .domain([d3.min(mdata['year']), d3.max(mdata['year'])])
      .range([0, width]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    var y = d3.scaleLinear()
      .domain([0, d3.max(mdata['amount']) + (0.1 * d3.max(mdata['amount']))])
      .range([height, 0]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 345) + " ," +
        (height + 30) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 800) + " ," +
        (height - 200) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Emissions (kilotons)");

    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    line.append("path")
      .datum(list)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "purple")
      .attr("stroke-width", 2.0)
      .attr("d", d3.line()
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); }));

    line
      .append("g")
      .attr("class", "brush")
      .call(brush);

    var idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4, 8])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    }

    svg.on("dblclick", function () {
      x.domain([d3.min(mdata['year']), d3.max(mdata['year'])])
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    });

  };

  if (count % 3 == 0) { // third transition, back to the start
    title.innerHTML = "CO2 Emissions";

    const carbonData = original['co2EmissionByCode'];
    console.log(carbonData);
    title.innerHTML = "CO2 Emissions";
    var i = 0;
    var data = {};
    data["year"] = [];
    data["amount"] = [];
    for (; i < carbonData.length; i++) {
      data['year'].push(carbonData[i]['year']);
      data['amount'].push(carbonData[i]['amount']);
    };
    console.log(data['year']);
    console.log(data['amount']);
    console.log("done");

    var list = [];
    for (var i = 0; i < data['year'].length; i++) {
      list.push({ x: data['year'][i], y: data['amount'][i] })
      console.log("added");
    }
    console.log(list);

    for (var i = 0; i < list.length; i++) {
      //console.log(list[i]['x'])
      //console.log(list[i]['y'])
    }
    var margin = { top: 30, right: 30, bottom: 30, left: 150 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    chart.innerHTML = "";
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(150)")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      //.domain(([d3.min(data['year']), d3.max(data['year'])]))
      //.domain(d3.extent(data, function (d) { return d.x; }))

      .domain([d3.min(data['year']), d3.max(data['year'])])
      .range([0, width]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    var y = d3.scaleLinear()
      .domain([0, d3.max(data['amount']) + (0.1 * d3.max(data['amount']))])
      .range([height, 0]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 345) + " ," +
        (height + 30) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("transform",
        "translate(" + (width - 800) + " ," +
        (height - 200) + ")")
      .style("font", "14px times")
      .style("text-anchor", "middle")
      .text("Emissions (kilotons)");

    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    line.append("path")
      .datum(list)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2.0)
      .attr("d", d3.line()
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); }));

    line
      .append("g")
      .attr("class", "brush")
      .call(brush);

    var idleTimeout
    function idled() { idleTimeout = null; }

    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4, 8])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    }

    svg.on("dblclick", function () {
      x.domain([d3.min(data['year']), d3.max(data['year'])])
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function (d) { return x(d.x); })
          .y(function (d) { return y(d.y); }))
    });
  };
};


/*
for (i = 0, i < data.length; i++) {
  console.log(data[i]);
};
*/
transitionbtn.addEventListener('click', change);
