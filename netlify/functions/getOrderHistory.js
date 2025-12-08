import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();
  const { id } = event.queryStringParameters

  try {
    
    const result = await sql(`SELECT * FROM ORDER WHERE userid = ${id} OR storeid = ${id};`);

    return {

      statusCode: 200,
      body: JSON.stringify(result),
      headers: { "Content-Type": "application/json" }

    };

  } catch (err) {

    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };

  }
};