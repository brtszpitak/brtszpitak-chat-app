const fetch = require("node-fetch");

async function main() {
  const response = await fetch("https://api.dbpedia.org/sparql", {
    method: "POST",
    headers: { "Content-Type": "application/sparql-query" },
    body: `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      SELECT ?subject ?predicate ?object
      WHERE { ?subject ?predicate ?object }
      LIMIT 10
    `,
  });

  const data = await response.json();
  console.log(data.results.bindings);
}

main();
