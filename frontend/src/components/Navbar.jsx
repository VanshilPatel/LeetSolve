import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
     const navigate = useNavigate();

     const handleClick = ()=>{
        navigate('/');
     }
     const handleSignUp = ()=>{
        navigate('/signup');
     }
     const handleLogin = ()=>{
        navigate('/login');
     }

  return (
    <nav className="bg-gray-900  text-white py-4 px-6 flex justify-between items-center shadow-lg">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <div className="px-4 py-2  hover:bg-gray-700 transition">
          CodeAlgo
        </div>
        <button className="px-4 py-2 rounded-lg hover:bg-gray-700 transition" onClick={handleClick}>
          Problems
        </button>
        <button className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          Contests
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition" onClick={handleSignUp}>
          Register
        </button>
        <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
