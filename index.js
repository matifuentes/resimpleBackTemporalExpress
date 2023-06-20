import express from 'express'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

import cors from 'cors'

// * CORS
app.use(cors());

// * Capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// * Conexión a la BD
import dbConnect from './db.js'

// * Routes
import authRoutes from './apiServices/company/routes/auth.js'
import validateToken from './middleware/validate-token.js'
import testProtectedRoute from './apiServices/company/routes/test-protected-route.js'

// * Route middlewares
app.use('/api/company', authRoutes);
app.use('/api/test-protected-route', validateToken, testProtectedRoute);

// * Iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor a su servicio en el puerto: ${PORT}`)
})