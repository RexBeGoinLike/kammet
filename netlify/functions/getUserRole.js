import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();
  const { email } = event.queryStringParameters;

  try {
    const [user] = await sql`
      SELECT role FROM "user" WHERE email = ${email}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        role: user?.role || 'customer'
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