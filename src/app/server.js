const express = require('express');  
const cors = require('cors');  
const app = express();  

app.use(cors({  
  origin: 'http://localhost:4200',  // Allow requests from Angular app  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  credentials: true  // If you need to support cookies  
}));  

app.use(express.json());  

app.post('/create_user', (req, res) => {  
  // Your user creation logic  
  res.status(201).send({ message: 'User created successfully!' });  
});  

app.listen(5000, () => {  
  console.log('Server running on http://localhost:5000');  
});