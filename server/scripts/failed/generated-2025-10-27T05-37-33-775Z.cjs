const speech = require("speech-recognition");
const nltk = require("nltk");

speech.init({
  lang: "en-US",
});

let recognition = new speech.Recognition();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(`Recognized speech: ${transcript}`);

  const words = nltk.word_tokenize(transcript);
  console.log(`Tokenized words: ${words.join(", ")}`);
};

recognition.start();
