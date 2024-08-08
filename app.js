import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { serializeUser, deserializeUser, authenticateUser } from './controllers/passport-config.js';
import indexRouter from './routes/indexRouter.js';
import loginRouter from './routes/loginRouter.js';
import signupRouter from './routes/signupRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import foldersRouter from './routes/foldersRouter.js';
import searchRouter from './routes/searchRouter.js';
import passportLocal from 'passport-local';



const app = express();



const LocalStrategy = passportLocal.Strategy;



passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/upload', uploadRouter);
app.use('/folders', foldersRouter);
app.use('/search', searchRouter);


app.get('/logout', (req, res, next) => {
    req.logout((err) => { if (err) return next(err); });
    res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Connected'));
