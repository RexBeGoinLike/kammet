import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();

  try {
    const { orderId, status } = JSON.parse(event.body);
    
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid status" })
      };
    }

    await sql`
      UPDATE "order" 
      SET status = ${status}
      WHERE id = ${orderId}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Order status updated successfully",
        orderId,
        status 
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