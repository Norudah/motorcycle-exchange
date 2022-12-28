start: 
	docker compose up -d 
	
stop:
	docker compose stop

down:
	docker compose down

buildAPI:
	docker compose build --pull --no-cache

buildClient:
	cd client/ && npm i && npm run dev

startClient:
	cd client/ && npm run dev

init: 
	docker compose exec api npx prisma migrate dev

turbostart: start startClient

turboinstall: buildAPI start init buildClient

reset:
	docker compose exec api npx prisma migrate reset