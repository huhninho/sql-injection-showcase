# SQL Injection Demonstration App

## Overview

This application is designed to demonstrate the dangers of SQL injection and how it can be prevented. SQL injection is a
type of attack where malicious SQL code is inserted into an input field to manipulate or exploit the underlying
database. This demo app allows users to see the effects of a SQL injection and emphasizes the importance of using secure
coding practices.

## Setting Up

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js:** Required to run the server-side application.
- **npm (Node Package Manager):** Used to install dependencies.
- **Docker:** Needed for running the PostgreSQL database in an isolated environment.

### Installation

Follow these steps to set up the environment and dependencies for running the application:

1. **Install Node.js Dependencies**:  
   Run the following command to install the necessary Node.js packages such as `express` for the server framework
   and `pg` for interfacing with PostgreSQL:
   ```bash
   npm install express pg
   ```

2. **Set Up and Run PostgreSQL Using Docker**:  
   Use Docker to run the PostgreSQL database. Ensure you are in the project directory where your `docker-compose.yml`
   file is located before running the following command. This will start the PostgreSQL service as defined in your
   Docker configuration:
   ```bash
   docker compose up
   ```

Make sure Docker is installed and running on your machine before attempting to start the PostgreSQL service.

### Create the Table and Add Initial Data

Run the following SQL commands to set up your database:

```sql
CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password)
VALUES ('admin', 'password');
```

### Running the Application

Follow these steps to start and access the application:

1. **Start the Server**:  
   Open a terminal and run the following command to start the application server. This command executes
   the `sql-injection-app.js` file using Node.js:
   ```bash
   node sql-injection-app.js
   ```

2. **Access the Application UI**:  
   Once the server is running, open a web browser and navigate to the following URL to access the application's user
   interface:
   ```plaintext
   http://localhost:3001
   ```

Ensure the server is running successfully and listening on the correct port before trying to access the UI in the
browser.

## Using the Application

The app allows you to login with a username and password. To test SQL injection:

- Use the username: `admin`
- Use the password: `' OR '1'='1`

This input demonstrates an SQL injection by always returning true, which bypasses authentication logic.

## How It Works

The application has two modes:

- **Vulnerable Mode:** Uses inline SQL statements, susceptible to SQL injection.
- **VSecure Mode:** Uses parameterized queries to safely handle user inputs.

You can switch between these modes by changing the useVulnerableQuery variable in the `sql-injection-app.js` file.

## Protection Against SQL Injection

To protect against SQL injection:

- **Avoid Inline SQL:** Do not concatenate user inputs directly into SQL queries.
- **Use Parameterized Queries:** As demonstrated in the secure mode of this app, parameterized queries ensure that
  inputs are handled as data and not executable code.
- **Validate and Sanitize Inputs:** Check for valid data types and acceptable values before using them in your SQL
  queries.

## Conclusion

This application serves as an educational tool to understand and mitigate the risks of SQL injection attacks. It
highlights the critical need for secure programming practices to protect data integrity and prevent security breaches.
