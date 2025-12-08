import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();
  const { id } = event.queryStringParameters;

  try {
    const [order] = await sql`
      SELECT * FROM "order" WHERE id = ${id}
    `;

    const items = await sql`
      SELECT * FROM orderitem WHERE orderid = ${id}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        order,
        items 
      }),
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