const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');


const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({origin: ['*' ]}));

async function init() {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'usersDB',
    });
    if (connection) {
      console.log('Connected to DB');
      app.listen(PORT, () => {
        console.log(`Server is listening on port:`, PORT);
      });
    }
  }
  
init();

module.exports = app;
