const express = require('express');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '123456',
    database: 'smartbrain'
  }
});

db
  .select('*')
  .from('users')
    .then(data => console.log(data));


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

  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json(err.detail));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db
  .select('*')
  .from('users')
  .where({id})
  .then(user => {
    if(user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('Not found')
    }
  })
  .catch(err => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries)
  })
  .catch(err => res.status(400).json('Unable to fetch entries'));
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
