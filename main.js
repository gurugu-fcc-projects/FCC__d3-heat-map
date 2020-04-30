// Main data
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

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

// Load & display data
d3.json(url)
  .then((data) => {
    console.log(data);

    // Dimensions
    const margin = { top: 40, right: 20, bottom: 100, left: 70 };
    const cellWidth = 5;
    const cellHeight = 40;
    const height = 600 - margin.top - margin.bottom;
    const width = cellWidth * Math.ceil(data.monthlyVariance.length / 12);

    const minYear = d3.min(data.monthlyVariance, (d) => d.year);
    const maxVariance = d3.max(data.monthlyVariance, (d) => d.variance);
    console.log("maxVariance:", maxVariance);

    // SVG & Chart
    const svg = d3
      .select(".content")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Color Scale
    const interpolateGnBu = () => {
      return d3.interpolateRgbBasis([
        "#f7fcf0",
        "#e0f3db",
        "#ccebc5",
        "#a8ddb5",
        "#7bccc4",
        "#4eb3d3",
        "#2b8cbe",
        "#0868ac",
        "#084081",
      ]);
    };

    const colorScale = d3
      .scaleSequential(interpolateGnBu())
      .domain(d3.extent(data.monthlyVariance, (d) => d.variance));

    // Y Scale & Axis
    const yScale = d3
      .scaleBand()
      .domain(months)
      .range([cellHeight * months.length, 0]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d)
      .tickSize(0)
      .tickPadding(10);

    chart.append("g").attr("class", "axis").call(yAxis);

    // X Scale & Axis
    const xScale = d3
      .scaleBand()
      .domain(data.monthlyVariance.map((d) => d.year))
      .range([0, width]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter((year) => year % 10 === 0))
      .tickFormat((d) => String(d))
      .tickSize(0)
      .tickPadding(10);

    chart
      .append("g")
      .attr("class", "axis")
      .call(xAxis)
      .attr("transform", `translate(0, ${height + margin.top / 2})`);

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
      .style("fill", (d) => colorScale(d.variance));

    // Legend
    const legend = chart
      .append("g")
      .attr("transform", `translate(0, ${height + margin.top * 2})`);

    const categoriesCount = 10;
    const categories = [...Array(categoriesCount)].map((_, i) => {
      const upperBound = (maxVariance / categoriesCount) * (i + 1);
      const lowerBound = (maxVariance / categoriesCount) * i;

      return {
        upperBound,
        lowerBound,
        color: colorScale(upperBound / maxVariance),
      };
    });

    console.log(categories);
    const legendMap = legend
      .selectAll("rect")
      .data(categories)
      .enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", 15)
      .attr("x", (d, i) => 40 * i)
      .attr("fill", (d) => d.color);
  })
  .catch((error) => console.log(error));
