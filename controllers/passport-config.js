import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serializeUser = (user, done) => {
    done(null, user.id);
};

const deserializeUser = async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        done(null, user);
    } catch (err) {

        return done(err);
    }
};

const authenticateUser = async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
};

export { serializeUser, deserializeUser, authenticateUser };
