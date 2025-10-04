
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// // Configure Multer to store files in the 'mod_uploads' directory
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       const nextId = await getNextContentId();
//       console.log(String(nextId) + " prefetched.");
//       cb(null, `mod_uploads/${nextId}/`); // Use nextId to create a dynamic path
//     } catch (error) {
//       cb(error);
//     }
//   },
//   filename: (req, file, cb) => {
//     // Create a unique filename to avoid overwriting
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}${ext}`;
//     cb(null, filename);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // Only allow certain file types
//   const filetypes = /crp|mod|dll/;
//   const mimetype = filetypes.test(path.extname(file.originalname).toLowerCase());
//   if (mimetype) {
//     return cb(null, true);
//   }
//   cb(new Error('Invalid file type for uploading mod.'));
// };

// const modupload = multer({
//   storage,
//   limits: { fileSize: 16 * 1024 * 1024 }, // Limit file size to 16MB
//   fileFilter
// });


  // Helper function to get the next ID for content
export async function getNextContentId() {
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