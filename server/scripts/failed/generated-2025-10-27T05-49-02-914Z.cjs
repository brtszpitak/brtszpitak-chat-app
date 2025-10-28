const nl = require("nlp-compromise");

let input = "What is the weather like today?";

let doc = nl.text(input).out("terms");

console.log(doc.map((term) => term.normal));
