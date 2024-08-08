import { Router } from "express";
import folderController from "../controllers/folder.js";

const folderRouter = Router();

folderRouter.get('/', folderController.allFoldersGet);


folderRouter.get('/:id', folderController.folderGet);

folderRouter.post('/:id', folderController.folderPost);

folderRouter.post('/delete/:id', folderController.folderDeletePost);

folderRouter.post('/rename/:id', folderController.folderRenamePost);



export default folderRouter;