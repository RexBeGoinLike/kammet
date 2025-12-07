import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();
  const { id } = event.queryStringParameters

  try {
    
    const result = await sql(`SELECT * FROM FOODITEM WHERE storeid = ${id}`);

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