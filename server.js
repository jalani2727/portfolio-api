import Fastify from "fastify";


// The { logger: true } option tells Fastify to print readable logs to your terminal
const fastify = Fastify({ logger: true });

// Declare a route
// putting a /health route is good practice for monitoring the status of a server
fastify.get('/health', async (req, res) => {
  return { status: 'ok' }
})

// Make a schema to check if the body has a name, email address, optional phone numner, and a message
const formSchema = {
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
fastify.post('/contact', { schema: formSchema }, async (request, response) => {
  let formData = request.body;
  fastify.log.info({ formData }, 'Form Data arrived!');
  return { status: 'form data arrived' }
})

// Run the server
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}



// // This route responds to POST requests at "/contact".
// // POST is the HTTP method browsers use when submitting form data.
// // When your form sends data, this function will run.
// fastify.post('/contact', async (request, reply) => {
//   // request.body contains the data the form sent (name, email, phone, message)
//   console.log('Form data received:', request.body);

//   // For now, just send back a confirmation that we received something.
//   // Later, this is where we'll save to the database and send an email.
//   return { success: true, message: 'Form data received' };
// });

// // This function actually starts the server and tells it which port to listen on.
// // Port 3000 is a convention for local development — it means the server
// // is reachable at http://localhost:3000 on your machine.
// const startServer = async () => {
//   try {
//     await fastify.listen({ port: 3000, host: '0.0.0.0' });
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// startServer();

// Baby's first server:


// const http = require('http');
// const url = require('url');


// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true)
//   if (parsedUrl.pathname === '/') {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write('yerr, ');
//     res.end('son');
//   } else if (parsedUrl.pathname === '/deadass') {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write('dead');
//     res.end('ass, son');
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end();
//   }

// })

// server.listen(3000);