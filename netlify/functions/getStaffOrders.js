import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();

  try {
    const result = await sql`
      SELECT * FROM "order" 
      WHERE status IN ('Pending', 'Preparing', 'Ready')
      ORDER BY 
        CASE 
          WHEN status = 'Pending' THEN 1
          WHEN status = 'Preparing' THEN 2
          WHEN status = 'Ready' THEN 3
          ELSE 4
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