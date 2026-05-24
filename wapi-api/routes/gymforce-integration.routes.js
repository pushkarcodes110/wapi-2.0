import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { lookupContact } from '../controllers/gymforce-integration.controller.js';

const router = express.Router();

router.get('/contact-lookup', authenticate, lookupContact);

export default router;
