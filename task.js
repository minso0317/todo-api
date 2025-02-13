import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      validate: {
        validator: function (title) {
          return title.split(" ").length > 1; // 한 칸 공백을 설정해줘서 두 단어 이상으로 지정
        },
        message: () => "Must be at least 2 words", // 최소 타이틀 단어 수 지정
      },
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
