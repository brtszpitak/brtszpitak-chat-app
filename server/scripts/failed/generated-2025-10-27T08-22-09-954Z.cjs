const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const lexer = new natural.Lexicon();

lexer.addVerb('ask', 'question');
lexer.addVerb('give', 'command');
lexer.add Verb('use', 'syntax');
lexer.add Verb('need', 'format');

const sentence = 'Can you answer my question without needing specific syntax or formats?';

const tokenizedSentence = tokenizer.tokenize(sentence);
const taggedTokens = lexer.tag(tokenizedSentence);

console.log(taggedTokens);