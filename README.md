# predictx
This is a game predictions app
which also rewards!

keep guessing!

## Fresh Setup

Follow these steps on a new machine:

1. Clone the project


2. Build and start Docker services:
    npm start
    or
    docker compose up --build


5. Run shared migrations from Docker:
   docker compose run --rm api node /app/shared/migrate.js

6. API should now be available at:
   - `http://localhost:3000`

7. Optional monitoring tools:
   - pgAdmin: `http://localhost:5050`
   - Redis Commander: `http://localhost:8081`

## Notes