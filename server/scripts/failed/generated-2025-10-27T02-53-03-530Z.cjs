const fs = require("fs");
const data = {};

function addNode(topic, info) {
  if (!data[topic]) data[topic] = {};
  Object.assign(data[topic], info);
}

function connectNodes(topic1, topic2) {
  if (data[topic1] && data[topic2]) {
    if (!data[topic1].related) data[topic1].related = [];
    if (!data[topic2].related) data[topic2].related = [];
    data[topic1].related.push(topic2);
    data[topic2].related.push(topic1);
  }
}

function getRelatedTopics(topic) {
  return data[topic] && data[topic].related ? data[topic].related : [];
}

addNode("AI", { description: "Artificial Intelligence" });
addNode("Machine Learning", { description: " Subset of AI" });
connectNodes("AI", "Machine Learning");

console.log(getRelatedTopics("AI"));
