// Main data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 70 };
const height = 600 - margin.top - margin.bottom;
const width = 1000 - margin.left - margin.right;

// SVG & Chart
const svg = d3.select(".content").append("svg");
const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Y Scale & Axis
const yScale = d3.scaleLinear().domain([0, 11]).range([height, 0]);
const yAxis = d3.axisLeft(yScale);
chart.append("g").call(yAxis);

d3.json(url)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.log(error));
