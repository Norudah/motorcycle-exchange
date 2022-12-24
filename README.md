# MOTORCYCLE-EXCHANGE

## Requirements :

- Docker and docker-compose installed locally
- Knowing the _.env_ data

## How to run :

1. Create _.env_ files base on _.env.example_ inside the /client and /api folders and complete them.
2. Run `make turboinstall` to install the project dependencies and launch it
3. Go to http://localhost:5173

## Usefull commands :

- `make start` : Start the API side
- `make stop` : Stop the API side
- `make down` : Stop the project and removes the associated containers
- `make buildAPI` : Build the API side
- `make buildClient` : Build the client side
- `make init` : Install the project dependencies for prisma
- `make turbostart` : Start Client and API side
- `make turboinstall` : Install Client and API side , prisma dependencies and launch it
- `docker compose exec api npx prisma {your prisma command here}` : Run a specific command of prisma CLI, which is a tool for interacting with the database (see the [documentation](https://www.prisma.io/docs/reference/api-reference/command-reference) for more information and usage)
