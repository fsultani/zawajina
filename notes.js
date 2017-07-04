# Remove a committed file from github
git rm --cached filename

# Before deploying, remove browser-refresh from package.json
"start": "browser-refresh server.js",

// Get the conversation with the selected member
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  console.log("1")
  User.findOne({ _id: req.user._id }, (err, user) => {
    console.log("2")
    Message.find({conversations: req.params.id}, (err, messages) => {
      console.log("3")
      res.render('user_messages', {
        user: user,
        user_messages: messages,
        conversation_id: req.params.id,
        helpers: {
          if_eq: function(a, b, options) {
            if (a == b) {
              return options.fn(this);
            } else {
              return options.inverse(this)
            }
          }
        }
      })
      console.log("4")
    })
    console.log("5")
  })
  console.log("6")
})
console.log("7")

module.exports = router;

// Message.update({ $and: [{ conversations: req.params.id }, { unread: true }] }, { $set: { unread: false }}, (err, message) => {})
// Message.update({ view_count: 0 }, { $set: { view_count: 1 } }, (err, message) => {})