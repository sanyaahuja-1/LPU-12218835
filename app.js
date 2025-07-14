import express from 'express';
import shortUrlsRouter from './routes/shortUrls.js';
import logger from './middleware/logger.js';

const app = express();

app.use(express.json());
app.use(logger); 
app.use('/shorturls', shortUrlsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});