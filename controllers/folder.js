import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function allFoldersGet(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    const folders = await prisma.folder.findMany({
        where: { userId: req.user.id }
    });

    res.render('allFolders', { folders });
}

async function folderGet(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }

    const folder = await prisma.folder.findUnique({
        where: { id: req.params.id },
        include: { children: true, files: true }
    });


    res.render('folder', { folder });
}



async function homeFolderPost(req, res) {
    if (!req.user) {
        return res.redirect('/login');

    }

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
}

async function folderPost(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    };

    const { newFolderName } = req.body;
    const userId = req.user.id;

    const parentFolder = await prisma.folder.findUnique({
        where: { id: req.params.id }
    });

    if (!parentFolder) {
        return res.redirect('/');
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
                    id: parentFolder.id
                }
            }
        }
    });

    res.redirect('/folder/' + parentFolder.id);
}

async function folderDeletePost(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    };

    const folder = await prisma.folder.findUnique({
        where: { id: req.params.id },
        include: { files: true, children: true }
    });

    if (!folder || folder.name === 'Home') {
        return res.redirect('/');
    };

    //delete files in the folder
    await prisma.file.deleteMany({
        where: { folderId: req.params.id }
    });

    // Recursively delete all subfolders
    for (const child of folder.children) {
        await folderDeleteRecursive(child.id);
    }

    // Finally, delete the folder itself
    await prisma.folder.delete({
        where: { id: req.params.id }
    });

    res.redirect('/');
}

async function folderDeleteRecursive(folderId) {
    const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: {
            files: true,
            children: true
        }
    });

    if (!folder) return;

    // Delete all files in the folder
    await prisma.file.deleteMany({
        where: { folderId: folderId }
    });

    // Recursively delete all subfolders
    for (const child of folder.children) {
        await folderDeleteRecursive(child.id);
    }

    // Finally, delete the folder itself
    await prisma.folder.delete({
        where: { id: folderId }
    });
}

async function folderRenamePost(req, res) {
    if (!req.user) {
        return res.redirect('/login');
    };

    const { renameFolderName } = req.body;

    const folder = await prisma.folder.findUnique({
        where: { id: req.params.id }
    });

    if (!folder || folder.name === 'Home') {
        return res.redirect('/');
    };

    await prisma.folder.update({
        where: { id: folder.id },
        data: { name: renameFolderName }
    });

    res.redirect('/folders/' + folder.id);
}


export default { allFoldersGet, folderGet, folderPost, homeFolderPost, folderDeletePost, folderRenamePost };