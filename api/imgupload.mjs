import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get the next ID for content
async function getNextContentId() {
  const result = await prisma.content.findFirst({
    orderBy: {
      id: 'desc'
    },
    select: {
      id: true
    }
  });
  return (result?.id || 0) + 1; // Increment the highest ID by 1
}

// Configure Multer to store image files in the 'img_uploads' directory
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const nextId = await getNextContentId();
            cb(null, `img_uploads/${nextId}/`); // Use nextId to create a dynamic path
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwriting
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Only allow certain image types
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype) {
        return cb(null, true);
    }
    cb(new Error('Invalid file type for uploading image.'));
};

const ImgUpload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 }, // Limit file size to 4MB
    fileFilter
});

export default ImgUpload;