const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const angularAppPath = path.join(__dirname, 'dist/my-angular-app');

app.use(express.static(angularAppPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(angularAppPath, 'index.html'));
});

app.listen(port, () => console.log(`Angular app running on http://localhost:${port}`));
