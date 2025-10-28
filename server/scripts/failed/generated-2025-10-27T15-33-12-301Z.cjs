const fs = require("fs");
const data = {
  concepts: {
    "knowledge graph": { related: ["artificial intelligence", "data storage"] },
    "artificial intelligence": { related: ["machine learning", "natural language processing"] },
    "data storage": { related: ["database", "file system"] },
    "machine learning": { related: ["supervised learning", "unsupervised learning"] },
    "natural language processing": { related: ["text analysis", "sentiment analysis"] },
    database: { related: ["relational database", "NoSQL database"] },
    "file system": { related: ["operating system", "data retrieval"] },
    "supervised learning": { related: ["regression", "classification"] },
    "unsupervised learning": { related: ["clustering", "dimensionality reduction"] },
    "text analysis": { related: ["tokenization", "part-of-speech tagging"] },
    "sentiment analysis": { related: ["opinion mining", "emotion detection"] },
    "relational database": { related: ["SQL", "data modeling"] },
    "NoSQL database": { related: ["key-value store", "document-oriented database"] },
    "operating system": { related: ["process management", "memory management"] },
    "data retrieval": { related: ["query language", "information extraction"] },
  },
};

fs.writeFileSync("knowledge-graph.json", JSON.stringify(data, null, 2));

console.log("Knowledge graph created and saved to knowledge-graph.json");
