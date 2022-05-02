const express = require('express')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const port = process.env.port || 3001;

const data = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// ======= ROUTES

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        } else {
            const notes = JSON.parse(data)
            res.send(notes);
        }
    })
});

app.post('/api/notes', (req, res) => {
    // reading json file with fs
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        } else {
            // assigning json data to const, have to parse to be readable
            const notes = JSON.parse(data)
            // assigning data object a random ID and what user inputs
            const newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uuidv4()
            }
            // pushing new note into notes object
            notes.push(newNote);
            // turning data object into string so that we can display to user
            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err, data) => {
                if (err) {
                    throw err;
                } else {
                    res.send(notes);
                }
            })
        }
    })
})

app.delete('/api/notes/:id', (req, res) => {
    // grabbing json data
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        } else {
            // same as above
            const notes = JSON.parse(data)
            let result = notes.filter(function (index) {
                // checking ID for note that needs to be deleted
                console.log(req.params.id);
                if (index.id !== req.params.id) {
                    return true;
                } else {
                    return false;
                }
            })
            // display nothing to user, since the selected note was deleted
            fs.writeFile('./db/db.json', JSON.stringify(result, null, 2), (err, data) => {
                if (err) {
                    throw err;
                } else {
                    res.send({});
                }
            })
        }
    })
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// ======= LISTENER =======
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})