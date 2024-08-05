// Import Express.js
const express = require('express');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');


// Static middleware pointing to the public folder
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const notesFilePath = path.join(__dirname, 'db', 'db.json');

// get notes from the json
app.get('/api/notes', (req, res) => {
  readFromFile(notesFilePath)
  .then((data) => res.json(JSON.parse(data)))
  .catch((err) => res.status(500).json(err))
});

// adds note to db.json and checks length of the array then assigns a number id based o it's position
app.post('/api/notes', (req, res) => {
const newNote = req.body;

readFromFile(notesFilePath)
.then((data) => {
  const notes =  JSON.parse(data);
  // assigns the id to the new note by taking the length of notes -1 to get to first item and checking if there are any notes yet and if there are, incrementing to get the id of the next note
  newNote.id = notes.length ? notes[notes.length-1].id + 1 : 1;
  // reads the notes and adds the new one to db.json then res's to show the new one
  readAndAppend(newNote, notesFilePath);
  res.json(newNote);
})
});

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'db/db.json'))
);

app.post('/api/notes', (req, res) => {
  console.log(req.body)
}
);

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
