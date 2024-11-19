const express = require('express')
const mysql = require('mysql2')

// Create application using express
const app = express();

// Middleware
app.use(express.json())

// Create Connection to MYSQL
// Database need To create First itself
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'pwd',
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Create database if it does not exist
    const createDbQuery = 'CREATE DATABASE IF NOT EXISTS usersdb';
    db.query(createDbQuery, (err) => {
        if (err) {
            console.error('Error creating the database:', err);
            return;
        }
        console.log('Database usersdb created or already exists');

        // Switch to the newly created database
        db.changeUser({ database: 'usersdb' }, (err) => {
            if (err) {
                console.error('Error switching to database usersdb:', err);
                return;
            }
            console.log('Switched to database usersdb');

            // Create the users table if it does not exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    dob DATE
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating the users table:', err);
                    return;
                }
                console.log('Users table created or already exists');
            });
        });
    });
});


// Creating Records
app.post('/createUsers', (req, res)=>{
    const { name, email, dob } = req.body;
    if (!name || !email) {
        res.status(400).json({message: 'Name and email is empty'})
    }

    console.log(req.body)
    const sql = dob 
        ? 'INSERT INTO users (name, email, dob) VALUES (?, ?, ?)' 
        : 'INSERT INTO users (name, email) VALUES (?, ?)';
    const values = dob ? [name, email, dob] : [name, email];

    db.query(sql, values, (err, result)=>{
        if(err){
            console.error('Error in inserting a record:', err);
            res.status(500).json({ message: 'Error inserting record', error: err });
        }
        res.status(201).json({ message: 'User added successfully', userId: result.insertId });
    })
})

// Get users
app.get('/users', (req, res)=>{
    const sql = 'SELECT * FROM users'
    db.query(sql, (err, result)=>{
        if(err){
            console.log('Error in Displaying', err)
            db.end()
            return;
        }
        res.json(result)
    })
})

// Update the users
app.patch('/updateUsers/:id',(req, res)=>{
    const { id } = req.params;
    const {name, email, dob} = req.body;

    let updates = [];
    let values = [];
    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (email) {
        updates.push('email = ?');
        values.push(email);
    }
    if (dob) {
        updates.push('dob = ?');
        values.push(dob);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id=?`
    values.push(id)

    db.query(sql, values, (err, result)=>{
        if(err){
            return res.status(500).json({message: "Error in Updating the users"})
        }
        res.status(200).json({message: 'User Data is Updated'})
    })
})

// Detele the users
app.delete('/delete/:id', (req, res)=>{
    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id=?"

    db.query(sql, id, (err,result)=>{
        if(err){
            return res.status(500).json({message:'Error in deleting the user'})
        }
        res.status(200).json({message: "User data is deleted"})
    })
})

// Open to Server
app.listen(3000, ()=>{
    console.log('Server is Running on 3000')
})