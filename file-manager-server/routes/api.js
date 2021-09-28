const express = require('express');
const router = express.Router();
const fileService = require('../services/file.service.js');
const app = express();
const options = fileService.getFileOptions();
const multer = require('multer')(options);

router.get('/files', fileService.getAll);
router.get('/dirs', fileService.getDir);
router.post('/upload', multer.any(), fileService.uploadFile);
router.delete('/files/:id', fileService.deleteFile);
router.get('/files/dir/', fileService.getFilesByDir);
router.get('/files/total', fileService.getTotalOfFiles);
router.post('/dirs/create/', fileService.createDirectory);
router.post('/dir/delete/', fileService.deleteDirectory);
router.put('/files/rename', fileService.renameFile);

module.exports = router;
