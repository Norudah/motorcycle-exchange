# MOTORCYCLE-EXCHANGE

## Requirements :

- Having Docker and docker-compose installed locally
- Having node 18 installed locally if you run the client (react.js) locally
- Knowing the _.env_ data to put in it

## How to run :

1. Create _.env_ files base on _.env.example_ inside the /client and /api folders and complete them.

<br>

2. Then, you have too choose between the 2 options below :
   <br>
   - **Option 1** (recommanded) : Run backend with docker and client locally
   - **Option 2** : Run the full stack with docker. But this one is very slow about loading the frontend, so you will have to wait a few minutes before using it (5-15 minutes depending on your machine)

If you choose **Option 1**, run :

```bash
make turboinstall
```

---

If you choose **Option 2**, you have to first to uncomment the folling lines in _docker-compose.yaml_

```bash
  client:
    build: ./client
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
    command: sh -c "npm install && npm run dev"
    stdin_open: true
    tty: true
```

Then build the project with :

```bash
make build
```

And run :

```bash
make start
```

3.  Go to http://localhost:5173

You can connect to the client with the follogins accounts :

**Users** :
email : user1@test.com / user2@test.com
password : azerty
features :

- [x] Join a chatRooom
- [ ] Request a concelor to discuss with him
- [x] Send messages inside chatRooms
- [ ] Send private messages to a concelor
- [ ] Discuss with the chatbot
- [x] Get notified at anytime

---

**Admin** :
email : admin@test.com
password : azerty
features :

- [x] All the user features
- [x] Manage chatrooms
- [ ] Accept / Refuse requests from users
- [x] Dispatch commercial message to all connecter users

## Usefull commands :

### Quick start :

- `make turboinstall` : Install client and API, prisma dependencies, create the database structure and fill it with data. And finally launch it (**Option 1**)
- `make turbostart` : Start the API with docker and client with Node installed locally (**Option 1**)

---

### Docker start and stop commands :

- `make start` : Start the project with docker (**Option 2**)
- `make stop` : Stop the project with docker
- `make down` : Stop the project and removes the associated containers with docker

---

### Docker build commands :

- `make build` : Build the project with docker (**Option 2**)
- `make buildAPI` : Build the API
- `make buildAndRunClient` : Build the client and run it
- `make init` : Install the project dependencies for prisma

---

### Executions commands :

The following commands need to project to be run in order for them to be executed inside the related docker container :

- `make reset` : Reset the database
- `make seed` : Fill the database with some data to play with
- `make migrate` : Execute all the migrations until the last is reached
- `docker compose exec api npx prisma {your prisma command here}` : Run a specific command of prisma CLI, which is a tool for interacting with the database (see the [documentation](https://www.prisma.io/docs/reference/api-reference/command-reference) for more information and usage)
