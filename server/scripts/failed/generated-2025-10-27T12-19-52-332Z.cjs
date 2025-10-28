const.neo4j = require('neo4j-driver').v1;

(async () => {
  const driver = new neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
  const session = driver.session();

  try {
    await session.run('CREATE CONSTRAINT ON (user:User) ASSERT user.id IS UNIQUE');
    await session.run('CREATE INDEX ON :User préferences');
    await session.run('CREATE INDEX ON :User habits');
    await session.run('CREATE INDEX ON :User interactions');

    console.log('Alice knowledge graph database setup complete!');
  } catch (error) {
    console.error('Error setting up Alice knowledge graph database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
})();