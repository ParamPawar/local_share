// src/App.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);


const SERVER_IP = 'http://192.168.1.5:5000'; // 🔁 Change this to your actual IP

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${SERVER_IP}/files`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${SERVER_IP}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      alert(result.message);
      setFile(null);
      fetchFiles(); // Refresh file list
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📁 Local Network File Share</h1>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      <hr />

      <h2>Shared Files:</h2>
      <ul>
        {files.map((url, idx) => (
          <li key={idx}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {decodeURIComponent(url.split('/').pop())}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
