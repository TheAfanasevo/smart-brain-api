const express = require('express');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { handler: regHandler } = require('./controllers/register');
const { handler: signInHandler } = require('./controllers/signin');
const { handler: getProfile } = require('./controllers/getProfile');
const { handler: putImage, callApi } = require('./controllers/putImage');

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

app.get('/', (req, res) => res.json(database.users));
app.post('/signin', signInHandler(bycrypt, db));
app.post('/register', (req, res) => { regHandler(req, res, bycrypt, db) });
app.get('/profile/:id', (req, res) => { getProfile(req, res, db) });
app.put('/image', (req, res) => { putImage(req, res, db) });
app.post('/imageurl', (req, res) => { callApi(req, res) });

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
