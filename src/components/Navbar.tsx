"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import UserContext from "@/context/userContext";
// import Image from "next/image";

// Define the expected structure of the API response
interface SearchResponse {
  success: boolean;
  data: Array<{ albumName?: string; trackName?: string; albumId?: string; type: string }>;
}

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse['data']>([]); // Stores search results from API
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading state
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  
  const router = useRouter();
  const context = useContext(UserContext);
  // const userType = context?.user?.usertype; // Get user type from context
  // const labelId = context?.user?._id; // If not used, consider removing

  // Paths allowed for each user type
  const roleAllowedPaths = {
    customerSupport: ["/", "/albums", "/copyrights", "/labels", "/support"],
    contentDeployment: ["/", "/albums", "/copyrights", "/artists", "/support"],
    ANR: ["/", "/albums", "/marketing", "/artists", "/notifications"],
  };

  // Define all navigation items and their dropdowns
  const menuItems = [
    { path: "/", name: "Home", icon: "bi-house-door" },
    {
      path: "/albums",
      name: "Albums",
      icon: "bi-vinyl",
      dropdown: [
        { path: "/albums/new-release", name: "New Release" },
        { path: "/albums/all", name: "All Albums" },
        { path: "/albums/approved", name: "Approved Albums" },
        { path: "/albums/live", name: "Live Albums" },
        { path: "/albums/rejected", name: "Rejected Albums" },
      ],
    },
    { path: "/marketing", name: "Marketing", icon: "bi-megaphone" },
    {
      path: "/payments",
      name: "Payments",
      icon: "bi-wallet",
      dropdown: [
        { path: "/payments/royalty", name: "Royalty" },
        { path: "/payments/all", name: "Payout Requests" },
        { path: "/payments/pending", name: "Pending Payout" },
        { path: "/payments/approved", name: "Approved Payout" },
        // { path: "/payments/rejected", name: "Rejected Payments" },
        // { path: "/payments/failed", name: "Failed Payments" },
      ],
    },
    { path: "/copyrights", name: "Copyrights", icon: "bi-youtube" },
    { path: "/labels", name: "Labels", icon: "bi-people" },
    { path: "/artists", name: "Artists", icon: "bi-mic" },
    { path: "/notifications", name: "Notifications", icon: "bi-bell" },
    { path: "/profile", name: "Profile", icon: "bi-person" },
    { path: "/employees", name: "Employees", icon: "bi-gear" },
    { path: "/support", name: "Support", icon: "bi-chat-left" },
  ];

  // Filter menu items based on the user type
  const userType = context?.user?.usertype || ""; // Provide a default empty string if userType is undefined



  const allowedPaths =
    roleAllowedPaths[userType as keyof typeof roleAllowedPaths] || [];

  const filteredMenuItems = menuItems.filter((item) => {
    // Admin has access to all menus and dropdowns
    if (userType === "admin") return true;

    // Check for dropdown items
    if (item.dropdown) {
      // Check if any dropdown item is allowed
      const hasAllowedDropdown = item.dropdown.some((subItem) =>
        allowedPaths.includes(subItem.path)
      );

      // Include parent menu if at least one dropdown or parent path is allowed
      return hasAllowedDropdown || allowedPaths.includes(item.path);
    }

    // For non-dropdown items, check if the path is allowed
    return allowedPaths.includes(item.path);
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response: SearchResponse | null = await apiGet(`/api/search?query=${query}`);

      if (response && response.success) {
        setSearchResults(response.data); // Store search results
        setShowSuggestions(true); // Show suggestions dropdown
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error); // Log the error
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger search API if search term is not empty
    if (searchTerm.trim().length > 0) {
      handleSearch(searchTerm);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = async () => {
    try {
      await apiPost("/api/user/logout", {});
      context?.setUser(undefined);
      router.refresh();
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <div>
      <header className="header dark">
        <div className="header__container dark ">
          <Link href="/" className="header__logo ">
            SwaLay
          </Link>

          <div className="header__search">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative dark">
                <input
                  id="search"
                  name="search"
                  className="header__input text-white"
                  placeholder="Search album or track"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>

              {loading && <p>Loading...</p>}

              {/* Display search results dynamically */}
              {showSuggestions && searchResults.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-12 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                      onClick={() => {
                        setSearchTerm(result.albumName || result.trackName || "");
                        setShowSuggestions(false);
                        // Redirect to the appropriate page
                        const albumId = result.albumId || ""; // Default to an empty string if albumId is undefined
                        if (result.type === "album") {
                          router.push(`/albums/viewalbum/${btoa(albumId)}`);
                        } else if (result.type === "track") {
                          router.push(`/albums/viewalbum/${btoa(albumId)}`);
                        }
                      }}
                    >
                      <Link href="#">
                        {result.type === "album"
                          ? `Album: ${result.albumName}`
                          : `Track: ${result.trackName} (Album: ${result.albumName})`}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header__toggle dark">
            <i
              className={`bi ${showMenu ? "bi-x" : "bi-list"}`}
              id="header-toggle"
              onClick={toggleMenu}
            ></i>
          </div>
        </div>
      </header>

      <div className={`nav ${showMenu ? "show-menu" : ""}`} id="navbar">
        <nav className="nav__container">
          <div>
            <Link href="/" className="nav__link nav__logo">
              <i className="bx bxs-disc nav__icon"></i>
              <span className="nav__logo-name">SwaLay</span>
            </Link>

            <div className="nav__list">
              <div className="nav__items">
                {filteredMenuItems.map((item, index) => (
                  <div key={index}>
                    {item.dropdown ? (
                      <div className="nav__dropdown">
                        <Link href={item.path} className="nav__link">
                          <i className={`bi ${item.icon} nav__icon`}></i>
                          <span className="nav__name">{item.name}</span>
                          <i className="bi bi-chevron-down nav__icon nav__dropdown-icon"></i>
                        </Link>
                        {item.dropdown && (
                          <div className="nav__dropdown-collapse">
                            <div className="nav__dropdown-content">
                              {item.dropdown
                                .filter(
                                  (subItem) =>
                                    userType === "admin" ||
                                    allowedPaths.includes(subItem.path)
                                )
                                .map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    href={subItem.path}
                                    className="nav__dropdown-item"
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        className="nav__link"
                        onClick={handleLinkClick}
                      >
                        <i className={`bi ${item.icon} nav__icon`}></i>
                        <span className="nav__name">{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}

        
              </div>
            </div>
          </div>

          <div className="nav__link nav__logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-left nav__icon"></i>
            <span className="nav__name">Log Out</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
