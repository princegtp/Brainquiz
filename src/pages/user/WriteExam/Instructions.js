import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-2 gap-1">
      <ul className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl underline">Instructions</h1>
        <li className="text-xs md:text-sm text-gray-600">Quiz must be completed in {examData.duration} seconds.</li>
        <li className="text-xs md:text-sm text-gray-600">
          Quiz will be submitted automatically after {examData.duration}{" "}
          seconds.
        </li>
        <li className="text-xs md:text-sm text-gray-600">Once submitted, you cannot change your answers.</li>
        <li className="text-xs md:text-sm text-gray-600">Do not refresh the page.</li>
        <li className="text-xs md:text-sm text-gray-600">
          You can use the <span className="font-bold">"Previous"</span> and{" "}
          <span className="font-bold">"Next"</span> buttons to navigate between
          questions.
        </li>
        <li className="text-xs md:text-sm text-gray-600">
          Total marks of the quiz is{" "}
          <span className="font-bold">{examData.totalMarks}</span>.
        </li>
        <li className="text-xs md:text-sm text-gray-600">
          Passing marks of the quiz is{" "}
          <span className="font-bold">{examData.passingMarks}</span>.
        </li>
      </ul>

      <div className="flex gap-2">
        <button className="primary-outlined-btn  text-sm md:text-md rounded-md"
         onClick={()=>navigate('/')}
        >
              CLOSE
        </button>
        <button
          className="primary-contained-btn text-sm md:text-md  rounded-md"
          onClick={() => {
            startTimer();
            setView("questions");
          }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default Instructions;
