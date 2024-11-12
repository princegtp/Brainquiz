import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  // Fetch exams data from API
  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Delete exam
  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({type:"deleteExam", examId });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();  // Refresh data
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Define columns (headers)
  const columns = [
    { title: "Quiz Name", dataIndex: "name" },
    { title: "Duration", dataIndex: "duration" },
    { title: "Category", dataIndex: "category" },
    { title: "Total Marks", dataIndex: "totalMarks" },
    { title: "Passing Marks", dataIndex: "passingMarks" },
    { title: "Action", dataIndex: "action", render: (text, record) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500 flex items-center hover:text-blue-700"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          >
            <i className="ri-pencil-line"></i> Edit
          </button>
          <button
            className="text-red-500 flex items-center  hover:text-red-700"
            onClick={() => deleteExam(record._id)}
          >
            <i className="ri-delete-bin-line"></i> Delete
          </button>
        </div>
      ),
    },
  ];

  // Fetch exams when component mounts
  useEffect(() => {
    getExamsData();
  }, []);

  return (
    <div className="w-full p-1">
      <div className="flex justify-between items-center p-[0.2rem] mb-2 bg-white rounded-md shadow-sm px-1 ">
        <PageTitle title="Quizzes" />
        <button
          className="primary-outlined-btn rounded-md text-xs px-1 flex items-center"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line"></i> Add Quizzes
        </button>
      </div>
    

      {/* Custom Table for Larger Screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-md">
        <table className="min-w-full table-auto border-collapse border ">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.dataIndex} className="px-4 py-2 text-left text-xs md:text-sm font-medium  text-gray-700">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr key={exam._id} className="border-t ">
                  {columns.map((col) => (
                    <td key={col.dataIndex} className="px-4 py-2 text-xs md:text-base text-gray-800 ">
                      {col.render ? col.render(null, exam) : exam[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  No exams available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stacked Layout for Mobile Screens */}
      <div className="block md:hidden">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam._id} className="border-b bg-white border-gray-200 py-3 mb-4 rounded-md shadow-sm">
              <div className="mb-3 text-xs px-1 flex justify-between">
                <strong className="text-xs">Quiz Name:</strong> {exam.name}
              </div>
              <div className="mb-2 text-xs px-1 flex justify-between">
                <strong className="text-xs">Duration:</strong> {exam.duration} seconds
              </div>
              <div className="mb-2 text-xs px-1 flex justify-between">
                <strong className="text-xs">Category:</strong> {exam.category}
              </div>
              <div className="mb-2 text-xs px-1 flex justify-between">
                <strong className="text-xs">Total Marks:</strong> {exam.totalMarks}
              </div>
              <div className="mb-2 text-xs px-1 flex justify-between">
                <strong className="text-xs">Passing Marks:</strong> {exam.passingMarks}
              </div>

              <div className="flex gap-2 justify-center mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 text-xs flex justify-center items-center"
                  onClick={() => navigate(`/admin/exams/edit/${exam._id}`)}
                >
                  <i className="ri-pencil-line"></i> Edit
                </button>
                <button
                  className="text-red-500  text-xs flex justify-center items-center hover:text-red-700"
                  onClick={() => deleteExam(exam._id)}
                >
                  <i className="ri-delete-bin-line"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No Quizzes available.
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;
