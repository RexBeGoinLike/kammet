import { neon } from '@netlify/neon';

export const handler = async (event) => {
  const sql = neon();

  try {
    const { items, instructions, location, method, storeid, userid } = JSON.parse(event.body);

    const[order] = await sql`
            INSERT INTO "order" (userid, storeid, instructions, location, paymentmethod)
            VALUES (${userid}, ${storeid}, ${instructions}, ${location}, ${method})
            RETURNING id
        `;
    const orderId = order.id;

    for (const item of items) {
      await sql`
        INSERT INTO orderitem (orderid, itemid, subtotal, quantity)
        VALUES (${orderId}, ${item.id}, ${(item.price * item.quantity)}, ${item.quantity});
      `;
    }

    await sql`COMMIT`;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order added successfully"}),
    };
    
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};