const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: false }));

// todo: change mode here
const useVulnerableQuery = true;

const pool = new Pool({
    user: 'dbadmin',
    host: 'localhost',
    database: 'user',
    password: 'dbpassword',
    port: 5432,
});

app.get('/', (req, res) => {
    const loginForm = generateLoginForm();

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
            form { background-color: #fff; padding: 40px; border-radius: 10px; display: inline-block; }
            input[type=text], input[type=password] { margin-top: 10px; margin-bottom: 20px; width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            input[type=submit] { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
            input[type=submit]:hover { background-color: #0056b3; }
        </style>
    </head>
    <body>
        ${loginForm}
    </body>
    </html>
  `);
});

function generateLoginForm() {
    return `
        <form action="/login" method="POST">
            <h2>Login</h2>
            Username: <br><input type="text" name="username"><br>
            Password: <br><input type="password" name="password"><br>
            <input type="submit" value="Login" style="margin-bottom: 20px;">
        </form>
        <button onclick="openCreateUserForm()" style="background-color: #e7e7e7; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; display: block; margin: 20px auto;">Create User</button>
        <script>
            function openCreateUserForm() {
                window.open('/users', '_blank');
            }
        </script>
    `;
}

function generateCreateUserForm() {
    return `
    <form action="/users" method="POST">
        <h2>Create User</h2>
        Username: <br><input type="text" name="username"><br>
        Password: <br><input type="password" name="password"><br>
        <input type="submit" value="Create User">
    </form>
    `;
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (useVulnerableQuery) {
        const vulnerableQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        pool.query(vulnerableQuery, (error, results) => {
            handleLoginResponse(error, results, res, username);
        });
    } else {
        const secureQuery = `SELECT * FROM users WHERE username = $1 AND password = $2`;
        pool.query(secureQuery, [username, password], (error, results) => {
            handleLoginResponse(error, results, res, username);
        });
    }
});

function handleLoginResponse(error, results, res, username) {
    if (error) {
        res.send(`<h1>An error occurred.</h1>`);
        return;
    }
    if (results.rows.length > 0) {
        res.send(`
            <h1>Login successful!</h1>
            <p>Welcome, ${username}!</p>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
                h1 { color: #4CAF50; }
            </style>
        `);
    } else {
        res.send(`
            <h1>Login failed.</h1>
            <p>Invalid username or password.</p>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
                h1 { color: #f44336; }
            </style>
        `);
    }
}

app.get('/users', (req, res) => {
    const createUserForm = generateCreateUserForm();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Create User</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
                form { background-color: #fff; padding: 40px; border-radius: 10px; display: inline-block; }
                input[type=text], input[type=password] { margin-top: 10px; margin-bottom: 20px; width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                input[type=submit] { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
                input[type=submit]:hover { background-color: #0056b3; }
            </style>
        </head>
        <body>
            ${createUserForm}
        </body>
        </html>
    `);
});

app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
        handleCreateUserResponse(null, res, username);
    } catch (error) {
        console.error('Error creating user:', error);
        handleCreateUserResponse(error, res, username);
    }
});

function handleCreateUserResponse(error, res, username) {
    if (error) {
        res.send(`
            <h1>An error occurred.</h1>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
                h1 { color: #f44336; }
            </style>
        `);
        return;
    }
    res.send(`
        <h1>Created successful!</h1>
        <p>Hello new user, ${username}!</p>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f0f0f0; text-align: center; padding-top: 50px; }
            h1 { color: #4CAF50; }
        </style>
    `);
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
