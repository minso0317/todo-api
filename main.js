import express from "express";
import mongoose from "mongoose";
import Task from "./task.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

await mongoose.connect(process.env.DATABASE_URL);

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id" });
      } else if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const data = req.body;

    const newTask = await Task.create(data);

    res.status(201).send(newTask);
  })
);

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    // sort, count
    const count = Number(req.query.count) || 0; // count가 없어서 undefined 일 때 0으로 출력
    const sortOption =
      req.query.sort === "oldest"
        ? ["createdAt", "asc"]
        : ["createdAt", "desc"];
    const tasks = await Task.find().limit(count).sort([sortOption]);
    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
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
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.sendStatus(200);
    } else {
      res.status(404).send({ message: "Cannot find given id" });
    }
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
