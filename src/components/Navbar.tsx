'use client'
import React, { useContext, useState } from 'react'
import "bootstrap-icons/font/bootstrap-icons.css"
import Link from 'next/link';
import { apiPost } from '@/helpers/axiosRequest';
import { useRouter } from 'next/navigation';
import UserContext from '@/context/userContext';


const Navbar = () => {

  const router = useRouter()
  const context = useContext(UserContext)

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
  };


  const onLogout = async () => {

    console.log("click lgout");
    try {
      const res = await apiPost('/api/user/logout', {})
      console.log(res);
      // router.push('/')
      context?.setUser(undefined)
      router.refresh()

    } catch (error) {
      console.log("er");
      console.log(error);
      setTimeout(() => {
        console.log("sdf");
      }, 5000);
    }
    

    

  };



  return (
    <div>
      <header className="header">
        <div className="header__container">
          {/* <img src="assets/img/perfil.jpg" alt="" className="header__img" /> */}

          <Link href="/" className="header__logo">SwaLay</Link>

          <div className="header__search">
            <input type="search" placeholder="Search" className="header__input" />
            <i className='bx bx-search header__icon'></i>
          </div>

          <div className="header__toggle">
            <i className={`bi ${showMenu ? 'bi-x' : 'bi-list'}`} id="header-toggle" onClick={toggleMenu} ></i>
          </div>
        </div>
      </header>

      <div className={`nav ${showMenu ? 'show-menu' : ''}`} id="navbar">
        <nav className="nav__container">
          <div>
            <Link href="/" className="nav__link nav__logo">
              <i className='bx bxs-disc nav__icon' ></i>
              <span className="nav__logo-name">SwaLay</span>
            </Link>

            <div className="nav__list">
              <div className="nav__items">

             
                <Link href="/" className="nav__link active" onClick={handleLinkClick}>
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
                      <Link href="/albums/new-release" className="nav__dropdown-item">New release</Link>
                      <Link href="/albums/all" className="nav__dropdown-item">Albums</Link>
                      <Link href="/albums/draft" className="nav__dropdown-item">Draft Albums</Link>
                      <Link href="/albums/live" className="nav__dropdown-item">Live albums</Link>
                      <Link href="/albums/rejected" className="nav__dropdown-item">Rejeted albums</Link>
                    </div>
                  </div>

                </div>

                

                <div className="nav__dropdown">
                <Link href="/payments" className="nav__link ">
                  <i className="bi bi-vinyl nav__icon"></i>
                    <span className="nav__name">Payments</span>
                    <i className="bi bi-chevron-down nav__icon nav__dropdown-icon"></i>
                  </Link>

                <div className="nav__dropdown-collapse ">
                    <div className="nav__dropdown-content">
                      <Link href="/payments/all" className="nav__dropdown-item">All</Link>
                      <Link href="/payments/pending" className="nav__dropdown-item">Pending</Link>
                      <Link href="/payments/completed" className="nav__dropdown-item">Completed</Link>
                      <Link href="/payments/rejected" className="nav__dropdown-item">Rejeted</Link>
                      <Link href="/payments/failed" className="nav__dropdown-item">Failed</Link>
                    </div>
                  </div>

                  </div>


                <Link href="/labels" className="nav__link " onClick={handleLinkClick}>
                  <i className="bi bi-people nav__icon"></i>
                  <span className="nav__name ">Lables</span>
                </Link>

                <Link href="/copyrights" className="nav__link " onClick={handleLinkClick}>
                  <i className="bi bi-youtube nav__icon"></i>
                  <span className="nav__name ">Copyright</span>
                </Link>

                <Link href="/notifications" className="nav__link " onClick={handleLinkClick}>
                  <i className="bi bi-bell nav__icon"> </i>
                  <span className="nav__name ">Notifications</span>
                </Link>
                
                <Link href="/artists" className="nav__link " onClick={handleLinkClick}>
                  <i className="bi bi bi-mic nav__icon"></i>
                  <span className="nav__name">Artists</span>
                </Link>
                <Link href="/profile" className="nav__link " onClick={handleLinkClick}>
                <i className="bi bi-person nav__icon"></i>
                  <span className="nav__name">Profile</span>
                </Link>

                <Link href="/support" className="nav__link">
                  <i className="bi bi-chat-left nav__icon"></i>
                  <span className="nav__name">Support</span>
                </Link>
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
  )
}

export default Navbar