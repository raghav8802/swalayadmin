'use client'
import React from "react" 
import Link from 'next/link'
import Styles from '../Styles/Signin.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { apiPost } from '@/helpers/axiosRequest'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'

const Register = () => {

  const router = useRouter()
  const initialState = {
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  }

  const [user, setUser] = useState(initialState)
  const [isDisable, setIsDisable] = useState(true)
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {

    if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0 && user.confirmPassword.length > 0 && isAgreementChecked) {

      setIsDisable(false)
    } else {

      setIsDisable(true)
    }

  }, [user, isAgreementChecked])


  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false
  })


  // useEffect(() => {
  //   if (isSignUp) {
  //     router.push('/message')
  //   }
  // }, [])
  


  const onSignUp = async () => {
    console.log("On sign up");
    console.log(user.username);
    console.log(user.email);
    console.log(user.password);
    console.log(user.confirmPassword);
    
    if (user.password !== user.confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    const { confirmPassword, ...userData } = user;

    try {
      const response = await apiPost('/api/admin/signup', userData) as { success: boolean; message: string }; // Ensure correct type assertion

      console.log(response);
      
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setUser(initialState);
        setIsSignUp(true);
        router.push('/message');
      }
    } catch (error) {
      console.log("Network Error:", error);
      toast.error("Network Error: check your connection");
    }
  };




  return (
    // <div className=c>
    <div className={`flex items-center justify-center w-full h-screen ${Styles.mainContainer}`}>
      <div className={` ${Styles.containerLeft}`}>
        <div className={Styles.containerLeftInner}>

          <h2 className={Styles.heading}>Register</h2>
          {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}

          <div>
            <div className={`mt-3 ${Styles.registerform}`} >


              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="name">
                  <i className="bi bi-person-fill"></i></label>
                <input className={Styles.inputField} type="text"
                  name="name" id="name" placeholder="Your Name"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="email"><i className="bi bi-envelope-fill"></i></label>
                <input className={Styles.inputField} type="email"
                  name="email" id="email" placeholder="Your Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup}>
                <label
                  className={Styles.inputLable}
                  htmlFor="pass"><i
                    className={`bi ${passwordVisible.password ? "bi-eye-fill" : "bi-eye-slash-fill"} `}
                    onClick={() => setPasswordVisible({ ...passwordVisible, password: !passwordVisible.password })}
                  ></i></label>

                <input className={Styles.inputField}
                  type={passwordVisible.password ? "text" : "password"}
                  name="pass" id="pass" placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable}
                  htmlFor="re-pass"><i
                    className={`bi ${passwordVisible.confirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} `}
                    onClick={() => setPasswordVisible({ ...passwordVisible, confirmPassword: !passwordVisible.confirmPassword })}
                  ></i></label>

                <input className={Styles.inputField}
                  type={passwordVisible.confirmPassword ? "text" : "password"}
                  name="re_pass" id="re_pass" placeholder="Repeat your password"
                  value={user.confirmPassword}
                  onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup}>
                <input type="checkbox"
                  name="agree-term"
                  id="agree-term"
                  className={Styles.agreeTerm}
                  checked={isAgreementChecked ? true : false}
                  onChange={() => setIsAgreementChecked(!isAgreementChecked)}
                />
                <label className={`${Styles.inputLable} ${Styles.labelagreeterm}`} htmlFor="agree-term" >
                  <span><span></span></span>I agree all statements in <Link href="#" className={Styles.termservice}>Terms of service</Link></label>
              </div>
              <div className={`${Styles.formGroup} ${Styles.formbutton} `}>
                <button
                  className={isDisable ? Styles.submitButtonDisable : Styles.submitButton}
                  onClick={onSignUp}
                  disabled={isDisable}
                >Register</button>
              </div>
              <p className={`${Styles.inputLable} ${Styles.labelagreeterm}`}  >
                Already have an account?  <Link href="/signin" className={Styles.termservice}>Sign In</Link></p>
            </div>

          </div>

        </div>

      </div>
      <div className={`flex h-screen ${Styles.containerRight2}`}>
        {/* <div className={Styles.imgContainer}>
          <Image src={'/images/singer2.jpg'} width={550} height={550} alt='singer'  /> 
        </div> */}

        {/* <Image src="/images/musicicon.gif" width={110} height={110} alt='icons' className={Styles.musicIcon}    style={{ width: 'auto', height: 'auto' }} />
        <Image src="/images/headphone.gif" width={100} height={100} alt='icons' className={Styles.headphoneIcon} />
        <Image src="/images/musicicon2.gif" width={100} height={100} alt='icons' className={Styles.musicIcon2} /> */}

      </div>


    </div>

  )

}

export default Register