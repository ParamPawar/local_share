const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 5000;

// Enable CORS for all origins (so frontend can connect)
app.use(cors());

// Serve files from the uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/files', express.static(uploadsDir));

// Multer config to handle file uploads
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const ip = getLocalIPAddress();
  const fileUrl = `http://${ip}:${PORT}/files/${req.file.originalname}`;
  res.json({ message: 'Uploaded successfully!', url: fileUrl });
});

// Route to list all uploaded files
app.get('/files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Unable to read files' });
    const ip = getLocalIPAddress();
    const fileLinks = files.map(f => `http://${ip}:${PORT}/files/${f}`);
    res.json(fileLinks);
  });
});

// Helper function to get your local IP address
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start server on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIPAddress();
  console.log(`🚀 Server is running at: http://${ip}:${PORT}`);
});
