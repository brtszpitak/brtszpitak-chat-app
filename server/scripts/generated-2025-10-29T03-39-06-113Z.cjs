const fs = require('fs');
let data = {};
try { data = JSON.parse(fs.readFileSync('feedback.json', 'utf8')); } catch (e) {}
const prompts = Object.keys(data);
console.log('Available prompts:');
for (let i = 0; i < prompts.length; i++) {
    console.log(`${i + 1}. ${prompts[i]}`);
}
const promptIndex = parseInt(prompt('Enter the number of a prompt to rate or correct, or type a new prompt: '));
if (isNaN(promptIndex)) {
    const newPrompt = promptIndex.toString();
    data[newPrompt] = { ratings: [], corrections: [] };
    console.log(`Created new prompt: ${newPrompt}`);
} else {
    const prompt = prompts[promptIndex - 1];
    const rating = parseInt(prompt('Enter a rating (1-5) for the response to "' + prompt + '": '));
    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        data[prompt].ratings.push(rating);
        console.log(`Rated "${prompt}" with ${rating}.`);
    }
    const correction = prompt('Enter a correction for the response to "' + prompt + '", or press Enter to skip: ');
    if (correction !== '') {
        data[prompt].corrections.push(correction);
        console.log(`Corrected "${prompt}" with "${correction}".`);
    }
}
fs.writeFileSync('feedback.json', JSON.stringify(data, null, 2));
console.log('Feedback saved.');