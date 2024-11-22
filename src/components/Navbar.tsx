"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import UserContext from "@/context/userContext";
// import Image from "next/image";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // Stores search results from API
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading state
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const router = useRouter();
  const context = useContext(UserContext);
  // const userType = context?.user?.usertype; // Get user type from context
  const labelId = context?.user?._id;

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
        { path: "/payments/all", name: "All Payments" },
        { path: "/payments/pending", name: "Pending Payments" },
        { path: "/payments/completed", name: "Completed Payments" },
        { path: "/payments/rejected", name: "Rejected Payments" },
        { path: "/payments/failed", name: "Failed Payments" },
      ],
    },
    { path: "/copyright", name: "Copyrights", icon: "bi-youtube" },
    { path: "/labels", name: "Labels", icon: "bi-people" },
    { path: "/artists", name: "Artists", icon: "bi-mic" },
    { path: "/notifications", name: "Notifications", icon: "bi-bell" },
    { path: "/profile", name: "Profile", icon: "bi-person" },
    { path: "/settings", name: "Settings", icon: "bi-gear" },
    { path: "/support", name: "Support", icon: "bi-chat-left" },
  ];

  // Filter menu items based on the user type
  const userType = context?.user?.usertype || ""; // Provide a default empty string if userType is undefined

  console.log("userType");
  console.log(userType);

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

    if (query === "") {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiGet(`/api/search?query=${query}`);

      console.log("response : ");
      console.log(response);

      if (response.success) {
        setSearchResults(response.data); // Store search results
        setShowSuggestions(true); // Show suggestions dropdown
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
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
    console.log("click logout");
    try {
      const res = await apiPost("/api/user/logout", {});
      console.log(res);
      context?.setUser(undefined);
      router.refresh();
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header__container">
          <Link href="/" className="header__logo">
            SwaLay
          </Link>

          <div className="header__search">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  name="search"
                  className="header__input"
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
                        setSearchTerm(result.albumName || result.trackName);
                        setShowSuggestions(false);
                        // Redirect to the appropriate page
                        if (result.type === "album") {
                          router.push(
                            `/albums/viewalbum/${btoa(result.albumId)}`
                          );
                        } else if (result.type === "track") {
                          router.push(
                            `/albums/viewalbum/${btoa(result.albumId)}`
                          );
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

          <div className="header__toggle">
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

                {/* <Link
                  href="/"
                  className="nav__link active"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-house-door nav__icon"></i>
                  <span className="nav__name">Home</span>
                </Link>

                <div className="nav__dropdown">
                  <Link href="/albums" className="nav__link ">
                    <i className="bi bi-vinyl nav__icon"></i>
                    <span className="nav__name">Albums</span>
                    <i className="bi bi-chevron-down nav__icon nav__dropdown-icon"></i>
                  </Link>

                  <div className="nav__dropdown-collapse ">
                    <div className="nav__dropdown-content">
                      <Link
                        href="/albums/new-release"
                        className="nav__dropdown-item"
                      >
                        New release
                      </Link>
                      <Link href="/albums/all" className="nav__dropdown-item">
                        Albums
                      </Link>
                      <Link
                        href="/albums/approved"
                        className="nav__dropdown-item"
                      >
                        Approved
                      </Link>
                      <Link href="/albums/live" className="nav__dropdown-item">
                        Live albums
                      </Link>
                      <Link
                        href="/albums/rejected"
                        className="nav__dropdown-item"
                      >
                        Rejected albums
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/marketing"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-megaphone nav__icon"></i>
                  <span className="nav__name">Marketing</span>
                </Link>

                <div className="nav__dropdown">
                  <Link href="/payments" className="nav__link ">
                    <i className="bi bi-vinyl nav__icon"></i>
                    <span className="nav__name">Payments</span>
                    <i className="bi bi-chevron-down nav__icon nav__dropdown-icon"></i>
                  </Link>

                  <div className="nav__dropdown-collapse ">
                    <div className="nav__dropdown-content">
                      <Link href="/payments/all" className="nav__dropdown-item">
                        All
                      </Link>
                      <Link
                        href="/payments/pending"
                        className="nav__dropdown-item"
                      >
                        Pending
                      </Link>
                      <Link
                        href="/payments/completed"
                        className="nav__dropdown-item"
                      >
                        Completed
                      </Link>
                      <Link
                        href="/payments/rejected"
                        className="nav__dropdown-item"
                      >
                        Rejeted
                      </Link>
                      <Link
                        href="/payments/failed"
                        className="nav__dropdown-item"
                      >
                        Failed
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/copyrights"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-youtube nav__icon"></i>
                  <span className="nav__name ">Copyright</span>
                </Link>

                <Link
                  href="/labels"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-people nav__icon"></i>
                  <span className="nav__name">Lables</span>
                </Link>

                <Link
                  href="/artists"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi bi-mic nav__icon"></i>
                  <span className="nav__name">Artists</span>
                </Link>

                <Link
                  href="/notifications"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-bell nav__icon"></i>
                  <span className="nav__name">Notification</span>
                </Link>

                <Link
                  href="/profile"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-person nav__icon"></i>
                  <span className="nav__name">Profile</span>
                </Link>

                <Link
                  href="/settings"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-gear nav__icon"></i>
                  <span className="nav__name">Settings</span>
                </Link>

                <Link href="/support" className="nav__link">
                  <i className="bi bi-chat-left nav__icon"></i>
                  <span className="nav__name">Support</span>
                </Link> */}
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
