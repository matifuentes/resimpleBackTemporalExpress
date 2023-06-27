import mongoose from 'mongoose'

const Domiciliary = mongoose.Schema({
  code: {
    type: String,
    required: true,
    max: 32,
  },
  tonDangerous: {
    type: Number,
    required: true,
  },
  tonNotDangerous: {
    type: Number,
    required: true,
  }
});

const NoDomiciliary = mongoose.Schema({
  code: {
    type: String,
    required: true,
    max: 32,
  },
  tonDangerous: {
    type: Number,
    required: true,
  },
  tonNotDangerous: {
    type: Number,
    required: true,
  }
});

const baseLineSchema = mongoose.Schema({
  rutManager: {
    type: String,
    required: true,
    max: 12,
  },
  nameManager: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  emailManager: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  rutCompany: {
    type: String,
    required: true,
    max: 12,
  },
  registerType: {
    type: String,
    required: true,
    enum: ['Proyección', 'Rectificación'],
  },
  period: {
    type: Number,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: false,
  },
  domiciliary: [Domiciliary],
  noDomiciliary: [NoDomiciliary],
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Base-Line', baseLineSchema)