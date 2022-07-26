const express = require('express');
const path = require('path');
const notes = require('./db/db.json')
const fs = require('fs')
const uuid = require('./helpers/uuid');

const PORT = 3001;

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

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
          fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),(writeErr) =>
              writeErr ? console.error(writeErr) : console.info('Successfully updated reviews!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in posting notes');
    }
  });
  

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);