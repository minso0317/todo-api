import express from "express";
import mongoose from "mongoose";
import Task from "./task.js";
import { DATABASE_URL, PORT } from "./env.js";

const app = express();
app.use(express.json());

await mongoose.connect(DATABASE_URL);

app.post("/tasks", async (req, res) => {
  const data = req.body;
  console.log(data); // 디버깅을 위한 출력
  const newTask = await Task.create(data);
  console.log(newTask); // 디버깅을 위한 출력
  res.status(201).send(newTask);
});

app.get("/tasks", async (req, res) => {
  // sort, count
  const count = Number(req.query.count) || 0; // count가 없어서 undefined 일 때 0으로 출력
  const sortOption =
    req.query.sort === "oldest" ? ["createdAt", "asc"] : ["createdAt", "desc"];
  const tasks = await Task.find().limit(count).sort([sortOption]);
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  } catch (e) {
    // console.log("Error occurred");
    // console.log(e.name);
    // console.log(e.message);
    // res.sendStatus(400);
    if (e.name === "CastError") {
      res.status(404).send({ message: "Cannot find given id" });
    } else {
      res.status(500).send({ message: e.message });
    }
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      const data = req.body;
      Object.keys(data).forEach((key) => {
        task[key] = data[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ message: "Cannot find given id" });
    } else {
      res.status(500).send({ message: e.message });
    }
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.sendStatus(200);
    } else {
      res.status(400).send({ message: "Cannot find given id" });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ message: "Cannot find given id" });
    } else {
      res.status(500).send({ message: e.message });
    }
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
