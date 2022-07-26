const express = require('express');
const path = require('path');
const notes = require('./db/notes.json')
const fs = require('fs')
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
    
app.get('/api/notes', (req, res) => {
    res.json(notes)
    console.info(`${req.method} request received to get reviews`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    const { title, text } = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      notes.push(newNote)
    fs.writeFile('./db/notes.json',JSON.stringify(notes, null, 4),(writeErr) =>
        writeErr ? console.error(writeErr) : console.info('Successfully updated reviews!')
    );
    res.send(notes)
    }
    });

app.delete('/api/notes/:id', (req, res) => {
    var id = req.params.id
    var note = notes.map((notes)=> {return notes.id})
    var selected = note.indexOf(id)
    notes.splice(selected, 1)
    fs.writeFile('./db/notes.json',JSON.stringify(notes, null, 4),(writeErr) =>
              writeErr ? console.error(writeErr) : console.info('Successfully updated reviews!')
          );
    res.json({})
})

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);