const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next();
};

app.use(cors());
app.use(bodyParser());
app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>');
});

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(n => n.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(n => n.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0;

    return maxId + 1;
}

app.post('/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "missing content"
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);
  res.json(note);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  });
};
app.use(unknownEndpoint);

const port = process.env.port || 3001;
app.listen(port, () => console.log('Server running on port', port));


