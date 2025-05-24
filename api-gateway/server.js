const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// JWT verification middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const BLOG_SERVICE_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3002';
const COMMENT_SERVICE_URL = process.env.COMMENT_SERVICE_URL || 'http://localhost:3003';
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3004';

// Proxy middleware options
const proxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/',
    '^/api/blogs': '/',
    '^/api/comments': '/',
    '^/api/profile': '/'
  }
};

// Public routes
app.use('/api/auth', createProxyMiddleware({
  ...proxyOptions,
  target: AUTH_SERVICE_URL
}));

// Protected blog routes
app.use('/api/blogs', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    return verifyToken(req, res, () => {
      createProxyMiddleware({
        ...proxyOptions,
        target: BLOG_SERVICE_URL
      })(req, res, next);
    });
  }
  createProxyMiddleware({
    ...proxyOptions,
    target: BLOG_SERVICE_URL
  })(req, res, next);
});

// Protected comment routes
app.use('/api/comments', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    return verifyToken(req, res, () => {
      createProxyMiddleware({
        ...proxyOptions,
        target: COMMENT_SERVICE_URL
      })(req, res, next);
    });
  }
  createProxyMiddleware({
    ...proxyOptions,
    target: COMMENT_SERVICE_URL
  })(req, res, next);
});

// Protected profile routes
app.use('/api/profile', (req, res, next) => {
  if (req.method !== 'GET' || req.path === '/me') {
    return verifyToken(req, res, () => {
      createProxyMiddleware({
        ...proxyOptions,
        target: PROFILE_SERVICE_URL
      })(req, res, next);
    });
  }
  createProxyMiddleware({
    ...proxyOptions,
    target: PROFILE_SERVICE_URL
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});