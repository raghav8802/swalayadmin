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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 && emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length > 0;
  };

  const onSignIn = async () => {
    console.log("on signin");
    console.log(user);
    if (!validateEmail(user.email)) {
      console.log("Invalid email format");
      toast.error("Enter a valid email");
      return;
    }

    if (!validatePassword(user.password)) {
      console.log("Password must be at least 8 characters long");
      toast.error("Enter a valid Password");
      return;
    }

    try {
      console.log("in try");

      const response = await apiPost("/api/admin/signin", user);

      if (response.success) {
        toast.success("Success");
        setUser({ email: "", password: "" });
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div className=c>
    <div
      className={`flex items-center justify-center w-full h-screen ${Styles.mainContainer}`}
    >
      <div className={` ${Styles.containerLeft}`}>
        <div className={Styles.containerLeftInner}>
          {/* <h2 className={Styles.heading}>Login <Image src='/images/wink.png' className='ms-2' width={25} height={25} alt='wink' /> </h2> */}
          <h2 className={Styles.heading}>Sign In</h2>
          {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}

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

              <div className={`${Styles.formGroup} ${Styles.formbutton} `}>
                <button className={Styles.submitButton} onClick={onSignIn}>
                  Sign In
                </button>
              </div>
              <p className={`${Styles.inputLable} ${Styles.labelagreeterm}`}>
                Don't have an account?
                <Link href="/register" className={Styles.termservice}>
                  Register
                </Link>
              </p>
              
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
