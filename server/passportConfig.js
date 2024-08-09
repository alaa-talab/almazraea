const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        username: profile.displayName,
        profilePicture: profile.photos[0].value,
        role: 'user' , // Default role, will be updated on first login
        googleId: profile.id
      });
      await user.save();
    } else {
      // Update the user record with Google ID if it doesn't have one
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    }
    console.log('Authenticated user:', user);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'displayName', 'photos']
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        email: profile.emails[0].value,
        username: profile.displayName,
        profilePicture: profile.photos[0].value,
        role: 'user'  // Default role, will be updated on first login
      });
      await user.save();
    }
    console.log('Authenticated user:', user);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
