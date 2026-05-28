
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const server = "http://localhost:5000";

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setIsAuth(false);
        return;
      }

      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: token,
        },
      });

      setUser(data.user);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    }
  };

  const loginUser = async (email, password, navigate, fetchMyCourse) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      if (fetchMyCourse) fetchMyCourse();

      await fetchUser();

      toast.success(data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("activation", data.activationToken);

      toast.success(data.message || "OTP sent");

      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const verifyOtp = async (otp, navigate) => {
    setBtnLoading(true);
    try {
      const activationToken = localStorage.getItem("activation");

      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      localStorage.removeItem("activation");

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        btnLoading,
        loginUser,
        registerUser,
        fetchUser,
        verifyOtp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);