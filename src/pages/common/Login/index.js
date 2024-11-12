import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      values.type="login"
      console.log(values)

      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen w-full relative "
     
    >
    
{/* 
      <svg id='patternId' className="absolute" width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='50' height='33.333' patternTransform='scale(2) rotate(30)'><rect x='0' y='0' width='100%' height='100%' fill='#2b2b3100'/><path d='M25 .806v2.79h.8V.806Zm0 4.465v2.791h.8v-2.79Zm-2.043 3.902-2.32 1.55.444.665 2.32-1.55-.443-.665zm4.885 0-.444.665 2.32 1.55.445-.665zM-.4 10.61v2.79h.8v-2.79zm50 0v2.79h.8v-2.79zm-30.356 1.042-2.32 1.55.443.666 2.322-1.55-.444-.666zm12.311 0-.444.665 2.32 1.55.445-.664zm3.783 2.566-.444.666 2.321 1.55.444-.666zm-19.852.025-2.32 1.55.444.665 2.32-1.55zm-15.886.77v2.79h.8v-2.79Zm50 0v2.79h.8v-2.79Zm-50 4.465v2.79h.8v-2.79h-.8Zm50 0v2.79h.8v-2.79h-.8zM2.442 23.379l-.444.665 2.32 1.55.445-.665zm45.115 0-2.32 1.55.443.666 2.322-1.55-.444-.666zM6.155 25.86l-.444.665 2.32 1.55.445-.665zm37.69 0-2.322 1.55.444.665 2.321-1.55-.444-.666zM9.937 28.424l-.444.665 2.32 1.55.445-.665-2.321-1.55zm30.11.003-2.321 1.55.444.666 2.321-1.55zM25 29.737v2.79h.8v-2.79z'  stroke-width='1' stroke='none' fill='#03a9f4ff'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)'/></svg>
     */}

      <img  className="w-[100%] bottom-[0%]  md:w-[50%]  absolute left-[0%] rounded-3xl"  src="/c35cc787-1081-4f09-be81-2d4cf2581fd1(1)(1).webp"/>


      <div className=" w-[90%] sm:w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6  bg-sky-200 bg-opacity-60     z-10  mb-[30%] md:mb-0 rounded-md  ">
        <div className="flex flex-col">
          {/* Title with responsive text sizes */}
          <div className=" justify-center  mb-4">
            <h1 className=" flex  justify-center items-center text-xl sm:text-3xl md:text-2xl  text-black font-thin">
              <img className="w-[1.6rem] m-1"   src="/brainquiz.png"/> Login
            </h1>
          </div>
          <div className="divider"></div>
          <Form layout="vertical" className="mt-4" onFinish={onFinish}>
            {/* Email input label with responsive font size */}
            <Form.Item name="email" label={<span className="text-sm sm:text-base md:text-lg">Email</span>}>
              <input
                type="text"
                className="w-full px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </Form.Item>

            {/* Password input label with responsive font size */}
            <Form.Item name="password" label={<span className="text-sm sm:text-base md:text-lg">Password</span>}>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </Form.Item>

            <div className="flex flex-col gap-4 mt-6">
              {/* Login button with responsive text size */}
              <button
                type="submit"
                className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 focus:outline-none text-sm sm:text-base md:text-lg"
              >
                Login
              </button>
              {/* Link with responsive font size */}
              <Link
                to="/register"
                className="text-center text-gray-700  underline text-sm sm:text-base md:text-lg"
              >
                Not a member? Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
