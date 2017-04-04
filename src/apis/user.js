import restify from 'restify'
import mongoose from 'mongoose'
import passport from 'passport'

const User = mongoose.model('User')

export const login = (req, res, next) => {
    // The local login strategy
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }

        // Technically, the user should exist at this point, but if not, check
        if(!user) {
            return next(new restify.InvalidCredentialsError("Please check your details and try again."));
        }

        // Log the user in!
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            req.session.user_id = req.user.id;

            if(user.username) {
                res.json({
                  success: 'Welcome ' + user.username + "!",
                  id: user.id
                });
                return next();
            }

            res.json({ success: 'Welcome!'});
            return next();
        });
    })(req, res, next);
}

export const register = (req, res, next) => {
  const { username, password } = req.body

  User.createUser({
    username,
    password
  })
  .then(user => {
    if (user) {
      return res.json(201, { username })
    }
    res.json(500, {})
  })
  .catch(next)
}

export const profile = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return next(err)
    }
    res.json(user.profile)
  })
}
