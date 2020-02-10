import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Authentication Middleware
routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients', RecipientController.list);
routes.get('/recipients/:id', RecipientController.details);
routes.delete('/recipients/:id', RecipientController.delete);

export default routes;