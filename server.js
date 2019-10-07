const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    }
  ]
}

app.get('/', (req, res) => {
  res.send('Welldone!');
});

app.get('/users', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email) {
    res.json('Success!');
  } else {
    res.status(400).json('Failed!');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  database.users.push({
    id: '125',
    email: email,
    name: name,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(database.users[database.users.length - 1]);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}...`);
});

/* FUNDAMENTAL STEPS/ENDPOINTS
/ --> res = Weldone!
/signin --> POST --> succeeded/failed {body}
/register --> POST --> user object
/profile/:userId --> GET = user
/image --> PUT --> user
*/