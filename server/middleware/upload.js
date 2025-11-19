// upload.js
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3'); // your configured S3Client or v2 SDK
const { AWS_BUCKET } = process.env;

function safeKey(originalname) {
    const ext = path.extname(originalname);
    const base = path.basename(originalname, ext);
    // remove/replace risky chars; keep it simple
    const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, '-');
    return `projects/${crypto.randomUUID()}-${safeBase}${ext}`;
}

const upload = multer({
    storage: multerS3({
        s3,
        bucket: AWS_BUCKET,
        // Optional if bucket policy already grants GetObject to everyone:
        // acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE, // <-- correct Content-Type
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, safeKey(file.originalname));
        },
    }),
    // (Optional) file size and type limits:
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        // allow images only
        if (!/^image\//.test(file.mimetype)) {
            return cb(new Error('Only image uploads are allowed'));
        }
        cb(null, true);
    },
});

module.exports = upload;
