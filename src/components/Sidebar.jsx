import { useEffect, useState } from "react";
import "../styles/sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
const Sidebar = () => {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarActive(!isSidebarActive);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSubMenuOpen);
  };

  useEffect(() => {
    // Check for token on component mount and route changes
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Close sidebar on auth pages
    if (location.pathname === "/" || location.pathname === "/signup") {
      setSidebarActive(false);
    }
  }, [location]);

  const handleLogout = () => {
    // Remove token from session storage
    sessionStorage.removeItem("token");

    // Update authentication state
    setIsAuthenticated(false);

    // Redirect to login page
    navigate("/");
  };

  return (
    <>
      {isAuthenticated && (
        <>
          <div className="menu-btn " onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </div>

          <div className={`side-bar ${isSidebarActive ? "active" : ""}`}>
            <header>
              <div className="close-btn" onClick={toggleSidebar}>
                <i className="fas fa-times"></i>
              </div>
              <div className="sidebar-logo-container">
                <img className="sidebar-img" src={Logo} alt="profile" />
              </div>

              <h1>Kickoff Labs</h1>
            </header>
            <div className="menu">
              <div className="item">
                <Link to="/calendar">
                  <i className="fas fa-desktop"></i>Calendar
                </Link>
              </div>
              <div className="item">
                <a href="#" className="sub-btn" onClick={() => toggleSubMenu()}>
                  <i className="fas fa-table"></i>Tables
                  <i
                    className={`fas fa-angle-right dropdown ${
                      isSubMenuOpen ? "rotate" : ""
                    }`}
                  ></i>
                </a>
                {isSubMenuOpen && (
                  <div className="sub-menu">
                    <Link to="/table/completed" className="sub-item">
                      Completed Events
                    </Link>
                    <Link to="/table/running" className="sub-item">
                      Running Events
                      </Link>
                      <Link to="/table/upcoming" className="sub-item">
                      Upcoming Events
                      </Link>
                 
                  </div>
                )}
              </div>
              <div className="item logout" onClick={handleLogout}>
                <Link to="/">
                  <i className="fas fa-sign-out-alt"></i>Logout
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
