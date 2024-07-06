import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// MySQL database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "KAlana#23",
  database: "crud"
});

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// API endpoint for file upload
app.post('/upload', upload.single('image'), (req, res) => {
  const image = req.file.filename;
  const sql = "INSERT INTO image (img) VALUES (?)";
  db.query(sql, [image], (err, result) => {
    if (err) {
      console.error("Error inserting image into database: " + err.message);
      return res.json({ Message: "Error" });
    }
    return res.json({ Status: "Success" });
  });
});

// API endpoint for displaying images
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM image';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving images from database: " + err.message);
      return res.json({ Message: "Error" });
    }
    return res.json(result);
  });
});

// Start the server

app.listen(8180, () => {
  console.log("Server is running ");
});
