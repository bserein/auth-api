const {initializeApp, cert, getApps} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const credentials = require('../credentials.json');

exports.connectDb = () => {
    if(!getApps().length){
        initializeApp({
            credential: cert(credentials)
        });
    }
    return getFirestore();
}