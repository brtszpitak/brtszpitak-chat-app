const axios = require('axios');

(async () => {
  try {
    const response = await axios.post('https://api.studio.apify.com/v2/acts/bartosz~alice/knowledge-graph-db', {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        query: `CREATE (n:AliceContext {id: 'initial'}) RETURN n`,
      }),
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})();