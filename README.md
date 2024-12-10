# Todo Application

This repository contains a **Todo Application** built with a **React frontend**, a **FastAPI backend**, and a **PostgreSQL database**. All services are containerized using **Docker Compose**.

---

## Prerequisites

Before running the application, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

---

## Project Structure

```plaintext
.
├── frontend/       # React frontend code
│   ├── Dockerfile  # Dockerfile for the frontend
│   ├── src/        # Source code of the frontend
│   └── .env        # Environment variables for the frontend
├── backend/        # FastAPI backend code
│   ├── Dockerfile  # Dockerfile for the backend
│   ├── app/        # Backend application code
│   └── .env        # Environment variables for the backend
├── docker-compose.yaml  # Docker Compose configuration
├── Makefile        # Makefile for common commands
└── README.md       # This file
```

## Run project 


```bash
cp .env.example .env

# Up witout rebuild 
make up-all

# Up with build 
make up-all-build

# Stop services
make down-all 

```

## Database Migration

```bash 
# Create a New Migration
make create-migration NAME="Migration message"


# Apply All Migrations

make upgrade-head


# Roll Back the Last Migration
make downgrade-migration

```