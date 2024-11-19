# MySQL Node.js Project

A simple Node.js application using Express.js for building RESTful APIs and MySQL as the database. This project demonstrates creating, reading, updating, and managing users in a MySQL database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Create User](#create-user)
  - [Get All Users](#get-all-users)
  - [Update User](#update-user)
- [Technologies Used](#technologies-used)
- [License](#license)

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/your-repository-name.git
```

2. Navigate to the project directory:
```bash
   cd your-repository-name
```

3. Install dependencies:
```bash
   npm install
```

4. Set up your MySQL database connection in index.js:
```bash
   const db = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
   });
```

5. Start the Server:
```bash
  node index.js
```
The server will be running at http://localhost:3000.

## Usage
- Make sure you have MySQL installed and running.
- Ensure you have created a MySQL user and database, or the script will create the database if it doesn't exist.

## Endpoints

### Create User

**POST** `/createUsers`

**Request Body:**
```json
{
    "name": "Chakradhar",
    "email": "chakradhar@example.com",
    "dob": "2000-01-01"
}
```

**Response:**
```json
{
    "message": "User added successfully",
    "userId": 1
}
```