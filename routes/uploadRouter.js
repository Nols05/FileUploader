import { Router } from "express";
import multer from "multer";
import uploadController from "../controllers/upload.js";

const uploadRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/mpeg', 'video/quicktime',
        'application/pdf', 'text/plain',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


uploadRouter.get('/', (req, res) => {
    res.redirect('/');
});

uploadRouter.get('/:id', uploadController.uploadFileGet);

uploadRouter.post('/delete/:id', uploadController.deleteFilePost);


uploadRouter.post('/:id', upload.single('file'), uploadController.uploadFilePost);



export default uploadRouter;

