const readline = require('readline');
const { google } = require('googleapis');

async function main() {
  const auth = new google.auth.GoogleAuth({
    // If you have a JSON key file, use this:
    keyFile: 'path-to-json-key-file.json',
    scopes: ['https://www.googleapis.com/auth/cloud-language'],
  });

  const language = google.cloudlanguage('v1');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('You: ');
  rl.prompt();

  rl.on('line', async (line) => {
    try {
      const [response] = await language.documents.analyzeSentiment({
        document: {
          type: 'PLAIN_TEXT',
          content: line,
        },
        encodingType: 'UTF8',
      });

      console.log(`Response: ${response.documentSentiment.sentiment}`);
      rl.prompt();
    } catch (err) {
      console.error('Error:', err);
      rl.prompt();
    }
  }).on('close', () => {
    process.exit(0);
  });
}

main();