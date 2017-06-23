// Connect to mongo shell
mongo ds161901.mlab.com:61901/my_match -u farid -p farid
mongo ds153667.mlab.com:53667/destinations_app -u farid -p farid
mongo ds161059.mlab.com:61059/employees -u farid -p farid
mongo ds157390.mlab.com:57390/social_media_feed -u farid -p farid
mongo ds127878.mlab.com:27878/users_app_test -u farid -p farid

// Update a user's document
db.users.update({first_name: "Farid"}, { $set: { "messages": []}})

// Udate all documents
db.users.updateMany({}, { $set: { "messages": []}})
db.users.updateMany({}, { $set: { "conversations": []}})
db.users.update({first_name: {$regex: "^"}}, { $set: { "messages": []}}, {"multi": true})

// Delete a collection
db.messages.drop()
db.conversations.drop()

// Remove all usernames that end in a number
db.users.remove({username: {$regex: "[0-9]$"}})

// Prints each item on a separate line
db.users.find().forEach(function(u) { print(u.first_name) })

// Returns an array
db.users.find().map( function(u) { return u.name } )

// Find a single user by first name
db.users.find({ first_name: "Sadia" }).pretty()

// Find all users
db.users.find().pretty()

// Find all documents based on a certain criteria
Message.find({ from_user_id: {"$in": senders}}).exec((err, msg) => { console.log(msg)})