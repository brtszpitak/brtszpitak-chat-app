const speech = require("google-cloud/speech");

async function main() {
  const client = new speech.SpeechClient();

  const file = "path/to/audio/file.wav";
  const audio = {
    content: fs.readFileSync(file).toString("base64"),
  };

  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };

  const request = {
    config,
    audio,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  console.log(`Transcription: ${transcription}`);
}

main();
