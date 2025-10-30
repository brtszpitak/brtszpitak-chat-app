const natural = require('natural');

const nlpModule = (query) => {
  const tokenizer = new natural.WordTokenizer();
  const tokenizedQuery = tokenizer.tokenize(query);
  console.log(`Tokenized query: ${tokenizedQuery}`);
  
  const lexicon = new natural.Lexicon();
  const posTaggedQuery = [];
  for(let i=0; i<tokenizedQuery.length; i++) {
    posTaggedQuery.push(lexicon.posTag(tokenizedQuery[i]));
  }
  console.log(`POS tagged query: ${posTaggedQuery}`);
  
  return `You said: ${query}. I understand that you meant to ask about ${posTaggedQuery.join(' ')}`;
};

console.log(nlpModule(process.argv[2]));