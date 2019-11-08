const Clarifai = require('clarifai');

const app = new Clarifai.App({ apiKey: '87000629ff284ea4a6155a1d2f28b2d1' });

const callApi = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      return res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handler = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    return res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  callApi,
  handler
}