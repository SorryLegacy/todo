DOCKER_COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yaml
NAME ?= Autogenerate migration

.PHONY: up-all up-all-build down-all logs-all lint-frontend lint-backend lint-all create-migration downgrade-migration upgrade-head

up-all:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d

up-all-build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --build

create-migration:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend poetry run alembic revision --autogenerate -m "$(NAME)"

downgrade-migration:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend poetry run alembic downgrade -1

upgrade-head:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend poetry run alembic upgrade head

down-all:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

logs-all:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f

lint-frontend:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec frontend npx eslint . --ext .js,.jsx,.ts,.tsx --fix

lint-backend:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend poetry run ruff check --fix

lint-all: lint-frontend lint-backend
