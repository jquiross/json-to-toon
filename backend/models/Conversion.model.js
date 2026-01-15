import mongoose from 'mongoose';

const conversionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    inputType: {
      type: String,
      enum: ['json', 'toon'],
      required: true,
    },
    outputType: {
      type: String,
      enum: ['json', 'toon'],
      required: true,
    },
    inputData: {
      type: String,
      required: true,
    },
    outputData: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    metadata: {
      inputSize: Number,
      outputSize: Number,
      processingTime: Number,
      errorCount: Number,
      warningCount: Number,
    },
    preset: {
      type: String,
      default: 'default',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    forks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

conversionSchema.index({ user: 1, createdAt: -1 });
conversionSchema.index({ isPublic: 1, views: -1 });
conversionSchema.index({ tags: 1 });

export default mongoose.model('Conversion', conversionSchema);
