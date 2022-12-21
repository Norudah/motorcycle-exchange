# MOTORCYCLE-EXCHANGE

## Requirements :

- Docker and docker-compose installed locally
- Knowing the _.env_ data

## How to run :

1. Create _.env_ files base on _.env.example_ inside the /client and /api folders and complete them.
2. Run `make init` to install the project dependencies and launch it
3. Make `cd client/` and run `npm i && npm run dev`
4. Go to http://localhost:5173

## Usefull commands :

- `make start` : Start the project
- `make stop` : Stop the project
- `make down` : Start the project and removes the associated containers
- `docker compose exec api npx prisma {your prisma command here}` : Run a specific command of prisma CLI, which is a tool for interacting with the database (see the [documentation](https://www.prisma.io/docs/reference/api-reference/command-reference) for more information and usage)
