SHELL=/bin/bash
SERVICE_NAME=$(notdir $(shell pwd))
POSTGRES_USER := $(shell grep POSTGRES_USER .env | cut -d '=' -f 2)
POSTGRES_PASSWORD := $(shell grep POSTGRES_PASSWORD .env | cut -d '=' -f 2)
POSTGRES_HOST := $(shell grep POSTGRES_HOST .env | cut -d '=' -f 2)
POSTGRES_PORT := $(shell grep POSTGRES_PORT .env | cut -d '=' -f 2)
POSTGRES_DB := $(shell grep POSTGRES_DB .env | cut -d '=' -f 2)

DATABASE_URL = postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)
export DATABASE_URL


.PHONY: stop-local
stop-dev:
	docker compose down

.PHONY: db-migrate
db-migrate:
	docker compose exec -T app npx prisma migrate dev --name init --schema prisma/schema.prisma

.PHONY: db-file
db-file:
	npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > Deploy/db/init.sql

.PHONY: db-push
db-push:
	docker compose exec -T app npx prisma db push --schema prisma/schema.prisma

.PHONY: run-local
run-local:
	@echo "Starting local development environment..."
	@echo "DATABASE_URL: $(DATABASE_URL)"
	@make db-file
	docker compose up --build -d
	npm run dev

.PHONY: db-generate
db-generate:
	npx prisma generate
