const axios = require('axios');

async function main() {
  const dbUrl = 'https://api.neo4j.com/db/your-instance';
  const dbName = 'alice-knowledge-graph';
  const dbUser = 'your-username';
  const dbPass = 'your-password';

  try {
    // Create database if it doesn't exist
    await axios.post(`${dbUrl}/databases`, { name: dbName }, { auth: { username: dbUser, password: dbPass } });

    // Create session
    const response = await axios.post(`${dbUrl}/databases/${dbName}/sessions`, {}, { auth: { username: dbUser, password: dbPass } });
    const sessionId = response.data.sessionId;

    // Run Cypher query to create knowledge graph schema
    await axios.post(`${dbUrl}/databases/${dbName}/sessions/${sessionId}/cypher`, {
      statement: `
        CREATE CONSTRAINT ON (n:AliceKnowledge) ASSERT n.id IS UNIQUE;
        CREATE INDEX ON :AliceKnowledge(name);
        
        CREATE (context:Context { name: 'default' });
      `,
    }, { auth: { username: dbUser, password: dbPass } });

    console.log('Alice knowledge graph database initialized!');
  } catch (error) {
    console.error(error.message);
  }
}

main();