mongo ds139322.mlab.com:39322/my_match_dev -u farid -p farid

// Delete a collection
db.messages.drop() && db.conversations.drop()
db.conversations.find().pretty()

// Update a user's document
db.users.update({first_name: "Farid"}, { $set: { "messages": []}})

// Udate all documents
db.users.updateMany({}, { $set: { "messages": []}})
db.users.updateMany({}, { $set: { "conversations": []}})
db.users.update({first_name: {$regex: "^"}}, { $set: { "messages": []}}, {"multi": true})

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

git checkout master
git merge branch
git push