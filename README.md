# Ocelot API Gateway

This project is an implementation of an API Gateway using the Ocelot library. The API Gateway provides a single entry point for client applications and routes requests to appropriate microservices. It also handles tasks such as authentication and load balancing.

This API Gateway is part of a larger project that includes other microservices. The other components of the project can be found at the following links:
 - [Auth.MicroService](https://github.com/duartefernandes/Auth.MicroService)
 - [Vehicles.MicroService](https://github.com/duartefernandes/Vehicles.MicroService)
 - [Routes.MicroService](https://github.com/Rafa26Azevedo/Routes.MicroService)

## Setup (with Docker)

1. Clone the repository to your local machine.

2. Rename the `.env.example` file to `.env` and replace the placeholder values with your actual data. Here's what each environment variable is used for:

    - `SQL_SERVER_CONNECTION_STRING`: The connection string for your SQL Server database.
    - `SA_PASSWORD`: The password for the 'sa' user in your SQL Server database.
    - `MONGO_INITDB_ROOT_USERNAME`: The root username for your MongoDB database.
    - `MONGO_INITDB_ROOT_PASSWORD`: The root password for your MongoDB database.
    - `MONGO_URI_ROUTES`: The MongoDB URI for the routes microservice.
    - `MONGO_URI_VEHICLES`: The MongoDB URI for the vehicles microservice.
    - `OPENROUTESERVICE_API_URL`: The URL for the OpenRouteService API.
    - `OPENROUTESERVICE_API_KEY`: Your OpenRouteService API key.
    - `VEHICLE_MICROSERVICE_API_URL`: The URL for the vehicles microservice.
    - `AUTH_MICROSERVICE_API_URL`: The URL for the authentication microservice.
    - `JWT_PUBLIC_KEY`: Your JWT public key.
    - `SERVICE_SECRET_KEY`: Your service secret key.
    - `SMTP_PASSWORD`: Your SMTP password.
    - `AUTH_MICROSERVICE_HOST`: The hostname for the authentication microservice.
    - `AUTH_MICROSERVICE_PORT`: The port for the authentication microservice.
    - `VEHICLES_MICROSERVICE_HOST`: The hostname for the vehicles microservice.
    - `VEHICLES_MICROSERVICE_PORT`: The port for the vehicles microservice.
    - `ROUTES_MICROSERVICE_HOST`: The hostname for the routes microservice.
    - `ROUTES_MICROSERVICE_PORT`: The port for the routes microservice.

3. Navigate to `ais_project` folder and run the Docker Compose file to start all the services:

    ```bash
    docker-compose up -d
    ```

This will start all the microservices defined in the `docker-compose.yml` file, including the Ocelot API Gateway. You can then access the API Gateway at the specified host and port.

## Disclaimer

This project is part of a master's degree project and is intended for educational purposes only. It should not be used in production without further development and testing.
