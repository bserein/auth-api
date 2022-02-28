const { connectDb } = require('./dbConnect')

exports.createUser = (req, res) => {
    //first, do some validation... (email and password)
    if(!req.body || !req.body.email || !req.body.password) {
        // if no request for email, password or body its an invalid request
        res.status(400).send('Invalid Request')
        return
    }
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
        userRole: 5, //numbers are often used for roles, goes from 0-5, 0 is super admin (the only ones that can create admins), 1 is admin, 2 has power but not a lot, 3-4-5 usually a lower role, so by default the user roles should have the lowest role until an admin or super admin change the role
    }

    const db = connectDb()
    db.collection('users').add(newUser) //instead of putting req.body we are forcing the shape of the content that is allowed (this is kind of like typescript)
    .then(doc => {
        // TODO: create a JWT and send back the token
        res.status(201).send('Account created')
    })
    .catch((err) => res.status(500).send(err))

}