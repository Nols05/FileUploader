import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function searchFile(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    const { search } = req.query;

    if (!search) {
        return res.redirect('/');
    }



    const files = await prisma.file.findMany({
        where: {
            name: {
                contains: search,
                mode: 'insensitive'

            }
        }
    });

    res.render('search', { files, search });

}

export default { searchFile };