// Main data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Dimensions
const margin = { top: 40, right: 20, bottom: 100, left: 70 };
const height = 600 - margin.top - margin.bottom;
const width = 1000 - margin.left - margin.right;
const cellWidth = 20;
const cellHeight = 40;

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
  .attr("width", width + margin.left + margin.right);

const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load & display data
d3.json(url)
  .then((data) => {
    console.log(data);
    const minYear = d3.min(data.monthlyVariance, (d) => d.year);

    // Y Scale & Axis
    const yScale = d3
      .scaleBand()
      .domain(months)
      .range([cellHeight * months.length, 0]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d)
      .tickSize(0);

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
      .attr("transform", `translate(0, ${height + margin.top / 2})`);

    // Month labels
    // const monthLabels = chart
    //   .selectAll(".month-label")
    //   .data(months)
    //   .enter()
    //   .append("text")
    //   .text((d) => d)
    //   .attr("x", -10)
    //   .attr("y", (d, i) => i * cellHeight + cellHeight / 1.7)
    //   .style("text-anchor", "end")
    //   .style("fill", "white");

    // Year labels
    // const yearLabels = chart
    //   .selectAll(".year-label")
    //   .data(data.monthlyVariance)
    //   .enter()
    //   .append("text")
    //   .text((d) => d.year)
    //   .attr("x", (d, i) => i * cellWidth + cellWidth / 1.7)
    //   .attr("y", 0)
    // .attr("transform", "rotate(-65)")
    // .style("text-anchor", "start")
    // .style("fill", "white");

    // Data cells
    const heatMap = chart
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter()
      .append("rect")
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("x", (d) => (d.year - minYear) * cellWidth)
      .attr("y", (d) => (d.month - 1) * cellHeight)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill", "tomato");
  })
  .catch((error) => console.log(error));
