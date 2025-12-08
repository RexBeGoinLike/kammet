import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();

  try {
    const { orderId, userId } = JSON.parse(event.body);

    const [order] = await sql`
      SELECT * FROM "order" WHERE id = ${orderId} AND userid = ${userId}
    `;

    if (!order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found or unauthorized" })
      };
    }

    if (order.status !== 'Pending') {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "Cannot cancel order. Only pending orders can be cancelled." 
        })
      };
    }

    await sql`
      UPDATE "order" 
      SET status = 'Cancelled'
      WHERE id = ${orderId} AND userid = ${userId}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Order cancelled successfully",
        orderId: orderId
      }),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};