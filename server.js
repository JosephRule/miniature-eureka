const fs = require('fs');
const path = require('path');
const express = require('express');

const generateUniqueId = require('generate-unique-id');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let results = JSON.parse(data)
        res.json(results)
    })
});

app.post('/api/notes', (req, res) => {
    req.body.id = generateUniqueId();

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(req.body);
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated reviews!')
            );
        }
    });
    const response = {
      status: 'success',
      body: req.body,
    };

    res.json(response);

});


app.delete('/api/notes/:id', (req, res) =>
    console.log("deleted")
);

