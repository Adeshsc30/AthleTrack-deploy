import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import Logo from "../assets/logo2.png";
import axios from "axios";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const dropdownRef = useRef(null);

  const toogleNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch tournaments from the backend
  useEffect(() => {
    axios
      .get("https://athle-track-backend-ecru.vercel.app/api/tournaments/")
      .then((response) => {
        setTournaments(response.data.allTournaments);
        setFilteredTournaments(response.data.allTournaments);
      })
      .catch((error) => {
        console.error("Error fetching tournament data:", error);
      });
  }, []);

  // Filter tournaments based on search input
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredTournaments(tournaments);
    } else {
      const filtered = tournaments.filter((tournament) =>
        tournament.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTournaments(filtered);
    }
  }, [searchText, tournaments]);

  const toggleNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle tournament selection
  const handleTournamentSelect = (tournament) => {
    // Update localStorage
    localStorage.setItem("selectedTournament", tournament.name);
    localStorage.setItem("selectedTournamentId", tournament._id);

    // Dispatch a custom event
    const event = new Event("tournamentChanged");
    window.dispatchEvent(event);

    // Redirect to /events if not already there
    if (location.pathname !== "/events") {
      navigate("/events");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 shadow-lg" : "bg-[#00000050]"
      }`}
    >
      <nav className="container mx-auto py-3 px-1 md:px-6 lg:px-8 flex justify-between items-center w-full backdrop-blur-sm">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-orange-500 text-2xl font-bold flex items-center z-20"
        >
          <img
            src={Logo}
            alt="AthleTrack Logo"
            className="w-auto h-[40px] md:h-[50px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center items-center space-x-8 text-white font-semibold text-md">
          <Link
            to="/"
            className={`tracking-wider transition-colors duration-200 ${
              location.pathname === "/"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "hover:text-orange-500"
            }`}
          >
            HOME
          </Link>
          <Link
            to="/events"
            className={`tracking-wider transition-colors duration-200 ${
              location.pathname === "/events"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "hover:text-orange-500"
            }`}
          >
            EVENTS
          </Link>
          <Link
            to="/upcoming"
            className={`tracking-wider transition-colors duration-200 ${
              location.pathname === "/upcoming"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "hover:text-orange-500"
            }`}
          >
            UPCOMING
          </Link>
          <Link
            to="/about"
            className={`tracking-wider transition-colors duration-200 ${
              location.pathname === "/about"
                ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                : "hover:text-orange-500"
            }`}
          >
            ABOUT US
          </Link>
        </div>
                {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-full bg-gray-900/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-3.5" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-center h-full space-x-2 text-white font-semibold text-xs">
            <Link
              to="/"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              HOME
            </Link>
            <span className="text-white">|</span>
            <Link
              to="/events"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/events"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              EVENTS
            </Link><span className="text-white">|</span>
            <Link
              to="/upcoming"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/upcoming"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              UPCOMING
            </Link><span className="text-white">|</span>
            <Link
              to="/about"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/about"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              ABOUT US
            </Link>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={toogleNavbar}>
              <IoMdClose
                className="text-white group-hover:text-orange-500 transition-colors duration-300"
                size={29}
              />
            </button>
          </div>
        </div>

        {/* User for mobile view */}
        <div className="lg:hidden flex gap-4 justify-center items-center">
          <div className="mt-1.5 mr-4">
            <button onClick={toogleNavbar} className="relative group hover:cursor-pointer">
              {isMenuOpen ? (
                <IoMdClose
                  className="hidden text-white group-hover:text-orange-500 transition-colors duration-300"
                  size={29}
                />
              ) : (
                <GiHamburgerMenu
                  className="text-white group-hover:text-orange-500 transition-colors duration-300"
                  size={29}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed top-0 left-0 w-full h-full bg-gray-900/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-3.5" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-center h-full space-x-2 text-white font-semibold text-xs">
            <Link
              to="/"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              HOME
            </Link>
            <span className="text-white">|</span>
            <Link
              to="/events"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/events"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              EVENTS
            </Link><span className="text-white">|</span>
            <Link
              to="/upcoming"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/upcoming"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              UPCOMING
            </Link><span className="text-white">|</span>
            <Link
              to="/about"
              className={`tracking-wider transition-colors duration-200 ${
                location.pathname === "/about"
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "hover:text-orange-500"
              }`}
            >
              ABOUT US
            </Link>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={toogleNavbar}>
              <IoMdClose
                className="text-white group-hover:text-orange-500 transition-colors duration-300"
                size={29}
              />
            </button>
          </div>
        </div>

        {/* Search Input (Desktop Only) */}
        <div className="relative hidden lg:block" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search tournaments"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`bg-gray-800/80 border ${
              searchFocused ? "border-orange-500" : "border-gray-600"
            } text-white px-4 py-2 pr-10 rounded-full placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 w-[200px] lg:w-[250px]`}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchText.trim() !== "" && (
            <div className="absolute top-full left-0 w-full bg-gray-800 text-white rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-10">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((tournament) => (
                  <div
                    key={tournament._id}
                    onClick={() => handleTournamentSelect(tournament)}
                    className="block px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {tournament.name}
                  </div>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-400">No tournaments found</p>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;