import store from '../data/store.js';
import { generateShortcode } from '../utils/generateShortcode.js';

export function createShortUrl(req, res) {
  const { url, validity, shortcode } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid url' });
  }

  const code = shortcode || generateShortcode();

  if (store.urls[code]) {
    return res.status(409).json({ error: 'Shortcode can't be generated because it already exists' });
  }

  const expiryMinutes = validity || 30;
  const expiryTime = new Date(Date.now() + expiryMinutes * 60000).toISOString();

  store.urls[code] = {
    originalUrl: url,
    createdAt: new Date().toISOString(),
    expiryTime,
    clicks: [],
  };

  res.status(201).json({
    shortLink: `http://localhost:3000/shorturls/${code}`,
    expiry: expiryTime,
  });
}

export function redirectShortUrl(req, res) {
  const { shortcode } = req.params;
  const data = store.urls[shortcode];

  if (!data) return res.status(404).json({ error: 'Shortcode not available' });
  if (new Date() > new Date(data.expiryTime)) {
    return res.status(410).json({ error: 'Link expired' });
  }

  data.clicks.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referer') || 'direct',
    location: req.ip,
  });

  res.redirect(data.originalUrl);
}

export function getUrlStats(req, res) {
  const { shortcode } = req.params;
  const data = store.urls[shortcode];

  if (!data) return res.status(404).json({ error: 'Shortcode is not available' });

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiryTime,
    totalClicks: data.clicks.length,
    clicks: data.clicks,
  });
}