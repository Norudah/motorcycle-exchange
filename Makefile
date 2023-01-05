start: 
	docker compose up -d 
	
stop:
	docker compose stop

down:
	docker compose down

buildAPI:
	docker compose build --pull --no-cache

build:
	docker compose build --pull --no-cache

buildAndRunClient:
	cd client/ && npm i && npm run dev

startClient:
	cd client/ && npm run dev

migrate:
	docker compose exec api npx prisma migrate dev

init: migrate seed

turbostart: start startClient

turboinstall: buildAPI start init buildAndRunClient

reset:
	docker compose exec api npx prisma migrate reset

seed:
	docker compose exec api npx prisma db seed