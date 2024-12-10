FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3
ENV PATH="/root/.local/bin:$PATH"

COPY pyproject.toml poetry.lock alembic.ini /app/

RUN poetry install --no-root


ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=app/


CMD ["sh", "-c", " cd app/ && poetry run uvicorn app:app --host 0.0.0.0 --reload --port 8000"]