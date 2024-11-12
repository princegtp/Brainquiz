import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions, setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result, setResult] = React.useState({});
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [params.id]);

  // Retake Exam logic to reset everything and start from instructions page
  const handleRetakeExam = () => {
    // Reset states
    setSelectedQuestionIndex(0);
    setSelectedOptions({});
    setResult({});
    setSecondsLeft(examData.duration);
    setTimeUp(false);

    // Redirect to instructions view
    setView("instructions");
  };

  return (
    examData && (
      <div className="mt-2 m-auto flex flex-col w-full items-center justify-center">
        <div className="divider"></div>
        <h1 className="py-1 text-xl border-b border-gray-300 text-center w-[90%]">
          {examData.name}
        </h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-1 w-[80%] md:w-[50%]">
            <div className="flex justify-between">
              <h1 className="text-sm md:text-md">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>
              <span className="bg-sky-500 px-[0.4rem] flex justify-center items-center rounded-md">
                <span className="text-[1rem]">{secondsLeft}</span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xs">
                        {option} :{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-center">
              {selectedQuestionIndex > 0 && (
                <button
                  className="rounded-md"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="bg-sky-500 text-white rounded-md"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="bg-sky-500 text-white rounded-md"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex md:flex-row sm:flex-col md:w-auto w-[90%] items-center mt-2 justify-center result">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">RESULT</h1>

              <div className="marks flex flex-col gap-1">
                <h1 className="text-xs md:text-md">Total Marks : {examData.totalMarks}</h1>
                <h1 className="text-xs md:text-md">
                  Obtained Marks : {result.correctAnswers.length}
                </h1>
                <h1 className="text-xs md:text-md">
                  Wrong Answers : {result.wrongAnswers.length}
                </h1>
                <h1 className="text-xs md:text-md">
                  Passing Marks : {examData.passingMarks}
                </h1>
                <h1 className="text-xs md:text-md">VERDICT : {result.verdict}</h1>

                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs outline outline-1 outline-sky-500 text-sky-500 rounded-md"
                    onClick={handleRetakeExam}
                  >
                    Retake Quiz
                  </button>
                  <button
                    className="bg-sky-500 text-xs rounded-md"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[5rem]">
              {result.verdict === "Pass" && (
                <img className="w-[5rem]" src="/gold-winner-trophy-icon.png" />
              )}

              {result.verdict === "Fail" && (
                <img className="w-[5rem]" src="/loser.png" />
              )}
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col items-center gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`
                  flex flex-col gap-1 p-2 w-[90%] rounded-md  ${
                    isCorrect ? "bg-green-400" : "bg-red-400"
                  }
                `}
                >
                  <h1 className="text-xs font-semibold">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-[0.7rem] md:text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-[0.7rem] md:text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn text-xs rounded-md"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
              <button
                className="primary-contained-btn text-xs rounded-md"
                onClick={handleRetakeExam}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
