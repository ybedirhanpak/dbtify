import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

import api from './api/index';

const app = express();

app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.use('/api', api);

// Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})