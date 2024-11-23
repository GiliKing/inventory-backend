import express from 'express';
import cors from 'cors';
import items from './routes/items.js'
import categories from './routes/categories.js'
import logs from './routes/logs.js'
import errorHandler from './middlewares/error.js'
import notfound from './middlewares/notFound.js'
import db from './database/db.js';
const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use('/api/items', items);
app.use('/api/categories', categories);
app.use('/api/logs', logs);

app.use(notfound);
app.use(errorHandler);

(() => console.log(db));
app.listen(port, () => console.log(`listening to port ${port}`));