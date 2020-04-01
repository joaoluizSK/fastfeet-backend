import { Router } from 'express';
import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Authentication Middleware
routes.use(authMiddleware);

// Avatar upload
routes.post('/files', upload.single('file'), FileController.store);

// Users
routes.put('/users', UserController.update);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.details);
routes.delete('/recipients/:id', RecipientController.delete);

// Deliverymen
routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);
routes.get('/deliverymen/:deliveryman_id/deliveries', DeliveryController.index);

// Orders
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);
routes.get('/orders/:id/problems', DeliveryProblemController.details);
routes.post('/orders/:id/problems', DeliveryProblemController.store);
routes.post('/orders/:id/start-delivery', DeliveryController.store);
routes.put('/orders/:id/finish-delivery', DeliveryController.update);

// Problems
routes.get('/problems', DeliveryProblemController.index);
routes.delete(
  '/problems/:id/cancel-delivery',
  DeliveryProblemController.delete
);

export default routes;
