import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function indexGet(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    };

    const homeFolder = await prisma.folder.findFirst({
        where: {
            userId: req.user.id,
            AND: { name: 'Home' }
        },
        include: {
            children: true,
            files: true
        }

    });

    res.render('folder', { folder: homeFolder });
};

async function indexPost(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    };

    const { newFolderName } = req.body;
    const userId = req.user.id;

    let homeFolder = await prisma.folder.findFirst({
        where: {
            name: 'Home',
            userId: userId
        }
    });

    if (!homeFolder) {
        homeFolder = await prisma.folder.create({
            data: {
                name: 'Home',
                userId: userId
            }
        });
    };

    await prisma.folder.create({
        data: {
            name: newFolderName,
            user: {
                connect: {
                    id: userId
                }
            },
            parent: {
                connect: {
                    id: homeFolder.id
                }

            }
        }
    });

    res.redirect('/');
};


export default { indexGet, indexPost };

