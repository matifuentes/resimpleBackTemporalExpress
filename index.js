const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config()

const app = express();
const cors = require('cors');

// * CORS
app.use(cors()):

// * Capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// * Conexión a la BD
const dbConnect = require('./db');

// * Routes
const authRoutes = require('./apiServices/company/routes/auth');
const validateToken = require('./middleware/validate-token');
const testProtectedRoute = require('./apiServices/company/routes/test-protected-route');

// * Route middlewares
app.use('/api/company', authRoutes);
app.use('/api/test-protected-route', validateToken, testProtectedRoute);

// * Iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor a su servicio en el puerto: ${PORT}`)
})