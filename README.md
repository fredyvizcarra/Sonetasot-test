# Sonetasot - Appointment Management Application - Angular

## Description
This project involves developing an appointment management application using Angular and Node.js. Each appointment is registered using CURP (a unique identifier in Mexico). The application implements full CRUD operations and necessary validations to ensure data integrity. PostgreSQL is used as the database, and the project is dockerized for easy deployment.

## Business Features
- **Appointment Registration with CURP:** Each appointment must be registered using CURP as a unique identifier, ensuring the uniqueness of the record.
- **Appointment Validations:** Validations to ensure that each CURP can only have one active appointment, allowing new appointments only if the previous appointment date is in the past.
- **User Management:** When a new CURP is registered, a user associated with that CURP is automatically created. This user has permissions to delete their own appointment using middleware to manage permissions.
- **User Interface:** A user-friendly and accessible interface for managing appointments. For this technical test, only the initial view for CURP registration has been developed. Future views will be added as needed.
- **Access and Privacy:** Authentication and authorization functionalities to ensure that users can only manage their own appointments.

## Technical Features
- **RESTful API:** API developed with Node.js and Express allowing full CRUD operations (Create, Read, Update, Delete) on appointments.
- **PostgreSQL Database:** Utilization of PostgreSQL as the database management system to ensure data persistence and consistency.
- **Dockerization:** Docker containers for both backend and database, with a `docker-compose.yml` file for easy deployment and management of the project.
- **Frontend with Angular and TailwindCSS:** Frontend application developed with Angular, using Tailwind CSS for responsive and modern design.
- **JWT Authentication:** Implementation of JSON Web Token (JWT) based authentication to ensure that only authenticated users can access and modify their appointments.
- **CURP Validation:** CURP validation using regular expressions to ensure correct data entry.

## Requirements
- Node.js 
- Docker
- Docker Compose

## Installation and Usage
### Local Development
1. Clone the repository:
    ```sh
    git clone https://github.com/fredyvizcarra/Sonetasot-test.git
    ```
2. Navigate to the project folder:
    ```sh
    cd Sonetasot-test
    ```
3. Install dependencies for both frontend and backend:
    ```sh
    cd frontend
    npm install
    cd ../backend
    npm install
    ```
4. Run Docker Compose to start the services:
    ```sh
    docker-compose up --build
    ```

### Production Deployment
1. Ensure Docker and Docker Compose are installed on your server.
2. Run Docker Compose:
    ```sh
    docker-compose up -d
    ```

## Database
- PostgreSQL is used as the database management system.
- The database configuration can be found in the `docker-compose.yml` file.

## Dockerization
- Provides a `Dockerfile` and a `docker-compose.yml` file for easy project deployment.

## API Endpoints
- **GET** `/api/appointments`: List all appointments.
- **GET** `/api/appointments/:id`: Get details of a specific appointment.
- **POST** `/api/appointments`: Create a new appointment.
- **PUT** `/api/appointments/:id`: Update an existing appointment.
- **DELETE** `/api/appointments/:id`: Delete an appointment.


## Authentication
This API uses JWT (JSON Web Token) for authentication. The token must be included in the `Authorization` header as a Bearer token for the protected routes.

## Endpoints

### List All Appointments

- **URL**: `/appointments`
- **Method**: `GET`
- **Description**: Retrieves a list of all appointments.
- **Request**: No parameters required.
- **Response**:
  - **200 OK**: Returns an array of appointment objects.
  
  ```json
  [
    {
      "id": 1,
      "curp": "SOME_CURP",
      "date": "2024-06-23"
    }
  ]

### Get Appointment Details

- **URL**: `/appointments/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific appointment.
- **Request**: 
  - **URL Parameters**: `id` (integer) - The ID of the appointment.
- **Response**:
  - **200 OK**: Returns the appointment object.
  - **404 Not Found**: If the appointment does not exist.
  
  ```json
  {
    "id": 1,
    "curp": "SOME_CURP",
    "date": "2024-06-23"
  }
  ```

### Create a New Appointment

- **URL**: `/appointments`
- **Method**: `POST`
- **Description**: Creates a new appointment.
- **Request**:
  - **Body Parameters**:
    - `curp` (string) - The CURP of the person.
  - **Headers**:
    - `Content-Type: application/json`
- **Response**:
  - **200 OK**: Returns the created appointment object, associated user, and token.
  - **400 Bad Request**: If the CURP is invalid or if there is an existing appointment in the future.
  - **500 Internal Server Error**: If there is a server error.
  
  **Example Request Body**:
  ```json
  {
    "curp": "SOME_CURP"
  }
  ```
  
 **Example Response**:
  ```json
  {
    "appointment": {
      "id": 1,
      "curp": "SOME_CURP",
      "date": "2024-06-23"
    },
    "user": {
      "id": 1,
      "curp": "SOME_CURP"
    },
    "token": "JWT_TOKEN"
  }
  ```
### Update an Appointment

- **URL**: `/api/appointments/:id`
- **Method**: `PUT`
- **Description**: Updates an existing appointment.
- **Request**:
  - **URL Parameters**:
    - `id` (integer) - The ID of the appointment to update.
  - **Body Parameters**:
    - `date` (string) - The new date for the appointment (format: YYYY-MM-DD).
  - **Headers**:
    - `Content-Type: application/json`
    - `Authorization: Bearer <JWT_TOKEN>`
- **Response**:
  - **200 OK**: Returns the updated appointment object.
  - **400 Bad Request**: If the new date is already occupied by another appointment.
  - **403 Forbidden**: If the user is not authorized to update the appointment.
  - **404 Not Found**: If the appointment does not exist.
  - **500 Internal Server Error**: If there is a server error.
  
  **Example Request Body**:
  ```json
  {
    "date": "2024-06-24"
  }
  ```
  **Example Response**:
  ```json
  {
  "id": 1,
  "curp": "SOME_CURP",
  "date": "2024-06-24"
  }
  ```

### Delete an Appointment

- **URL**: `/api/appointments/:id`
- **Method**: `DELETE`
- **Description**: Deletes an existing appointment.
- **Request**:
  - **URL Parameters**:
    - `id` (integer) - The ID of the appointment to delete.
  - **Headers**:
    - `Authorization: Bearer <JWT_TOKEN>`
- **Response**:
  - **204 No Content**: If the appointment was successfully deleted.
  - **403 Forbidden**: If the user is not authorized to delete the appointment.
  - **404 Not Found**: If the appointment does not exist.
  - **500 Internal Server Error**: If there is a server error.

  **Example Request**:
  ```bash
  DELETE /api/appointments/1
  Authorization: Bearer YOUR_JWT_TOKEN
  ```

## ER Diagram
[![](https://mermaid.ink/img/pako:eNqVULsOgzAM_JXIM_wAW6UyVBUUFbpUWSySQtSSIJMMFfDvJaQPVerSG2z5dPLZN0JthIQEJG0VNoQd12zBqUyPJRvD4KG0ZUqwYv-hBktKN6x21AdyDi3UTVEcdnmVpXn19yIPgVau5cfucN00xbEZv4wSxqHFgQPXEEEnqUMllu9Wfw62lZ3k4FUC6epl86JDZ0151zUklpyMgIxrWkgueBuWyfX-imc6b1YKZQ1lIbw1wwh61GdjXpr5AdwRaMM?type=png)](https://mermaid.live/edit#pako:eNqVULsOgzAM_JXIM_wAW6UyVBUUFbpUWSySQtSSIJMMFfDvJaQPVerSG2z5dPLZN0JthIQEJG0VNoQd12zBqUyPJRvD4KG0ZUqwYv-hBktKN6x21AdyDi3UTVEcdnmVpXn19yIPgVau5cfucN00xbEZv4wSxqHFgQPXEEEnqUMllu9Wfw62lZ3k4FUC6epl86JDZ0151zUklpyMgIxrWkgueBuWyfX-imc6b1YKZQ1lIbw1wwh61GdjXpr5AdwRaMM)

## Contribution
Contributions are welcome. Please open an issue to discuss any major changes before submitting a pull request.

## License
This project is licensed under the MIT License.
