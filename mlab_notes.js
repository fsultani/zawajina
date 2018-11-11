mongo ds139322.mlab.com:39322/my_match_dev -u farid -p farid

// Return a count of all users with a given name
db.users.find({ name: "John"}).count()
db.users.find({ name: "Test"}).count()

// Remove all users with a specific name
db.users.remove({ name: "John"})
db.users.remove({ name: "Test"})

// Find a single user by first name
db.users.find({ name: "John" }).pretty()

// Delete a collection
db.messages.drop() && db.conversations.drop()
db.conversations.find().pretty()

// Update a user's document
db.users.update({name: "Farid"}, { $set: { "messages": []}})

// Udate all documents
db.users.updateMany({}, { $set: { "messages": []}})
db.users.updateMany({}, { $set: { "conversations": []}})
db.users.update({name: {$regex: "^"}}, { $set: { "messages": []}}, {"multi": true})

// Remove all usernames that end in a number
db.users.remove({username: {$regex: "[0-9]$"}})

// Prints each item on a separate line
db.users.find().forEach(function(u) { print(u.name) })

// Returns an array
db.users.find().map( function(u) { return u.name } )

// Find all users
db.users.find().pretty()

// Find all documents based on a certain criteria
Message.find({ from_user_id: {"$in": senders}}).exec((err, msg) => { console.log(msg)})

// When pushing a local branch to master
git checkout master
git merge branch
git push

// When pushing to Heroku
if (process.env.NODE_ENV === 'mlab-dev') {
  require('./db_credentials')
  mongoose.connect(process.env.MONGO_DB_MLAB_DEV)
  console.log("Using mlab:", process.env.NODE_ENV)
} else if (process.env.NODE_ENV === 'local') {
  require('./db_credentials')
  mongoose.connect(process.env.LOCAL)
  console.log("Using local db - mongodb://localhost/my_match_local_dev")
} else {
  mongoose.connect(process.env.MONGO_DB)
  console.log("Heroku deployment")
}