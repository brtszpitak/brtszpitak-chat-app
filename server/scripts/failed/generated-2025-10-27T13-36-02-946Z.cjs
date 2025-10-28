const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = client.db();
const conversationsCollection = db.collection("conversations");

async function storeConversation(conversation) {
  await conversationsCollection.insertOne({ conversation });
}

async function getConversations() {
  return await conversationsCollection.find().toArray();
}

async function recallConversationDetail(detail) {
  return await conversationsCollection.findOne({
    conversation: { $elemMatch: { $regex: detail, $options: "i" } },
  });
}

storeConversation({ user: "Bartosz", message: "Hello Alice!", response: "Hi Bartosz!" })
  .then(() => {
    getConversations().then((conversations) => console.log(conversations));
    recallConversationDetail("hello").then((result) => console.log(result));
  })
  .catch((err) => console.error(err));
