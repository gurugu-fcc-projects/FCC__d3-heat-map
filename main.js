// Main data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 70 };
const height = 600 - margin.top - margin.bottom;
const width = 1000 - margin.left - margin.right;
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

// Y Scale & Axis
const yScale = d3.scaleLinear().domain([0, 11]).range([height, 0]);
const yAxis = d3.axisLeft(yScale).tickFormat((d) => months[d - 1]);
chart.append("g").call(yAxis);

d3.json(url)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.log(error));
