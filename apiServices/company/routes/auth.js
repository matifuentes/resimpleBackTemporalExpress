//const router = require('express').Router();
import express from 'express'
const router = express.Router()

import { controllerRegister, controllerLogin } from '../controllers/company.js';

router.post('/login', controllerLogin);

router.post('/register', controllerRegister)

export default router