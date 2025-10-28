const axios = require("axios");

async function main() {
  const neo4jUrl = "bolt://localhost:7687";
  const neo4jUser = "neo4j";
  const neo4jPassword = "password";

  try {
    const response = await axios.post(
      `http://localhost:7474/db/data/transaction/commit`,
      {
        statements: [
          {
            statement: `CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE`,
          },
        ],
      },
      {
        auth: {
          username: neo4jUser,
          password: neo4jPassword,
        },
      }
    );

    console.log("Constraint created:", response.data);

    const userData = {
      id: "user1",
      preferences: ["music", "movies"],
      habits: ["daily walks", "reading"],
      interactions: [{ type: "query", content: "what is the weather like?" }],
    };

    await axios.post(
      `http://localhost:7474/db/data/transaction/commit`,
      {
        statements: [
          {
            statement: `MERGE (u:User {id: '${userData.id}'}) 
          SET u.preferences = ${JSON.stringify(userData.preferences)}, 
              u.habits = ${JSON.stringify(userData.habits)} 
          WITH u 
          MATCH (i:Interaction {type: 'query', content: '${userData.interactions[0].content}'}) 
          MERGE (u)-[:HAS_INTERACTION]->(i)`,
          },
        ],
      },
      {
        auth: {
          username: neo4jUser,
          password: neo4jPassword,
        },
      }
    );

    console.log("User data created:");
    console.log(userData);
  } catch (error) {
    console.error(error);
  }
}

main();
