import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  id: {
    type: String,
    index: true,
    unique: true
  },
  password: String
})

UserSchema.statics.createUser = function createUser(data) {
  const { username, password } = data
  const model = this

  return new Promise(function(resolve, reject) {
    model.create({
      username,
      password: bcrypt.hashSync(password, salt)
    }, (err, user) => {
      if (err) {
        return reject(err)
      }

      resolve(user)
    })
  })
}

UserSchema.statics.auth = function isValidPassword(username, password) {
  const model = this

  return new Promise(function(resolve, reject) {
    model.findByName(username)
      .then(user => {
        if (!user) {
          return reject()
        }

        bcrypt.compare(password, user.password, (err, same) => {
          if (err) {
            return reject(err)
          }
          if (same) {
            resolve(user)
          } else {
            resolve(null)
          }
        })
      })
  })
}

UserSchema.statics.findByName = function(username) {
  const model = this

  return new Promise(function(resolve, reject) {
    model.find(
      { username },
      (err, user) => err ? reject(err) : (user && resolve(user[0]))
    )
  })
}

UserSchema.virtual('profile').get(function profile() {
  return { username: this.username, id: this.id }
})

UserSchema.pre('save', function save(next) {
  if (!this.created) this.created = new Date
  if (!this.id) this.id = this._id

  next()
})

export default mongoose.model('User', UserSchema)
