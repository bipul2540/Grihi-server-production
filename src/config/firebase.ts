import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = require("./../../db-config.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
export default db;
