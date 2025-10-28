const speech = require("speech-recognition");
const nltk = require("nltk");

speech.init({
  lang: "en-US",
});

let recognizedText;

speech.start({
  onresult: (event) => {
    recognizedText = event.results[0][0].transcript;
    console.log(`Recognized text: ${recognizedText}`);

    const tokens = nltk.word_tokenize(recognizedText);
    console.log(`Tokenized words: ${tokens}`);
  },
});
