import mongoose from 'mongoose'

const userCompanySchema = mongoose.Schema({
  idUser: {
    type: String,
    required: true,
    max: 255,
  },
  idCompany: {
    type: String,
    required: true,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User-Company', userCompanySchema)