const {initializeApp, applicationDefault} = require("firebase-admin/app")
const {getFirestore} = require("firebase/firestore")

const app = initializeApp('./kslplus-70a1d643873f.json')

const db = getFirestore(app)

const docRef = doc(db, "users", "1PUOBZtgmExxGPz9cPWK")



