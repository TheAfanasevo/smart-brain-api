const express = require('express');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
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
  bycrypt.compare('apples', '$2a$10$qmlFntP.SmBUvflqbTmcHem1bgifXWzAQy6O0ueeIBykXG.qgajji', (err, res) => {
    console.log('first guess', res);
  });
  bycrypt.compare('veggies', '$2a$10$qmlFntP.SmBUvflqbTmcHem1bgifXWzAQy6O0ueeIBykXG.qgajji', (err, res) => {
    console.log('second guess', res);
  })
  if (req.body.email === database.users[0].email) {
    res.json('Success!');
  } else {
    res.status(400).json('Failed!');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bycrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  })

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

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      res.json(user);
    }
  })
  if(!found) {
    res.status(400).json('user not found');
  }
});

app.post('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }
  })
  if(!found) {
    res.status(400).json('user not found');
  }
});

app.listen(process.env.PORT || 3030, () => {
  console.log(`Listening on port ${process.env.PORT || 3030}...`);
});

/* FUNDAMENTAL STEPS/ENDPOINTS
/ --> res = Weldone!
/signin --> POST --> succeeded/failed {body}
/register --> POST --> user object
/profile/:userId --> GET = user
/image --> PUT --> user
*/
