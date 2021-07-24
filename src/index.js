const express = require("express");
const cors = require('cors');

const { v4: uuid4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());


const repositories = [];

function checksIfRepositorieExists(request, response, next) {
  const { title } = request.headers;

  const repository = repositories.find( (repository) => repository.title === title );

  if (!repository) {
    return response.status(400).json(" error: Repositorie don't found");
  }

  request.repository = repository;

  return next();
}

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorieExists = repositories.find( (repository) => repository.title === title );

  if (repositorieExists) {
    return response.status(400).json(" error: Repository already exists ");
  }

  const repository = {
    id: uuid4(),
    title,
    url,
    techs: [],
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
}); 

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.put("/repositories/:id", checksIfRepositorieExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checksIfRepositorieExists, (request, response) => {
  const { repository } = request;
  const repositoryIndex = repositories.indexOf(repository);
  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id", checksIfRepositorieExists, (request, response) => {
  const { repository } = request;
  
  return response.json(++repository.likes);
});

module.exports = {
  app,
  checksIfRepositorieExists
};

