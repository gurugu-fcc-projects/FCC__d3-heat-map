const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Main elements

d3.json(url)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.log(error));
