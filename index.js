import { select, selectAll } from "d3-selection";
import { max, extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";

let tweets = require("./data/tweets.json");
dataViz(tweets.tweets);

function formatarOjetos(incomingData) {
  incomingData.forEach((element) => {
    element.impact = element.favorites.length + element.retweets.length;
    element.tweetTime = new Date(element.timestamp);
  });

  return incomingData;
}

function medirImpact(incomingData) {
  let maxImpact = max(incomingData, (element) => {
    return element.impact;
  });

  return maxImpact;
}

function medirData(incomingData) {
  let starEnd = extent(incomingData, (element) => {
    return element.tweetTime;
  });

  return starEnd;
}

function criandoYScale(maxImpact) {
  let yScale = scaleLinear().domain([0, maxImpact]).range([0, 460]);
  return yScale;
}

function criandoRadiusScale(maxImpact) {
  let radiusScale = scaleLinear().domain([0, maxImpact]).range([1, 20]);
  return radiusScale;
}

function criandoTimeRamp(starEnd) {
  let timeRamp = scaleTime().domain(starEnd).range([0, 460]);
  return timeRamp;
}

function criandoColorScale(maxImpact) {
  let colorScale = scaleLinear()
    .domain([0, maxImpact])
    .range(["white", "#990000"]);

  return colorScale;
}

function dataViz(incomingData) {
  incomingData = formatarOjetos(incomingData);

  let maxImpact = medirImpact(incomingData);
  let starEnd = medirData(incomingData);

  let yScale = criandoYScale(maxImpact);
  let radiusScale = criandoRadiusScale(maxImpact);
  let timeRamp = criandoTimeRamp(starEnd);
  let colorScale = criandoColorScale(maxImpact);

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

  // testRemoveData("g");
}

function testRemoveData(tagRaiz) {
  selectAll(tagRaiz).data([1, 2, 3, 4]).exit().remove();

  selectAll(tagRaiz)
    .select("text")
    .text((d) => {
      return d;
    });
}
