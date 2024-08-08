import { Router } from "express";
import searchController from "../controllers/search.js";

const searchRouter = Router();

searchRouter.get('/', searchController.searchFile);

export default searchRouter;