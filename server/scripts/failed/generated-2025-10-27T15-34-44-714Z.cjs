const fs = require("fs");
const jsonld = require("jsonld");

let kg = {
  "@context": "https://schema.org/",
  "@graph": [],
};

function addEntity(id, type, props) {
  kg["@graph"].push({
    "@id": id,
    "@type": type,
    ...props,
  });
}

addEntity("Concept:Alice", "Person", { name: "Alice" });
addEntity("Topic:AI", "Topic", { name: "Artificial Intelligence" });
addEntity("Entity:Bartosz", "Person", { name: "Bartosz" });

addEntity("Relationship:Alice-Knows-Bartosz", "Relationship", {
  subject: "Concept:Alice",
  predicate: "knows",
  object: "Entity:Bartosz",
});

addEntity("Relationship:Bartosz-InterestedIn-AI", "Relationship", {
  subject: "Entity:Bartosz",
  predicate: "interestedIn",
  object: "Topic:AI",
});

fs.writeFileSync("knowledge-graph.jsonld", jsonld.compact(kg));
