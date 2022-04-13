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

// app.get('/api/notes/:id', async(req, res, next)=> {
//   try {
//     const token = req.headers.authorization;
//     console.log('GET !!TOCKEN:', token);
//     const user = await User.byToken(token);
//     const userNotes = await Note.findByPk(req.params.id);
//     console.log(userNotes);
//     res.send(userNotes);
//   }
//   catch(ex){
//     next(ex);
//   }
// });

app.delete('/api/notes/:id', async(req, res, next) => {
  try {
    // console.log('ID ID ID ID!!!', req.headers);
    const token = req.headers.authorization;
    // console.log('DELETE!!!! TOCKEN:', token);
    const user = await User.byToken(token);
    const userNote = await Note.findByPk(req.params.id);
    // console.log(userNote);
    await userNote.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/notes', async(req, res, next) => {
  try {
    // console.log('POST POST POST!!!', req.body, req.headers);
    const token = req.headers.authorization;
    const user = await User.byToken(token);

    const newNote = await Note.create({ ...req.body, userId: user.id });
    // console.log('POST POST NEWNOTE!!!', newNote);
    res.status(201).send(newNote);
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
