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
    // Dimensions
    const margin = { top: 40, right: 20, bottom: 120, left: 70 };
    const cellWidth = 5;
    const cellHeight = 40;
    const height = 600 - margin.top - margin.bottom;
    const width = cellWidth * Math.ceil(data.monthlyVariance.length / 12);

    const minYear = d3.min(data.monthlyVariance, (d) => d.year);
    const maxVariance = d3.max(data.monthlyVariance, (d) => d.variance);
    const minVariance = d3.min(data.monthlyVariance, (d) => d.variance);
    const maxMaxVariance = maxVariance + Math.abs(minVariance);
    const baseTemperature = data.baseTemperature;
    const normalizedData = data.monthlyVariance.map((dataItem) => ({
      ...dataItem,
      date: `${dataItem.year}-${dataItem.month}`,
      selected: true,
    }));

    // console.log(normalizedData);
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
      // .scaleSequential(interpolateGnBu())
      .scaleSequential(d3.interpolateYlOrRd)
      // .scaleSequential(d3.interpolatePRGn)
      .domain(
        d3.extent(
          data.monthlyVariance,
          (d) => d.variance + Math.abs(minVariance)
        )
      );

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

    svg
      .append("g")
      .attr("class", "axis")
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    svg
      .append("g")
      .attr("class", "axis")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${margin.left}, ${height + margin.top + margin.bottom / 3})`
      );

    // Tooltip
    const tooltip = d3.select(".content").append("div").attr("id", "tooltip");

    const showTooltip = function (d) {
      const content = `<div>${months[d.month - 1]} ${d.year}</div><div>${(
        baseTemperature + d.variance
      ).toFixed(1)}&#8451;</div>`;

      tooltip
        .html(content)
        .style("left", `${d3.event.pageX + 15}px`)
        .style("top", `${d3.event.pageY - 28}px`)
        .attr("data-year", d["Year"])
        .transition()
        .duration(200)
        .style("opacity", 0.9);

      d3.select(this)
        .transition()
        .duration(100)
        // .style("fill", "#2b8cbe")
        .style("fill", "rgb(44, 44, 44)")
        .style("stroke", "#fff");
      // d3.select(this)
      //   .transition()
      //   .duration(100)
      //   .style("stroke", "rgb(44, 44, 44)")
      //   .style("stroke-width", "3px");
    };

    //--> Hide tooltip
    const hideTooltip = function (d) {
      tooltip.transition().duration(200).style("opacity", 0);
      d3.select(this)
        .transition()
        .duration(100)
        .style("fill", (d) => colorScale(d.variance + Math.abs(minVariance)))
        .style("stroke", "none");
    };

    // Heatmap creation function
    const drawHeatmap = () => {
      chart
        .selectAll("rect")
        .data(normalizedData, (d) => d.date)
        .join("rect")
        .attr("class", "cell")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", (d) => (d.year - minYear) * cellWidth)
        .attr("y", (d) => Math.abs(d.month - 12) * cellHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill", (d) => colorScale(d.variance + Math.abs(minVariance)))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
    };

    // Initial heatmap drawing
    drawHeatmap();

    // Legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left}, ${height + margin.top * 3})`
      );

    const categoriesCount = 10;
    const legendItemWidth = 40;
    const legendItemHeight = 15;

    const categories = [...Array(categoriesCount)].map((_, i) => {
      const upperBound = (maxMaxVariance / categoriesCount) * (i + 1);
      const lowerBound = (maxMaxVariance / categoriesCount) * i;

      return {
        upperBound,
        lowerBound,
        color: colorScale(upperBound),
        selected: true,
      };
    });

    // Legend toggle fn
    const toggle = function (legend) {
      const { upperBound, lowerBound, selected } = legend;
      let selectedData;

      const legendEls = document.querySelectorAll(".legend-item");

      if (this.classList.contains("selected")) {
        selectedData = data.monthlyVariance.map((dataItem) => {
          return { ...dataItem, selected: true };
        });

        this.classList.remove("selected");
      } else {
        selectedData = data.monthlyVariance.map((dataItem) => {
          if (
            dataItem.variance >= (lowerBound + minVariance).toFixed(3) &&
            dataItem.variance <= (upperBound + minVariance).toFixed(3)
          ) {
            return { ...dataItem, selected: true };
          } else {
            return { ...dataItem, selected: false };
          }
        });

        legendEls.forEach((legendEl) => {
          legendEl.classList.remove("selected");
        });

        this.classList.add("selected");
      }

      chart
        .selectAll("rect")
        .data(selectedData)
        .attr("class", "cell")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", (d) => (d.year - minYear) * cellWidth)
        .attr("y", (d) => Math.abs(d.month - 12) * cellHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill", (d) => {
          if (d.selected) {
            return colorScale(d.variance + Math.abs(minVariance));
          } else {
            return "rgb(65, 61, 61)";
          }
        })
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
    };

    // Legend - graph
    const legendMap = legend
      .selectAll("rect")
      .data(categories)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", legendItemWidth)
      .attr("height", legendItemHeight)
      .attr("x", (d, i) => legendItemWidth * i)
      .attr("fill", (d) => d.color)
      .on("click", toggle);

    // Legend -- text
    const legendText = legend
      .selectAll("text")
      .data(categories)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("y", legendItemHeight * 2)
      .attr("x", (d, i) => legendItemWidth * i + 10)
      .text((d) => (d.upperBound + minVariance + baseTemperature).toFixed(1));
  })
  .catch((error) => console.log(error));
