import express from 'express';
import { createShortUrl, redirectShortUrl, getUrlStats } from '../services/urlService.js';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/:shortcode', redirectShortUrl);
router.get('/:shortcode/stats', getUrlStats);

export default router;