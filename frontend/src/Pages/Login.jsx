import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const { login, isLoading, error } = useAuthStore();
  const [Data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(Data.email, Data.password);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" max-w-md w-full bg-gray-800 opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8 ">
        <h2 className="text-3xl  font-bold mb-6 text-center  bg-gradient-to-r from-green-400 to-emerald-500 text-transparent  bg-clip-text">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            name="email"
            icon={Mail}
            type="email"
            placeholder=" Email"
            value={Data.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            icon={Lock}
            type="password"
            placeholder="Password"
            value={Data.password}
            onChange={handleChange}
          />
          <div className="flex items-center mb-4">
            <Link
              to="/forgot-password"
              className=" text-sm  text-green-400  hover:underline"
            >
              Forgot Password?{" "}
            </Link>
          </div>
          {error && typeof error === "string" && (
            <p className=" text-red-500 font-semibold mt-2">{error}</p>
          )}

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {" "}
            {isLoading ? (
              <Loader className=" size-6  mx-auto animate-spin " />
            ) : (
              " Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className=" px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center ">
        <p className=" text-sm text-gray-100">
          Don&apos;t have an account{" "}
          <Link to="/signup" className=" text-green-400 hover:underline">
            {" "}
            Create Account{" "}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
