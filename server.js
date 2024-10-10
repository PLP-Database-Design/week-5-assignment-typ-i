const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err)
    return
  }
  console.log('Connected to the database')
})

// the middleware to parse the request body
app.use(express.json())

// Question 1 goes here(retrieving all patients)
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients'
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving patients' })
        return
      }
      res.json(results)
    })
  })

// Question 2 goes here(retrieving all providers)
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers'
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving providers' })
        return
      }
      res.json(results)
    })
  })

// Question 3 goes here(filtering patients by first name)
app.get('/patients/filter', (req, res) => {
    const { firstName } = req.query
    if (!firstName) {
      res.status(400).json({ error: 'First name is required' })
      return
    }
    
    const query = 'SELECT * FROM patients WHERE first_name = ?'
    db.query(query, [firstName], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error filtering patients' })
        return
      }
      res.json(results)
    })
  })
  

// Question 4 goes here(retrieving all providers by their specialty)
app.get('/providers/specialty', (req, res) => {
    const { specialty } = req.query
    if (!specialty) {
      res.status(400).json({ error: 'Specialty is required' })
      return
    }
    
    const query = 'SELECT * FROM providers WHERE provider_specialty = ?'
    db.query(query, [specialty], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving providers by specialty' })
        return
      }
      res.json(results)
    })
  })
  

// listening to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})
