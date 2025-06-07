"use client";
import Link from "next/link";
import Styles from "../Styles/Signin.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";

const signIn = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 && emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length > 0;
  };

  const verifyOTP = async () => {
    try {
      const response = await apiPost("/api/admin/verifyOTP", {
        email: user.email,
        otp
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

    try {
      const response = await apiPost("/api/admin/signin", user);

      if (response.success) {
        toast.success("OTP sent to your email");
        setShowOtpInput(true);
      } else {
        toast.error(response.error || "Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={`flex items-center justify-center w-full h-screen ${Styles.mainContainer}`}>
      <div className={` ${Styles.containerLeft}`}>
        <div className={Styles.containerLeftInner}>
          <h2 className={Styles.heading}>Sign In</h2>
          <div>
            <div className={`mt-3 ${Styles.registerform}`}>
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="email">
                  <i className="bi bi-envelope-fill"></i>
                </label>
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
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="pass">
                  <i
                    className={`bi ${
                      isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"
                    } `}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  ></i>
                </label>
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
              </div>

              {showOtpInput && (
                <div className={Styles.formGroup}>
                  <label className={Styles.inputLable} htmlFor="otp">
                    <i className="bi bi-shield-lock-fill"></i>
                  </label>
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
                >
                  {showOtpInput ? "Verify OTP" : "Sign In"}
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div className={`flex h-screen ${Styles.containerRight}`}>
        <h1 className={Styles.superHeading}>SwaLay</h1>
        <p className={Styles.subHeading}>Get Your Music on Global Platforms</p>
      </div>
    </div>
  );
};

export default signIn;
