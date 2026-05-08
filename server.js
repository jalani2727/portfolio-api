import Fastify from "fastify";
import cors from "@fastify/cors";
import { db } from "./src/db.js";

// The { logger: true } option tells Fastify to print readable logs to your terminal
const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGIN,
})

// Declare a route
// putting a /health route is good practice for monitoring the status of a server
fastify.get('/health', async (req, res) => {
  return { status: 'ok' }
})

// Make a schema to check if the body has a name, email address, optional phone numner, and a message like you defined on the frontend
const formRequestSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'message'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      message: { type: 'string', minLength: 5 }
    }
  }
}
fastify.post('/contact', { schema: formRequestSchema }, async (request, reply) => {
  let formData = request.body;

  try {
    await db
      .insertInto('submissions')
      .values({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      })
      .execute();

    // fastify.log.info({ formData }, 'Form Data arrived!');
    return { status: 'form submitted' }

  } catch (error) {
    reply.code(500);
    fastify.log.error(error);
    return { status: 'There was an error in submitting the form.' }
  }
})

// Run the server
const myServer = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
myServer();

