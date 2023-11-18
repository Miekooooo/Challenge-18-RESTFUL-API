const { connect, connection } = require('mongoose');

// Define the MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Challenge-18-RESTFUL-API';

// Connect to MongoDB
connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Event listeners for the MongoDB connection
connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Gracefully close the MongoDB connection when the Node process is terminated
process.on('SIGINT', () => {
  connection.close(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});