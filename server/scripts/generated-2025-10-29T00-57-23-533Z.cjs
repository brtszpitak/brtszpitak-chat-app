const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const text = 'Implement a natural language understanding module that allows users to interact with you using everyday language';
const tokenized = tokenizer.tokenize(text);
console.log(tokenized);