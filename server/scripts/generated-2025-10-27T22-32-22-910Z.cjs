const fetch = require('node-fetch');

async function main() {
  const url = 'https://raw.githubusercontent.com/timrdf/csv2rdf4j/master/data/dbpedia-2015-04-en-categories.csv';
  const response = await fetch(url);
  const csv = await response.text();
  const rows = csv.split('\n');
  const data = {};
  
  for (const row of rows) {
    const [subject, predicate, object] = row.split(',');
    if (!data[subject]) data[subject] = {};
    data[subject][predicate] = object;
  }
  
  console.log('Knowledge Graph Database:');
  console.dir(data, { depth: null });
}

main();