// Main data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 70 };
const height = 600 - margin.top - margin.bottom;
const width = 1000 - margin.left - margin.right;
const cellSize = 30;

// Helpers
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// SVG & Chart
const svg = d3
  .select(".content")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  // .attr("height", "100vh")
  .attr("width", width + margin.left + margin.right);
// .attr("width", "100%");
const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(url)
  .then((data) => {
    console.log(data);

    // Y Scale & Axis
    const yScale = d3
      .scaleLinear()
      .domain([0, 11])
      .range([cellSize * months.length, 0]);

    const yAxis = d3.axisLeft(yScale).tickFormat((d) => months[d - 1]);

    chart.append("g").call(yAxis);

    // X Scale & Axis
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data.monthlyVariance, (d) => d.year))
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => String(d));

    chart
      .append("g")
      .call(xAxis)
      .attr(
        "transform",
        `translate(0, ${height - margin.top - margin.bottom})`
      );
  })
  .catch((error) => console.log(error));
