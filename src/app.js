const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository id.' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexRepository = repositories.findIndex(repo => repo.id === id);

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[indexRepository].title = title;
  repositories[indexRepository].url = url;
  repositories[indexRepository].techs = techs;

  return response.json(repositories[indexRepository]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repo => repo.id === id);

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(indexRepository, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repo => repo.id === id);
  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[indexRepository].likes = repositories[indexRepository].likes + 1;

  return response.json(repositories[indexRepository]);
});

module.exports = app;
