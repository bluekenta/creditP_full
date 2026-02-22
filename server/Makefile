start:
	docker compose up

start-clean:
	docker compose up --no-deps --build --renew-anon-volumes --force-recreate

clean:
	rm -rf node_modules/*

update:
	make clean
	rm -f package-lock.json
	npm install

test:
	npm test

docker-clean:
	docker compose down	-v --rmi all
	docker volume prune -f
