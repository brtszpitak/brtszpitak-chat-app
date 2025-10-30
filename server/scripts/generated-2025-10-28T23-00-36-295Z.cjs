const fs = require('fs');
let data = {};
try { data = JSON.parse(fs.readFileSync('feedback.json', 'utf8')); } catch {}
process.stdin.setEncoding('utf8');
process.stdout.write('Rate my response (1-5) or provide a correction: ');
process.stdin.on('data', input => {
  const ratingOrCorrection = input.trim();
  if (/^[1-5]$/.test(ratingOrCorrection)) data.ratings = (data.ratings || []).concat(parseInt(ratingOrCorrection));
  else data.corrections = (data.corrections || []).push(ratingOrCorrection);
  fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
  process.exit();
});