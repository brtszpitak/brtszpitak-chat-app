fs.writeFileSync('knowledgeGraph.json', '{}');

let knowledgeGraph = JSON.parse(fs.readFileSync('knowledgeGraph.json'));

function updateKnowledgeGraph(conversation) {
  let currentDateTime = new Date().toISOString();
  knowledgeGraph[currentDateTime] = conversation;
  fs.writeFileSync('knowledgeGraph.json', JSON.stringify(knowledgeGraph, null, 2));
}

function recallConversation(topic) {
  for (let dateTime in knowledgeGraph) {
    if (Object.values(knowledgeGraph[dateTime]).includes(topic)) {
      return knowledgeGraph[dateTime];
    }
  }
  return null;
}

console.log('Welcome to our collaboration! I can retain information about previous conversations and adapt my responses accordingly.');

while (true) {
  let userResponse = prompt('Please enter your message or topic: ');
  if (userResponse === 'exit') break;

  let recalledConversation = recallConversation(userResponse);
  if (recalledConversation !== null) {
    console.log(`I remember our conversation about ${userResponse} on ${Object.keys(recalledConversation)[0]}.`);
  } else {
    console.log('This is a new topic. I will make sure to remember it for future conversations.');
  }

  updateKnowledgeGraph({ [new Date().toISOString()]: userResponse });
}