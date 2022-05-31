import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

const app = express();

admin.initializeApp({
  credential: admin.credential.cert("./permissions.json"),
  databaseURL: "https://todo-app-43066-default-rtdb.firebaseio.com",
});
const db = admin.firestore();

app.get("/api/todo", async (req, res) => {
  try {
    const query = db.collection("todo");
    const { docs } = await query.get();

    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
});

app.get("/api/todo/:todo_id", async (req, res) => {
  try {
    const doc = await db.collection("todo").doc(req.params.todo_id);
    const item = await doc.get();
    const response = item.data();

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    await db
      .collection("todo")
      .doc("/" + req.body.id + "/")
      .create({ name: req.body.name });

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
});

app.put("/api/todo/:todo_id", async (req, res) => {
  try {
    const doc = await db.collection("todo").doc(req.params.todo_id);
    await doc.update({
      name: req.body.name,
    });
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
});

app.delete("/api/todo/:todo_id", async (req, res) => {
  try {
    const doc = await db.collection("todo").doc(req.params.todo_id);
    await doc.delete();
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
});

exports.app = functions.https.onRequest(app);
