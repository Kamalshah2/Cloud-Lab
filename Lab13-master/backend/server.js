const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "database-1.chacow0wwxcu.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Abuzarkhan12$34"
});

// Step 1: Connect without selecting a database
db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Step 2: Create database if not exists
  db.query(`CREATE DATABASE IF NOT EXISTS crud_app_db`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database exists or created');

    // Step 3: Switch to the database
    db.changeUser({ database: 'crud_app_db' }, (err) => {
      if (err) {
        console.error('Error switching database:', err);
        return;
      }

      // Step 4: Create table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20)
        )
      `;
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        } else {
          console.log('Users table ready');
        }
      });
    });
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  db.query(
    'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: result.insertId,
        name,
        email,
        phone
      });
    }
  );
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const id = req.params.id;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  db.query(
    'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
    [name, email, phone || null, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        id: parseInt(id),
        name,
        email,
        phone
      });
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});