import { Router } from 'express';
import indexController from '../controllers/index.js';

const indexRouter = Router();

indexRouter.get('/', indexController.indexGet);

indexRouter.post('/', indexController.indexPost);

export default indexRouter;