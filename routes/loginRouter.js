import { Router } from 'express';
import loginController from '../controllers/login.js';
import passport from 'passport';

const loginRouter = Router();

loginRouter.get('/', loginController.loginGet);

loginRouter.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

export default loginRouter;