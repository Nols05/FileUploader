import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import passport from "passport";

const prisma = new PrismaClient();

function signupGet(req, res) {
    res.render('signup');
}

async function signupPost(req, res, next) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        await prisma.folder.create({
            data: {
                name: 'Home',
                userId: user.id
            }
        });

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signup',
        })(req, res, next);




    } catch (error) {
        next(error);
    }

};

export default { signupGet, signupPost };