const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note }} = require('./db');
const path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async(req, res, next)=> {
  try {
    res.send({ token: await User.authenticate(req.body)});
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth', async(req, res, next)=> {
  try {
    const token = req.headers.authorization;
    // console.log('HEADER HEADER HEADER in AUTH!!!', token);
    // Verify if the token matches the user,
    // If yes, send back the user profile to the browser.
    res.send(await User.byToken(token));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/notes', async(req, res, next)=> {
  try {
    const token = req.headers.authorization;
    // console.log('HEADER HEADER HEADER!!!', token);
    const user = await User.byToken(token);
    // console.log('USER HERE!!!', user.username);
    const userNotes = await Note.findAll({
      where: {
        userId: user.id
      }
    });
    // console.log(userNotes);
    res.send(userNotes);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
