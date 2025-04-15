const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let fileCount = 0;

app.post('/save', (req, res) => {
  let rawName = req.body.filename.trim();

  // Remove .c if user accidentally types it
  if (rawName.endsWith('.c')) {
    rawName = rawName.slice(0, -2);
  }

  const finalFilename = `${rawName}.c`;
  const filePath = path.join(__dirname, 'files', finalFilename);
  fs.writeFileSync(filePath, req.body.code);

  res.send(`
    <p>Saved as ${finalFilename}</p>
  `);
});



app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/files', (req, res) => {
  const filesDir = path.join(__dirname, 'files');
  fs.readdir(filesDir, (err, files) => {
    if (err) return res.status(500).send('Error reading files');
    
    // Only return .c files
    const cFiles = files.filter(file => file.endsWith('.c'));
    res.json(cFiles);
  });
});

