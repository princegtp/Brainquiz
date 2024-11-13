import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();

      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div className="w-full h-screen bg-white">

        <PageTitle title={`Hi ${user.name}, Welcome to Quizflix`} />
        
        {/* Card Grid Layout */}
        <Row gutter={[20, 20]} className="flex justify-evenly w-full ">
          {exams.map((exam) => (
            <Col
              key={exam._id}
              className="col-span-2 md:col-span-5 lg:col-span-4 w-[90%] md:w-[20rem]"
            >
              <div className="transform hover:scale-105 duration-300 shadow-md rounded-md bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100 p-2 flex flex-col items-center relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 opacity-20 z-0"></div>

                {/* Exam Title */}
                <h1 className="outline outline-1 md:text- l outline-sky-200 text-gray-700 text-center capitalize shadow-sm w-full font-semibold font-900 px-2 py-1 m-2 rounded-lg break-words z-10 relative">
                  {exam?.name}
                </h1>

                {/* Exam Details */}
                <div className="w-full my-2 space-y-2 z-10 relative">
                  <h2 className=" flex justify-between text-sm text-gray-700 font-sour-gummy">
                    Category: <span className="text-gray-600 ">{exam.category}</span>
                  </h2>
                  <h3 className="text-sm flex justify-between text-gray-700">
                    Total Marks: <span className="text-gray-600">{exam.totalMarks}</span>
                  </h3>
                  <h3 className="text-sm flex justify-between text-gray-700">
                    Passing Marks: <span className="text-gray-600">{exam.passingMarks}</span>
                  </h3>
                  <h3 className="text-sm flex justify-between text-gray-700">
                    Duration: <span className="text-gray-600">{exam.duration} seconds </span>
                  </h3>
                </div>

                {/* Start Quiz Button */}
                <button
                  className="bg-sky-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-sky-600 w-full transform transition duration-300 ease-in-out z-10 relative"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Quiz
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
