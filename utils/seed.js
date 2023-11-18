const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thought');
const data = require('./data');

mongoose.connect('mongodb://localhost:27017/Challenge-18-RESTFUL-API', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', async () => {
  console.log('Connected to MongoDB for seeding');

  // Clear existing data
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Seed users
  const seededUsers = await User.create(data.users);

  // Seed thoughts with associated users
  const thoughtsWithUsers = data.thoughts.map(thought => {
    const user = seededUsers.find(user => user.username === thought.username);
    thought.userId = user._id;
    return thought;
  });

  await Thought.create(thoughtsWithUsers);

  console.log('Database seeded successfully');
  mongoose.connection.close();
});