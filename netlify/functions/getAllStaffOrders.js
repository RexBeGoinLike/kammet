import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();

  try {
    const result = await sql`
      SELECT * FROM "order" 
      ORDER BY 
        CASE 
          WHEN status IN ('Pending', 'Preparing', 'Ready') THEN 1
          ELSE 2
        END,
        timestamp DESC
    `;

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