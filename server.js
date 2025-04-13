const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  mobile_no: String,
  gmail: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { name, age, mobile_no, gmail, password } = req.body;
  try {
    const newUser = new User({ name, age, mobile_no, gmail, password });
    await newUser.save();
    res.status(200).send('User Registered');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  const { gmail, password } = req.body;
  const user = await User.findOne({ gmail, password });
  if (user) {
    res.send('Login Successful');
  } else {
    res.status(401).send('Invalid Credentials');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

