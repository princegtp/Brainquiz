import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Quiz Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
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

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
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
    getData(filters);
  }, []);

  return (
    <div className="md:w-full p-1">
      <PageTitle title="Reports" />
   

      {/* Filters Section */}
      <div className="flex gap-1 md:gap-2 mb-4">
        <input
          type="text"
          className="border outline-none rounded-md bg-white  focus:border-sky-500"
          placeholder="Quiz"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          className="border outline-none rounded-md bg-white focus:border-sky-500"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button
          className="text-xs px-1 md:px-5 border text-center border-sky-500 rounded-md"
          onClick={() => {
            setFilters({
              examName: "",
              userName: "",
            });
            getData({
              examName: "",
              userName: "",
            });
          }}
        >
          Clear
        </button>
        <button
          className="text-xs px-1 md:px-5 bg-sky-500 text-white rounded-md"
          onClick={() => getData(filters)}
        >
          Search
        </button>
      </div>

      {/* Mobile View: Card-like structure */}
      <div className="block md:hidden">
        {reportsData.map((report, index) => (
          <div key={index} className="bg-white p-2 md:p-4 rounded-md shadow-md mb-4">
            <div className="flex justify-between">
              <span className=" text-xs md:sm font-semibold   mb-1">Quiz Name:</span>
              <span className="text-end text-xs md:text-sm ">{report.exam.name}</span>
            </div>
            <div className="flex my-1 justify-between">
              <span className=" text-xs md:sm font-semibold">User Name:</span>
              <span className="text-end text-xs md:text-sm ">{report.user.name}</span>
            </div>
            <div className="flex my-1 justify-between">
              <span className=" text-xs md:sm font-semibold">Date:</span>
              <span className="text-xs md:text-sm text-end">{moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
            </div>
            <div className="flex my-1 justify-between">
              <span className=" text-xs md:sm font-semibold">Total Marks:</span>
              <span>{report.exam.totalMarks}</span>
            </div>
            <div className="flex my-1 justify-between">
              <span className=" text-xs md:sm font-semibold">Passing Marks:</span>
              <span className="text-end text-xs md:text-sm ">{report.exam.passingMarks}</span>
            </div>
            <div className="flex my-1 justify-between">
              <span className=" text-xs md:sm font-semibold">Obtained Marks:</span>
              <span className="text-end text-xs md:text-sm " >{report.result.correctAnswers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-xs md:sm font-semibold">Verdict:</span>
              <span>
                <Tag  color={report.result.verdict === "Pass" ? "green" : "red"}>
                  {report.result.verdict}
                </Tag>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Default View: Full table for large screens */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={reportsData}
          className="mt-2"
          scroll={{ x: 'max-content' }} // Add horizontal scroll for large tables
        />
      </div>
    </div>
  );
}

export default AdminReports;
