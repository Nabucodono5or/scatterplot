import { select, selectAll } from "d3-selection";
import { max, extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";

let tweets = require("./data/tweets.json");
dataViz(tweets.tweets);

function dataViz(incomingData) {
  incomingData.forEach((element) => {
    element.impact = element.favorites.length + element.retweets.length;
    element.tweetTime = new Date(element.timestamp);
  });

  let maxImpact = max(incomingData, (element) => {
    return element.impact;
  });

  let starEnd = extent(incomingData, (element) => {
    return element.tweetTime;
  });

  let yScale = scaleLinear().domain([0, maxImpact]).range([0, 460]);
  let radiusScale = scaleLinear().domain([0, maxImpact]).range([1, 20]);
  let timeRamp = scaleTime().domain(starEnd).range([0, 460]);
  let colorScale = scaleLinear()
    .domain([0, maxImpact])
    .range(["white", "#990000"]);

  //   select("svg")
  //     .selectAll("circle")
  //     .data(incomingData)
  //     .enter()
  //     .append("circle")
  //     .attr("r", (d) => {
  //       return radiusScale(d.impact);
  //     })
  //     .attr("cx", (d, i) => {
  //       return timeRamp(d.tweetTime);
  //     })
  //     .attr("cy", (d) => {
  //       return 500 - yScale(d.impact);
  //     })
  //     .style("fill", (d) => {
  //       return colorScale(d.impact);
  //     })
  //     .style("stroke", "black")
  //     .style("stroke-width", "1px");

  let teamG = select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return (
        "translate (" +
        timeRamp(d.tweetTime) +
        "," +
        (500 - yScale(d.impact)) +
        ")"
      );
    });

  teamG
    .append("circle")
    .attr("r", (d) => {
      return radiusScale(d.impact);
    })
    .style("fill", (d) => {
      return colorScale(d.impact);
    })
    .style("stroke-width", "1px");

  teamG.append("text").html((d) => {
    return d.user;
  });
}
