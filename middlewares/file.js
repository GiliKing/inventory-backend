import multer from 'multer';

// Set up multer to handle image file upload
const storage = multer.memoryStorage();  // Store image temporarily in memory
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },  // 5MB file size limit
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png/;
      const isValidExt = allowedFileTypes.test(file.originalname.toLowerCase());
      const isValidMime = allowedFileTypes.test(file.mimetype);
  
      if (isValidExt && isValidMime) {
        cb(null, true);
      } else {
        cb(new Error('Only images (JPEG, JPG, PNG) are allowed.'));
      }
    }
});

export default upload;
