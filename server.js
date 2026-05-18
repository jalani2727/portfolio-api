import Fastify from "fastify";
import cors from "@fastify/cors";
import { db } from "./src/db.js";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domainEmail = 'noreply@jalanipaul.work';
const myEmail = 'jalani2727@gmail.com';

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
      message: { type: 'string', minLength: 5 },
      website: { type: 'string' },
    }
  }
}
fastify.post('/contact', { schema: formRequestSchema }, async (request, reply) => {
  let formData = request.body;
  
  if (formData.website) {
    return { status: 'Form Submitted' }
  }

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
    // Send a Notification Email to myself
    await resend.emails.send({
      from: domainEmail,
      to: myEmail,
      subject: 'jalanipaul.work - Someone is trying to reach you through your portfolio',
      html: `<p>${formData.name} is trying to get in contact with you.</p>
      <p>Email: ${formData.email}</p>
      <p>Phone: ${formData.phone ? formData.phone : 'n/a'}</p>
      <p>Message: ${formData.message}</p>`
    })
    // Send a Notification Email to the user
    await resend.emails.send({
      from: domainEmail,
      to: formData.email,
      subject: 'Thank you for reaching out to me - 🍻',
      html: `<p>Hello, ${formData.name} and thank you for taking a look through my portfolio!</p>
      <p>I'll be sure to reach back out to you as soon, as possible.</p>
      <p>Best,</p>
      <p>Jalani</p>`
    })
    // fastify.log.info({ formData }, 'Form Data arrived!');
    return { 
      status: 'Form Submitted',
      submitted: true,
     }

  } catch (error) {
    reply.code(500);
    fastify.log.error(error);
    return { status: 'There was an error in submitting the form.' }
  }
})

// Run the server
const myServer = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
myServer();

