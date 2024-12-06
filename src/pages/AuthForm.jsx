import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/authForm.css";
import Email from "../assets/email.svg";
import Password from "../assets/password.svg";

const AuthForm = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const validate = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = "Username is required."
    }
    else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = "Username must contain only alphanumeric characters.";
    }

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const endpoint = isSignup ? "/auth/register/" : "/auth/login/";
        const response = await axios.post(`${baseUrl}${endpoint}`, { 
          username, 
          password 
        });

        // Store token in session storage
        sessionStorage.setItem('token', response.data.token);
        
        // Navigate to calendar page after successful login/signup
        navigate('/calendar');
      } catch (error) {
        console.error(`Error during ${isSignup ? "signup" : "login"}:`, error);
        
        // Handle specific error messages
        const errorMessage = error.response?.data?.message || 
          `${isSignup ? "Signup" : "Login"} failed. Please try again.`;
        
        setErrors(prev => ({
          ...prev, 
          submit: errorMessage
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-form-container">
      <div className="left">
    
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h4>
          We are <span>Kickoff Labs</span>
        </h4>
        <p>
          {isSignup
            ? "Create your account to join us:"
            : "Welcome back! Log in to your account"}
        </p>

        <div className="floating-label">
          <img src={Email} className="auth-icons" alt="Email" />
          <input
            type="string"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="floating-label">
          <img src={Password} alt="Password" className="auth-icons" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
         
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button 
          className="auth-form-buttons" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign up" : "Log in"}
        </button>
        <button 
          className="auth-form-buttons switch-button" 
          type="button"
          onClick={() => isSignup ? navigate("/") : navigate("/signup")}
        >
          {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;