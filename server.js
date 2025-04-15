const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/files', (req, res) => {
  const filesDir = path.join(__dirname, 'files');
  fs.readdir(filesDir, (err, files) => {
    if (err) return res.status(500).send('Error reading files');
    const cFiles = files.filter(file => file.endsWith('.c'));
    res.json(cFiles);
  });
});

app.post('/save', (req, res) => {
  const filename = req.body.filename.trim();
  if (filename.endsWith('.c')) filename = filename.slice(0, -2);
  const finalFilename = `${filename}.c`;
  const filePath = path.join(__dirname, 'files', finalFilename);
  fs.writeFileSync(filePath, req.body.code);
  res.send(`<p>Saved as ${finalFilename}</p><a href="/download/${finalFilename}">Download</a>`);
});
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  res.download(filePath);
});
app.listen(3000, () => {
  console.log('App running on port 3000');
});



