const express = require('express');
const uniqid = require('uniqid');
const app = express();
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const createNewNote = (note, id) => {
    const newNote = {
        title: note.title,
        text: note.text,
        id: id
    };

    notes.push(newNote);

    fs.writeFileSync(
        path.join(__dirname + "/db/db.json"),
        JSON.stringify({ notes: notes }, null, 2)
    )
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.post('/api/notes', ({ body }, res) => {
    const id = uniqid();
    createNewNote(body, id);
    res.send("success");
})

app.delete('/api/notes/:id', (req, res) => {
    let noteToRemoveIndex;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === req.params.id) {
            noteToRemoveIndex = i;
        }
    }

    if (!noteToRemoveIndex) {
        res.status(404).send("Not Found");
        return;
    }

    notes.splice(noteToRemoveIndex, 1);
    fs.writeFileSync(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify({ notes: notes }, null, 2)
    )
    res.status(200).send("success");
})

app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
})