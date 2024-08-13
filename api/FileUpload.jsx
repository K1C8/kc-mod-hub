const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express and Prisma Client
const app = express();
const prisma = new PrismaClient();

// Configure Multer to store image files in the 'img_uploads' directory
const img_upload = multer({
    dest: 'img_uploads/', // Directory to store uploaded files
    limits: { fileSize: 40 * 1024 * 1024 }, // Limit file size to 4MB
    fileFilter: (req, file, cb) => {
        // Only allow certain image types 
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type for uploading image.'));
    }
});

// Configure Multer to store files in the 'mod_uploads' directory
const mod_upload = multer({
    dest: 'mod_uploads/', // Directory to store uploaded files
    limits: { fileSize: 16 * 1024 * 1024 }, // Limit file size to 16MB
    fileFilter: (req, file, cb) => {
        // Only allow certain image types 
        const filetypes = /crp|mod|dll/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type for uploading mod.'));
    }
});

export default {img_upload, mod_upload};