const fs = require('fs');
const path = require('path');

// Fetch logs (admin-only)
exports.getLogs = (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '../audit.log');

    // Ensure the file exists
    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({ error: 'Log file not found' });
    }

    // Stream the file to the response
    res.setHeader('Content-Type', 'application/json');
    const logStream = fs.createReadStream(logFilePath);
    logStream.pipe(res);
  } catch (error) {
    console.error('Error reading logs:', error);
    res.status(500).json({ error: 'Unable to fetch logs' });
  }
};
