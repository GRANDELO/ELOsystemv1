const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const Joi = require('joi');
//const csurf = require('csurf');
const mongoSanitize = require('mongo-sanitize');
const xssClean = require('xss-clean');
const winston = require('winston');

require('dotenv').config();
require('./worker');

const pushNotificationRoutes = require('./routes/pushNotifications');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const uemployeezRoutes = require('./routes/employee');
const dashboardRoutes = require('./routes/dashboard');
const newproductRoutes = require('./routes/newproductRoutes');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const orderRoute2 = require('./routes/order2');
const locations = require('./routes/locations');
const locationsroutes = require('./routes/locationsroutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const newmpesaRoutes = require('./routes/newmpesaRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const notificationRoutes = require('./routes/notifications');
const financialsRoute = require('./routes/financials');
const coresellRoutes = require('./routes/coresell');
const withdrawRoutes = require('./routes/withdrawRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require("./routes/review");
const feed = require('./routes/feedRoutes');
const agentsroutes = require('./routes/agentsroutes');
const Deliveryroutes = require('./routes/deliveryroutes');


const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const app = express();

app.set('trust proxy', true);
const allowedOrigins = ['https://grandelo.web.app', 'https://baze-link.web.app', 'https://bazelinkadmin.web.app', 'https://baze-seller.web.app', 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true,  // Allow sending cookies from client
};

app.use(helmet({
  contentSecurityPolicy: false,  // Disable this if you're using inline scripts or styles
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: true,
  expectCt: true,
  frameguard: { action: 'deny' },  // Prevent clickjacking
  hidePoweredBy: true,  // Hides 'X-Powered-By' header
  hsts: { maxAge: 31536000, includeSubDomains: true },  // Enforce HTTPS
  noSniff: true,  // Prevent MIME-type sniffing
  xssFilter: true,  // Basic XSS protection
})); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

//for form protection
/*
app.use(
  csurf({
    cookie: {
      sameSite: 'Strict', //prevent CSRF via cross-origin requests
      secure: process.env.NODE_ENV === 'production', // Send cookie only on HTTPS
    },
  }));
*/
//Escape and encode outputs to prevent malicious scripts from running
app.use(xssClean());


app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);
app.use(bodyParser.json());


app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  next();
});

//audit failed login attempts
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
    ),
  transports: [
    new winston.transports.File({ filename: 'audit.log' }),
  ],
});
//environment variable checker
const envSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production').required(),
}).unknown();
const { error } = envSchema.validate(process.env);
if (error) throw new Error(`Environment validation error: ${error.message}`);

//Redirect all traffic to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}



const port = process.env.PORT || 5000;
mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: false, // Disable automatic index creation in production
    tls: true, // Enforces TLS/SSL for secure connections
    tlsAllowInvalidCertificates: false,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uemployeez', uemployeezRoutes);
app.use('/api/dash', dashboardRoutes);
app.use('/api', newproductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order2', orderRoute2);
app.use('/api', productRoutes);
app.use(locations);
app.use(locationsroutes);
app.use('/api/mpesa', mpesaRoutes); 
app.use('/api/newpay', newmpesaRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/financials', financialsRoute);
app.use('/api/coresell', coresellRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/pushnotifications', pushNotificationRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/review", reviewRoutes);
app.use('/api/feedback', feed);
app.use('/api/agent', agentsroutes);
app.use('/api/delivery', Deliveryroutes);


app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

//even this just experiment
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});


io.of('/secure').use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});


io.on('connection', (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const shutdown = () => {
  server.close(() => {
      console.log('Server is shutting down gracefully.');
      mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
      });
  });

  // Force shutdown if the above doesn't work within 10 seconds
  setTimeout(() => {
      console.error('Forcing server shutdown...');
      process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);  // Handle SIGTERM for graceful shutdown
process.on('SIGINT', shutdown);   // Handle Ctrl+C shutdown

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    activeWebSockets: io.engine.clientsCount,  // Number of active WebSocket clients
});
});


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

