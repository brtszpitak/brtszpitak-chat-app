const nlp = require('compromise');

const respond = (query) => {
  const doc = nlp(query);
  if (doc.has('#Question')) {
    console.log(`You asked: ${query}`);
  } else if (doc.has('#Command')) {
    console.log(`You commanded: ${query}`);
  } else {
    console.log(`I didn't understand: ${query}`);
  }
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  respond(chunk.trim());
});