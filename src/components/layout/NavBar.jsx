import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes, FaClipboardList } from "react-icons/fa";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // You may want to fetch the user's role from your profile table
  // For now, assume user?.role is available (otherwise, fetch it)
  const isStaff = user?.role === "staff";

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { to: "/events", label: "Events", show: true },
    { to: "/dashboard", label: <FaUserCircle size={22} />, show: !!user },
    { to: "/manage-events", label: "Manage Events", show: isStaff },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* App Title */}
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 flex-shrink-0"
          >
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
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(link.to)
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ml-4"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ml-4"
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
        <div className="sm:hidden bg-white shadow-md px-4 pt-2 pb-4 space-y-2">
          {navLinks.map(
            (link) =>
              link.show && (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.to)
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label === <FaUserCircle size={22} /> ? (
                    <span className="flex items-center gap-2">
                      <FaUserCircle size={20} /> Dashboard
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              )
          )}
          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 hover:bg-indigo-100"
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
