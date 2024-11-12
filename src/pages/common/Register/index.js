import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      values.type="register"
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen ">
     
     <img  className="w-[100%] bottom-[-10%]  md:w-[50%]  absolute left-[0%] rounded-3xl"  src="/c35cc787-1081-4f09-be81-2d4cf2581fd1(1)(1).webp"/>

      <div className="w-[90%] sm:w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6  bg-sky-200 bg-opacity-60     z-10  mb-[30%] md:mb-0 rounded-md ">
        <div className="flex flex-col ">
          <h1 className=" flex justify-center items-center text-center text-xl sm:text-3xl md:text-2xl  text-black font-thin">
          <img className="w-[1.6rem] m-1"   src="/brainquiz.png"/> Register<i class="ri-user-add-line ml-2"></i>
          </h1>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input  type="text"  className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"/>
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input  type="text" className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600" type="password" />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="w-full mt-3 bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 focus:outline-none text-sm sm:text-base md:text-lg"
              >
                Register
              </button>
              <Link to="/login" className="text-center text-gray-700  underline text-sm sm:text-base md:text-lg">Already a member? Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
