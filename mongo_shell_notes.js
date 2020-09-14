mongo "mongodb+srv://my-match.rxspi.mongodb.net/my-match-dev" --username fsultani

// Find all users
db.users.find().pretty()

// Find user "Farid"
db.users.find({ name: "Farid"}).pretty()

// Remove all users
db.users.drop()

// Remove all users except Farid
db.users.find().forEach(user => {if (user.name !== "Farid") db.users.remove({"_id": user._id })})

// Remove only Farid
db.users.find().forEach(user => {if (user.name === "Farid") db.users.remove({"_id": user._id })})

// Find last user
db.users.find().limit(1).sort({ $natural: -1 }).pretty()

// Find all users with an email that includes a number
db.users.find({ "email": {$regex: /[0-9]/g} }).pretty()

// Count all users with an email that includes a number
db.users.find({ "email": {$regex: /[0-9]/g} }).count()

// Return a count of all users with a given name
db.users.find().count()
db.users.find({ name: "John"}).count()
db.users.find({ name: "Test"}).count()

// Remove all users with a specific name
db.users.remove({ name: "John"})
db.users.remove({ name: "Test"})

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

// Find a single user by first name
db.users.find({ name: "John" }).pretty()

// Find all users
db.users.find().pretty()

// Find all documents based on a certain criteria
Message.find({ from_user_id: {"$in": senders}}).exec((err, msg) => { console.log(msg)})

// When pushing a local branch to master
git checkout master
git merge branch
git push

// AWS notes
// Get s3 total size
aws s3 ls s3://my-match --recursive --human-readable --summarize

// Empty s3 bucket
aws s3 rm s3://my-match --recursive

// Empty select files in s3 bucket
aws s3 rm s3://my-match --recursive --exclude "male.png" --exclude "female.png"

// Run prettier with printWidth = 100
npx prettier --write . --print-width 100 --arrow-parens avoid