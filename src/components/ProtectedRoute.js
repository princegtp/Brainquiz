import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // Controls if the sidebar is collapsed or not
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Quiz",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };


  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className=" p-0 sm:p-4 relative">
      <div className="flex gap-2 w-full h-screen ">
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-sky-500 to-white m-1 md:m-0  sm:left-1 ${collapsed?'left-[0%]':''}  left-0 sm:relative absolute mt-[4rem] sm:m-0 md:mt-0 rounded-md text-white h-full z-10 transition-all duration-300 ${
            collapsed ? "translate-x-0" : "-translate-x-[110%]"
          } sm:translate-x-0`} // On mobile, hide sidebar, on desktop always visible
        >
          <div className=" mt-3 h-max">
            {menu.map((item, index) => (
              <div
                className={`menu-item  ${
                  getIsActiveOrNot(item.paths) && "active-menu-item"
                }`}
                key={index}
                onClick={()=>{
                  item.onClick()
                setCollapsed(false)
                }}
              >
                {item.icon}
                {<span>{item.title}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="body   ">
          <div className="p-1 relative rounded-md b bg-gradient-to-r from-sky-500 to-white  m-1 md:m-0 flex justify-between items-center  z-40">
            {/* Burger Menu Icon for Mobile */}
            <i
              className={`ri-menu-line  text-3xl md:hidden cursor-pointer text-white ${collapsed ? "hidden" : ""}`}
              onClick={() => setCollapsed(true)} // Show sidebar
            ></i>
            <i
              className={`ri-close-line text-3xl text-white sm:hidden cursor-pointer ${!collapsed ? "hidden" : ""}`}
              onClick={() => setCollapsed(false)} // Hide sidebar
            ></i>

            <h1 className="md:text-2xl flex   items-center ml-[-5rem]  text-lg md:ml-3 text-white "> <img className="w-[1.5rem]   mx-2  " src="/brainquiz.png"/>Quizflix</h1>


            <div className=" flex gap-1 text-black items-center">
              
              <span className="text-[0.7rem] text-gray-600 bg-slate-50 p-[0.2rem] rounded-md md:text-[0.9rem]">Role: {user?.isAdmin ? "Admin" : "User"}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex rounded-md  mt-1 ">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
