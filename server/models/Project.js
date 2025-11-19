// models/Project.js
const mongoose = require('mongoose');

const toTechArray = (v) => {
  if (Array.isArray(v)) return v.map(s => s.trim()).filter(Boolean);
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const urlValidator = {
  validator: (v) => !v || /^https?:\/\/.+/i.test(v),
  message: '{PATH} must be a valid http/https URL',
};

const imageSubschema = new mongoose.Schema(
  {
    url: { type: String, trim: true, validate: urlValidator }, // req.file.location
    key: { type: String, trim: true },                         // req.file.key
    bucket: { type: String, trim: true },                      // req.file.bucket
    etag: { type: String, trim: true },                        // req.file.etag
    mimetype: { type: String, trim: true },                    // req.file.mimetype
    size: { type: Number },                                    // req.file.size (bytes)
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 5000 },

    // Accept CSV or array; stored as array
    technologies: { type: [String], default: [], set: toTechArray },

    // S3 upload (multer-s3)
    image: { type: imageSubschema, default: undefined },

    // Repository URL (map your frontend repoUrl -> codeUrl in controller)
    codeUrl: { type: String, trim: true, validate: urlValidator },
    order: { type: Number, index: true, default: 0 },
  },
  
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

projectSchema.virtual('imageUrl').get(function () {
  return this.image?.url || '';
});


// Optional: quick search helpers
projectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
