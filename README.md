# EducationalPlan

## Development server
To start the backend app: `npx nx run educational-plan:serve`.
To start the frontend app: `npx nx run educational-plan-frontend:serve`.


## Build for production (using Docker)
Run the following commands: 
```
docker build . -t educational-plan:nx-base
docker-compose build
docker-compose up -d
```
