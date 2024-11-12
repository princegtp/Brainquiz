const serverurl = process.env.REACT_APP_SERVER_URL 
console.log(serverurl)
const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post(`${serverurl}/api/users/login-regist`, payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post(`${serverurl}/api/users/login-regist`, payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post(`${serverurl}/api/users/get-user-info`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
