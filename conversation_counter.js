/* GET home page. */
router.get('/home', ensureAuthenticated, function(req, res, next) {
  User.findOne({ username: req.user.username }, function(err, loggedInUser) {
    if (err) throw err
    else {
      Conversation.find({ $and: [{ sent_to_user_id: loggedInUser._id }, { new_message: true }] }, (err, conversation) => {
        if (loggedInUser.gender == 'male') {
          User.find({gender: 'female'}, function(err, all) {
           if (err) return next(err)
             else {
              res.render('home', {
               user: loggedInUser,
               conversation_count: conversation.length,
               all: all
             })
            }
          })
        } else {
          User.find({gender: 'male'}, function(err, all) {
           if (err) return next(err)
             else {
              res.render('home', {
               user: loggedInUser,
               conversation_count: conversation.length,
               all: all
             })
            }
          })
        }
      })
    }
  })
});

app.use((req, res, next) => {
  res.locals.logged_in_user = req.user
  next()
});