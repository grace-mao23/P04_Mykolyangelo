// Country Variables
let land;
let countries;
let selectedCountryObject = null;

// Globe Variables
let width = window.innerWidth, height = window.innerHeight;
const context = d3.select("#globe")
  .insert("canvas")
  .attr("width", width)
  .attr("height", height)
  .node()
  .getContext("2d");
// Canvas Based
const projection = d3.geoOrthographic();
const path = d3.geoPath(projection, context);
const graticule = d3.geoGraticule();
// SVG Based
const svgProjection = d3.geoOrthographic()
  .scale(100)
  .translate([100, 100])
  .clipAngle(90);
const svgPath = d3.geoPath(svgProjection);
const lambda = d3.scaleLinear()
  .domain([0, 200])
  .range([-180, 180]);
const svg = d3.select("#mini-globe")
  .append("svg")
  .attr("style", "background: #0077be; border-radius: 200px;")
  .attr("width", 200)
  .attr("height", 200);

// Rotation
// Canvas Based
let autorotate, canvasRotation = false, svgRotation = true;
let lastTimed = d3.now(), svgLastTimed = d3.now();
const rotationConfig = {
  speed: 0.003,
  verticalTilt: -15,
  horizontalTilt: 0
};
const rotate = (elapsed) => {
  let now = d3.now();
  if ((now - lastTimed) < elapsed) {
    if (canvasRotation === true) {
      projection.rotate([
        projection.rotate()[0] + rotationConfig.speed * (now - lastTimed),
        rotationConfig.verticalTilt,
        rotationConfig.horizontalTilt
      ]);
      render();
    }
    if (svgRotation === true) {
      svgProjection.rotate([
        svgProjection.rotate()[0] + rotationConfig.speed * (now - lastTimed),
        rotationConfig.verticalTilt,
        rotationConfig.horizontalTilt
      ]);
      svg.selectAll("path")
        .attr("d", svgPath);
    }

  }
  lastTimed = now;
};

// Drag
const drag = () => {
  let v0, q0, r0;

  function dragstarted() {
    v0 = versor.cartesian(projection.invert([d3.event.x, d3.event.y]));
    q0 = versor(r0 = projection.rotate());
    autorotate.stop();
  }

  function dragged() {
    const v1 = versor.cartesian(projection.rotate(r0).invert([d3.event.x, d3.event.y]));
    const q1 = versor.multiply(q0, versor.delta(v0, v1));
    projection.rotate(versor.rotation(q1));
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged);
}

// Globe Function
const scale = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  d3.select("#globe")
    .attr('width', width)
    .attr('height', height);
  projection
    .scale((0.8 * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2])
  render()
}

const render = () => {
  context.clearRect(0, 0, width, height);

  context.beginPath();
  path({ type: "Sphere" });
  context.fillStyle = "#0077be";
  context.fill();

  context.beginPath();
  path(land);
  context.fillStyle = "#77dd77";
  context.fill();

  context.beginPath();
  path({ type: "Sphere" });
  context.strokeStyle = "#ffffff";
  context.stroke();

  if (selectedCountryObject !== null) {
    context.beginPath();
    path(selectedCountryObject);
    context.fillStyle = "#6a1b9a";
    context.fill();

    context.font = "bold 16px monospace";
    context.fillText(selectedCountryObject.properties.name, 50, 50);
  }
}

// Country Function
function startRotation() {
  canvasRotation = true;
  svgRotation = true;
}

function findCountry(obj) {
  const position = projection.invert(d3.mouse(obj));

  const attempt = countries.features.find(({ geometry: { coordinates } }) =>
    coordinates.find((c1) => d3.polygonContains(c1, position) || c1.find((c2) => d3.polygonContains(c2, position)))
  );

  return attempt;
};

function hover() {
  let attempt = findCountry(this);

  if (!attempt) {
    if (selectedCountryObject !== null) {
      selectedCountryObject = null;
      render();
    }
    return;
  }

  if (selectedCountryObject === null || attempt.properties.name !== selectedCountryObject.properties.name) {
    selectedCountryObject = attempt;
  }

  render();
};

function redirect() {
  let attempt = findCountry(this);

  if (!attempt) {
    if (selectedCountryObject !== null) {
      selectedCountryObject = null;
      render();
    }
    return;
  }

  window.location.href = `/country/${attempt.id}`;
};

// Load Data
const loadData = (callback) => {
  const query = `
  {
    dataByName(dataName:"topojson") {
      data
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
    .then(({ data: { dataByName: { data } } }) => callback(JSON.parse(data)));
};

loadData(function (data) {
  land = topojson.feature(data, data.objects.land);
  countries = topojson.feature(data, data.objects.countries);

  svg.append("path")
    .datum(land)
    .attr("d", svgPath)
    .attr("fill", "#77dd77");

  d3.select("#globe")
    .call(drag()
      .on("drag.render", () => render())
      .on("end.render", () => render()))
    .on("click", redirect)
    .on("mousemove", hover)
    .call(() => render());

  scale();

  startRotation();

  window.addEventListener('resize', scale);

  autorotate = d3.timer(rotate);
});
