// Country Variables
const countries = topojson.feature(world_data, world_data.objects.countries);
const selectedCountry = d3.select("#selected_country");
let selectedCountryObject = {};

// Globe Constants
const width = 960, height = 500;
const context = d3.select("#globe")
  .insert("canvas")
  .attr("width", width)
  .attr("height", height)
  .node()
  .getContext("2d");
const projection = d3.geoOrthographic()
  .precision(0.1);
const path = d3.geoPath(projection, context);
const graticule = d3.geoGraticule();

// Rotation
const rotationConfig = {
  speed: 0.01,
  verticalTilt: -15,
  horizontalTilt: 0
};
const rotate = (elapsed) => {
  projection.rotate([rotationConfig.speed * elapsed, rotationConfig.verticalTilt, rotationConfig.horizontalTilt]);
  render();
};
const autorotate = d3.timer(rotate);

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
const render = () => {
  const sphere = ({ type: "Sphere" });

  context.clearRect(0, 0, width, height);
  context.beginPath();
  path.context(context)(sphere);
  context.fillStyle = "#fff";
  context.fill();

  context.beginPath();
  path.context(context)(countries);
  context.fillStyle = "#000";
  context.fill();

  context.beginPath();
  path.context(context)(sphere);
  context.stroke();

  if (selectedCountryObject) {
    context.beginPath();
    path.context(context)(selectedCountryObject);
    context.fillStyle = "#a00";
    context.fill();
  }
}

// Country Function
function findCountry(obj) {
  const position = projection.invert(d3.mouse(obj));

  return attempt = countries.features.find(function (f) {
    return f.geometry.coordinates.find(function (c1) {
      return d3.polygonContains(c1, position) || c1.find(function (c2) {
        return d3.polygonContains(c2, position)
      })
    })
  });
}

function hover() {
  let attempt = findCountry(this);

  if (!attempt) {
    if (selectedCountry.text()) {
      selectedCountry.text("");
      selectedCountryObject = {};
      render();
    }
    return;
  }

  if (attempt.properties.name !== selectedCountry.text()) {
    selectedCountry.text(attempt.properties.name);
    selectedCountryObject = attempt;
  }

  render();
};

function redirect() {
  let attempt = findCountry(this);

  if (!attempt) {
    if (selectedCountry.text()) {
      selectedCountry.text('');
      selectedCountryObject = {};
      render();
    }
    return;
  }

  if (attempt.properties.name !== selectedCountry.text()) {
    selectedCountry.text(attempt.properties.name);
    selectedCountryObject = attempt;
  }

  window.location.href = `/country/${attempt.id}`;
}

d3.select("#globe")
  .call(drag()
    .on("drag.render", () => render())
    .on("end.render", () => render()))
  .on("click", redirect)
  .on("mousemove", hover)
  .call(() => render());
