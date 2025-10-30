const speech = require('google-cloud/speech');

const client = new speech.SpeechClient();

async function analyzeAudio() {
  const audio = {
    content: Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'),
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
  };

  const request = {
    audio,
    config,
  };

  const [response] = await client.recognize(request);

  for (const result of response.results) {
    console.log(`Transcription: ${result.alternatives[0].transcript}`);
  }
}

analyzeAudio();