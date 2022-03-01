const { connectDb } = require('./dbConnect')

exports.createUser = (req, res) => {
    //first, do some validation... (email and password)
    if(!req.body || !req.body.email || !req.body.password) {
        // if no request for email, password or body its an invalid request
        res.status(400).send({
            success: false,
            message: "Invalid Request"
        })
        return
    }
    const newUser = {
        email: req.body.email.toLowerCase(), //when creating, were making sure to store it in lower case so they will not have any repeats with the same email but different capitalization
        password: req.body.password,
        isAdmin: false,
        userRole: 5, //numbers are often used for roles, goes from 0-5, 0 is super admin (the only ones that can create admins), 1 is admin, 2 has power but not a lot, 3-4-5 usually a lower role, so by default the user roles should have the lowest role until an admin or super admin change the role
    }

    const db = connectDb()
    db.collection('users').add(newUser) //instead of putting req.body we are forcing the shape of the content that is allowed (this is kind of like typescript)
    .then(doc => {
        const user = { //this will become the payload for our JWT
            id: doc.id,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            userRole: newUser.userRole
        }
        // TODO: create a JWT and send back the token
        res.status(201).send({
        success: true,
        message: "Acccount Created",
        token: user, //add this to token later
      })
    })
    .catch((err) => res.status(500).send({ 
    success: false,
    message: err.message,
    error: err
  }))
}

exports.loginUser = (req, res) => {
   //first, do some validation... (email and password) //you copy like above but you can create a function that will do the same 
     if(!req.body || !req.body.email || !req.body.password) {
         // Invalid Request
        res.status(400).send({
            success: false,
            message: "Invalid Request"
          })
        return
      }
      const db = connectDb();
      db.collection('users')
        .where('email', '==', req.body.email.toLowerCase()) //have to pass as a string so js is checking for equality
        .where('password', '==', req.body.password)
        .get()
            .then(snapshot => {
                if(snapshot.empty) { //this is for bad logins
                    res.status(401).send({
                        success: false,
                        message: "Invalid email or password" //never want to say which one was correct because that helps hackers know they are almost there
                    })
                    return  //because you dont want it to continue processing
                }
                // this is for good login
                const users = snapshot.docs.map(doc => {
                    let user = doc.data()
                    user.id = doc.id
                    user.password = undefined
                    return user
                })
                res.send({
                    success: true,
                    message: "Login Sucessful",
                    token: users[0]
                })
            })
            .catch(
                (err) => res.status(500).send({ 
                success: false,
                message: err.message,
                error: err
              }))

}

exports.getUsers = (req, res) => { //TODO protect this with JWT
    const db = connectDb()
    db.collection('users').get()
    .then(snapshot => {
        const users = snapshot.docs.map(doc => {
            let user = doc.data()
            user.id = doc.id
            user.password = undefined //removed the password so that it isnt returned back
            return user
        })
        res.send({
            success: true,
            message: "Users Returned",
            users
         })
    })
    .catch(
        (err) => res.status(500).send({ 
        success: false,
        message: err.message,
        error: err
      }))
} 