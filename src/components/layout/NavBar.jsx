import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isStaff = user?.role === "staff";

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      to: "/events",
      label: "Events",
      icon: <FaCalendarAlt className="mr-1" />,
      show: true,
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaUserCircle className="mr-1" />,
      show: !!user,
    },
    {
      to: "/manage-events",
      label: "Manage Events",
      icon: <FaClipboardList className="mr-1" />,
      show: isStaff,
    },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-10 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/90 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* App Title */}
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 flex items-center"
          >
            <FaCalendarAlt className="mr-2" />
            Events Compass
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map(
              (link) =>
                link.show && (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium hover:text-indigo-600 transition-colors ${
                      isActive(link.to)
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger for mobile */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2 absolute w-full">
          {navLinks.map(
            (link) =>
              link.show && (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.to)
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
          )}
          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="flex w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="flex px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-100 "
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
