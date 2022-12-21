turbostart: build start init

build:
	docker compose build --pull --no-cache

init: start
	docker compose exec api npx prisma migrate dev

start:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down