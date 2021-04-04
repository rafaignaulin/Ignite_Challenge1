const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username)

  if(!user) return response.status(404).json({error: " Username not found"})
  
  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  const id = uuidv4();

  const verifyIfUserExists = users.some((user) => user.username === username);

  if(verifyIfUserExists)return response.status(400).json({error: " User already exists"})

  const user = {
    id,
    name,
    username,
    todos: [],
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);

  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  console.log(user);
  const { title, deadline } = request.body;
  const id = uuidv4();

  const todosResponse = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todosResponse);
  
  return response.status(201).json(todosResponse);

  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(t => t.id === id);


  if(!todo) return response.status(404).json({error: "ID not found"})

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);

  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((t) => t.id === id);
  if(!todo) return response.status(404).json({error: "ID not found"})
  
  todo.done = true;

  return response.json(todo);

  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((t) => t.id === id);

  if(!todo) return response.status(404).json({error: "ID not found"})

  user.todos.splice(todo, 1);

  return response.status(204).send();
  // Complete aqui
});

module.exports = app;