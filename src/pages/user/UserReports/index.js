import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Quiz Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
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
    getData(); // Load data on initial mount
  }, []);

  return (
    <div className="md:w-full p-2 md:bg-gray-100 rounded-md bg-sky-200 w-full flex flex-col items-center">
      <PageTitle title="Reports" />
      

      {/* Mobile View: Card-like structure */}
      <div className="block md:hidden   w-full">
        {reportsData.map((report, index) => (
          <div key={index} className="bg-white p-2 rounded-md shadow-md mb-4">
            <div className="flex justify-between">
              <span className=" text-xs md:text-sm text-end font-semibold">QuizName:</span>
              <span className="text-xs md:text-sm text-end">{report.exam.name}</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-xs md:text-sm text-end font-semibold">Date:</span>
              <span className="text-xs flex items-center">{moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-xs md:text-sm text-end font-semibold">Total Marks:</span>
              <span>{report.exam.totalMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-xs md:text-sm text-end font-semibold">Passing Marks:</span>
              <span>{report.exam.passingMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-xs md:text-sm text-end font-semibold">Obtained Marks:</span>
              <span>{report.result.correctAnswers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className=" font-semibold">Result:</span>
              <span>
                <Tag color={report.result.verdict === "Pass" ? "green" : "red"}>
                  {report.result.verdict}
                </Tag>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Default View: Full table for large screens */}
      <div className="hidden md:block  rounded-md w-full">
        <Table
          columns={columns}
          dataSource={reportsData}
          className="mt-2"
          scroll={{ x: "max-content" }} // Add horizontal scroll for large tables
        />
      </div>
    </div>
  );
}

export default UserReports;
