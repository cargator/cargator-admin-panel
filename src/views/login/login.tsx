
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLoginApi } from "services/customAPI";
import { setToken } from "redux/reducers/authReducer";
import { toast } from "react-toastify";
import logo from "../../assets/images/sukam-logo 1.png";
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import './login.css'

const LoginPage = () => {
 
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [password, setPassword] = useState<string[]>(Array(4).fill(""));
  const [isvalid,setIsValid]=useState(true);
  const [isdisabled,setIsDisabled]=useState(true);

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const token = useSelector((store: any) => store.auth.token);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const firstPhoneInputRef = useRef<HTMLInputElement>(null);
  const firstPasswordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstPhoneInputRef.current?.focus();
  }, []);

  useEffect(() => {

    const isPasswordFilled = password.every(pwd => pwd !== "");
  
    setIsDisabled(!(isvalid && phoneNumber.trim() !== "" && isPasswordFilled));
  }, [phoneNumber, password,isvalid]);

  const handlePhoneNumberChange = (val: string | undefined) => {

    setPhoneNumber(val);
    const temp = isValidPhoneNumber(val||"+91");
    setIsValid(temp);

  };

  const handlePasswordChange = (index: number, e: any) => {
    const newPassword = [...password];
    const key = e.key;

    if (key === "Backspace") {
      // If backspace is pressed
      newPassword[index] = ""; // Clearing the current input box
      setPassword(newPassword);

      if (index > 0) {
        document.getElementById(`password-input-${index - 1}`)?.focus();
      }
    } else if (/^[a-zA-Z0-9]$/.test(key)) {
      // If an alphanumeric key is pressed
      newPassword[index] = key;
      setPassword(newPassword);

      if (index < 3) {
        document.getElementById(`password-input-${index + 1}`)?.focus();
      }
    }
  };

  const successToast = (message: string) => {
    toast.success(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: { borderRadius: "15px" },
    });
  };

  const errorToast = (message: string) => {
    toast.error(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: { borderRadius: "15px" },
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const fullPhoneNumber =phoneNumber;
      const fullPassword = password.join("");
      console.log("Phone Number:", fullPhoneNumber);
      console.log("Password:", fullPassword);
      setIsLoading(true);
      const data = {
        mobile_Number: fullPhoneNumber,
        password: fullPassword,
      };
      const loginRes = await handleLoginApi(data);
      if (!loginRes) {
        console.log("Invalid mobile_Number or password !");
        errorToast("Invalid mobile_Number or password !");
      }
      successToast(`Welcome to sukam-express, ${loginRes.data.fullName}!`);
      console.log("loginRes :>> ", loginRes);
      dispatch(setToken(loginRes.data.token));
      navigate("/admin/default");
    } catch (error: any) {
      console.log(`handleLogin error :>> `, error);
      errorToast(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <img
          src={logo}
          alt="Sukam Express Logo"
          className="w-25 mx-auto mb-6 h-16"
        />
        <h2 className="mb-6 text-center text-3xl font-semibold">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
        <div >
            <label className=".roboto-mono-font text-xl mb-2 block font-semibold text-gray-700">
              Mobile Number:
            </label>
            <div ref={firstPhoneInputRef} className=" relative custom-phone-input " >

            {
              !isvalid &&  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10 p-2 mb-2 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300">
              <div className="flex items-center">
                <svg className="flex-shrink-0 inline w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Warning</span>
                <div className="text-xs">
                  <span className="font-medium "></span> Please enter a valid phone number.
                </div>
              </div>
            </div>
            }

              <PhoneInput

                international
                countries={['US', 'IN', 'AE']}
                defaultCountry="IN"
                onChange={handlePhoneNumberChange}
                countryCallingCodeEditable={false}
                value={phoneNumber}


              />


              {/* https://github.com/bl00mber/react-phone-input-2#style */}

            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              OTP:
            </label>
            <div className="flex gap-20 ml-20">
              {password.map((value, index) => (
                <input
                  key={index}
                  id={`password-input-${index}`}
                  ref={index === 0 ? firstPasswordInputRef : null}
                  type="password"
                  value={value}
                  onKeyDown={(e) => handlePasswordChange(index, e)}
                  maxLength={1}
                  className="m-1 h-12 w-12 rounded-md border border-gray-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isdisabled}
            className={` w-3/4 ml-20 rounded-md p-3 ${isdisabled ? 'bg-gray-500' : 'bg-brand-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}`}
            >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
