const createPieChart = (dataset) => {
  const svg = d3.select("svg");
  const svgEl = document.querySelector(".chart-con svg");
  const width = svgEl.clientWidth;
  const height = svgEl.clientHeight;
  const radius = Math.min(width, height) / 2;
  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  const color = d3.scaleOrdinal([
    "#4daf4a",
    "#377eb8",
    "#ff7f00",
    "#984ea3",
    "#e41a1c",
  ]);

  // Generate the pie
  const pie = d3.pie().value((d) => d.size);

  // Generate the arcs
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const label = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(radius - 80);

  //Generate groups
  const arcs = g
    .selectAll("arc")
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", "arc");

  //Draw arc paths
  arcs
    .append("path")
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("d", arc)
    .attr("data-link", function (d) {
      return d.data.link;
    })
    .on("click", function (e, d) {
      window.location.pathname = d.data.link
    });

  arcs
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + label.centroid(d) + ")";
    })
    .text(function (d) {
      return d.data.title;
    });
};

const App = async () => {
  const dataRaw = await fetch("/portfolio-details");
  const data = await dataRaw.json();
  createPieChart(data);
};

App();
