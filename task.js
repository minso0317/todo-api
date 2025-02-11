import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema); // 첫 매개변수: 컬렉션명, 두번째 매개변수: 정의한 스키마

export default Task;
