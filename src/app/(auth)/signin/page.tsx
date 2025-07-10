"use client";
import Link from "next/link";
import Styles from "../Styles/Signin.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 && emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length > 0;
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response: any = await apiPost("/api/admin/verifyOTP", {
        email: user.email,
        otp,
      });

      console.log(response);

      if (response.success) {
        toast.success("Login successful");
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        toast.error(response.error || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async () => {
    if (!validateEmail(user.email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!validatePassword(user.password)) {
      toast.error("Enter a valid Password");
      return;
    }

    setLoading(true);
    try {
      const response: any = await apiPost("/api/admin/signin", user);

      if (response.success) {
        toast.success("OTP sent to your email");
        setShowOtpInput(true);
      } else {
        toast.error(response.error || "Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center w-full h-screen ${Styles.mainContainer}`}>
      <div className={Styles.logoTopLeft}>
        <Image
          src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay++(1).png"
          alt="logo"
          width={250}
          height={200}
        />
      </div>
      <div className={` ${Styles.containerLeft}`}>
        <div className={Styles.containerLeftInner}>
          <h2 className={`${Styles.heading}`}>Sign In</h2>
          <div>
            <div className={`mt-5, ${Styles.registerform}`}>
              <div className={Styles.formGroup}>               
                <input
                  className={Styles.inputField}
                  type="email"
                  required={true}
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup} style={{ position: "relative" }}>
                <input
                  className={Styles.inputField}
                  type={isPasswordVisible ? "text" : "password"}
                  name="pass"
                  id="pass"
                  required={true}
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <i
                  className={`bi ${
                    isPasswordVisible ? "bi-eye-slash-fill" : "bi-eye-fill"
                  }`}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "grey",
                  }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                ></i>
              </div>

              {showOtpInput && (
                <div className={Styles.formGroup}>
                  <input
                    className={Styles.inputField}
                    type="text"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              <div className={`${Styles.formGroup} ${Styles.formbutton}`}>
                <button
                  className={Styles.submitButton}
                  onClick={showOtpInput ? verifyOTP : onSignIn}
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : showOtpInput
                    ? "Verify OTP"
                    : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex h-screen ${Styles.containerRight}`}>
        <h1 className={`ms-10`}>
          <Image
            src={"https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png"}
            alt="logo"
            width={750}
            height={0}
          />
          <p className={Styles.logoText}>Get Your Music on Global Platforms</p>
        </h1>
      </div>

      {/* Music Icons at Random Positions */}
      <div className={Styles.musicIconsContainer}>
        <i className="bi bi-megaphone" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>
      <div className={Styles.musicnoteIconsContainer}>
        <i className="bi bi-music-note" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>
      <div className={Styles.musicnote2IconsContainer}>
        <i className="bi bi-music-note" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>
      <div className={Styles.musicboomboxIconsContainer}>
        <i className="bi bi-boombox" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div> <div className={Styles.musicboombox2IconsContainer}>
        <i className="bi bi-boombox" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>

      <div className={Styles.musicnotebeamedIconsContainer}>
        <i className="bi bi-music-note-beamed" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>
      <div className={Styles.musicnotebeamed2IconsContainer}>
        <i className="bi bi-music-note-beamed" style={{ position: 'absolute',  fontSize: '34px', color: '#e7e6e6' }}></i>
      </div>

      <div className={Styles.bottomrightContainer}>
        <p>© 2025 SwaLay. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default SignIn;