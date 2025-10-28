console.log("Alice's Knowledge Graph Database Integration Script");

const axios = require("axios");

async function createKnowledgeGraphDatabase() {
  console.log("Creating knowledge graph database...");
  try {
    const response = await axios.post("https://api.stardog.com/ databases", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ name: "Alice Knowledge Graph" }),
    });
    console.log(`Database created with ID: ${response.data.id}`);
  } catch (error) {
    console.error("Error creating database:", error);
  }
}

async function storeInformationInGraph() {
  console.log("Storing information in knowledge graph...");
  try {
    const response = await axios.post(
      "https://api.stardog.com/databases/Alice%20Knowledge%20Graph/query",
      {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          query: `INSERT DATA { 
          <http://example.org/alice> a <http://schema.org/ConversationalAI>;
            <http://schema.org/name> "Alice";
            <http://schema.org/description> "A conversational AI assistant.".
        }`,
        }),
      }
    );
    console.log("Information stored successfully.");
  } catch (error) {
    console.error("Error storing information:", error);
  }
}

async function retrieveInformationFromGraph() {
  console.log("Retrieving information from knowledge graph...");
  try {
    const response = await axios.post(
      "https://api.stardog.com/databases/Alice%20Knowledge%20Graph/query",
      {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          query: `PREFIX schema: <http://schema.org/> 
          SELECT ?name ?description 
          WHERE { 
            <http://example.org/alice> a schema:ConversationalAI;
              schema:name ?name;
              schema:description ?description.
          }`,
        }),
      }
    );
    console.log(
      `Retrieved information: ${response.data.results.bindings[0].name.value} - ${response.data.results.bindings[0].description.value}`
    );
  } catch (error) {
    console.error("Error retrieving information:", error);
  }
}

createKnowledgeGraphDatabase().then(storeInformationInGraph).then(retrieveInformationFromGraph);
