import { Col, Form, message, Row, Select, Table } from "antd";
import React, { useEffect } from "react";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { Tabs } from "antd";
import AddEditQuestion from "./AddEditQuestion";
const { TabPane } = Tabs;

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = React.useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const params = useParams();
  
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id,
        });
      } else {
        response = await addExam(values);
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        type:"deleteQuestion",
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => (
          <div key={key}>
            {key}: {record.options[key]}
          </div>
        ));
      },
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => {
        return ` ${record.correctOption}: ${
          record.options[record.correctOption]
        }`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 w-full bg-white">
      <PageTitle title={params.id ? "Edit Quizzes" : "Add Quizzes"} />
      <div className="  my-4"  />

      {(examData || !params.id) && (
        <Form layout="vertical"  onFinish={onFinish} initialValues={examData}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Quiz Details" key="1">
              <Row gutter={[16, 16]} className="">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Quiz Name"  name="name">
                    <input
                      className="border rounded-md w-full p-2"
                      type="text"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Quiz Duration" name="duration">
                    <input
                      className="border rounded-md w-full p-2"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Category" name="category">
                    <select className="border rounded-md w-full p-2">
                      <option value="">Select Category</option>
                      <option value="Maths">Maths</option>
                      <option value="Computer">Computer</option>
                      <option value="English">English</option>
                      <option value="Technology">Technology</option>
                      <option value="GK">GK</option>
                      <option value="Science">Science</option>
                      <option value="Environment">Environment</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Total Marks" className="text-red-500" name="totalMarks">
                    <input
                      className="border rounded-md w-full p-2"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label="Passing Marks" name="passingMarks">
                    <input
                      className="border rounded-md w-full p-2"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-end gap-2 my-2">
                <button
                  className="primary-outlined-btn rounded-md"
                  type="button"
                  onClick={() => navigate("/admin/exams")}
                >
                  Cancel
                </button>
                <button className="primary-contained-btn rounded-md" type="submit">
                  Save
                </button>
              </div>
            </TabPane>
            {params.id && (
              <TabPane tab="Questions" key="2">
              <div className="flex justify-end mb-4">
                <button
                  className="primary-outlined-btn text-xs md:text-md rounded-md p-1 md:"
                  type="button"
                  onClick={() => setShowAddEditQuestionModal(true)}
                >
                  Add Question
                </button>
              </div>
            
              {/* Responsive Table for Desktop */}
              <div className=" hidden md:block overflow-x-auto w-full">
                <Table
                  columns={questionsColumns}
                  dataSource={examData?.questions || []}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </div>
            
              {/* Stacked Layout for Mobile */}
              <div className="block md:hidden">
                {examData?.questions && examData.questions.length > 0 ? (
                  examData.questions.map((question) => (
                    <div
                      key={question._id}
                      className="border-b border-gray-200 py-4 px-2 mb-4 rounded-md shadow-sm"
                    >
                      <div className="mb-2 text-xs">
                        <strong className="text-xs md:text-md ">Question:</strong> {question.name}
                      </div>
                      <div className="mb-2 text-xs">
                        <strong className="text-xs md:text-md ">Options:</strong>
                        <ul className="list-disc pl-5">
                          {Object.keys(question.options).map((key) => (
                            <li key={key}>
                              {key}: {question.options[key]}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-2 text-xs">
                        <strong className="text-xs md:text-md ">Correct Option:</strong> {question.correctOption}: {question.options[question.correctOption]}
                      </div>
            
                      <div className="flex gap-2 mt-4">
                      <button
  type="button" // Specify type as button to avoid form submission
  className="flex justify-center items-center text-xs md:text-md text-blue-500 hover:text-blue-700"
  onClick={(e) => {
    e.preventDefault(); // Prevent any unintended form submission
    setSelectedQuestion(question);
    setShowAddEditQuestionModal(true);
  }}
>
  <i className="ri-pencil-line"></i> Edit
</button>
                        <button
                        type="button"
                          className="text-red-500 flex  justify-center items-center  text-xs md:text-md  hover:text-red-700"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent any unintended form submission
                            deleteQuestion(question._id);
                          }}
                        >
                          <i className="ri-delete-bin-line"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No questions available.
                  </div>
                )}
              </div>
            </TabPane>
            
            )}
          </Tabs>
        </Form>
      )}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
  );
}

export default AddEditExam;
