
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
        <h2 className="mb-6 text-center text-4xl font-semibold text-gray-800">Login</h2>
  
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Mobile Number Section */}

          <div className="flex-col items-center ">
          <div >
            {/* <label className=" mb-2 text-xl font-semibold text-gray-700 roboto-mono-font">
              Mobile Number:
            </label> */}
            <div ref={firstPhoneInputRef} className="relative custom-phone-input mb-4  flex justify-center">
              <PhoneInput
                international
                countries={['US', 'IN', 'AE']}
                defaultCountry="IN"
                onChange={handlePhoneNumberChange}
                countryCallingCodeEditable={false}
                placeholder="Enter phone number"
                value={phoneNumber}
              />
              <div className={`absolute  top-12 left-24 text-sm text-red-500 ml-20 ${isvalid ? 'hidden' : 'block'}`}>
                Enter valid Number
              </div>
            </div>
          </div>
  
          {/* OTP Section */}
          <div className="text-center">
            <label className="block mb-2 text-xl font-semibold text-black roboto-mono-font">
              Enter OTP:
            </label>
            <div className="flex justify-center gap-2 mb-4">
              {password.map((value, index) => (
                <input
                  key={index}
                  id={`password-input-${index}`}
                  ref={index === 0 ? firstPasswordInputRef : null}
                  type="number"
                  value={value}
                  onKeyDown={(e) => handlePasswordChange(index, e)}
                  maxLength={1}
                  style={{ backgroundColor: 'rgba(240, 248, 255, 1)' }}
                  className="h-12 w-12 rounded-md border border-gray-300 p-2 text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>
  
          {/* Login Button */}
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              disabled={isdisabled}
              // style={{ background: 'rgba(0, 82, 155, 1)' }}
 className={`w-3/4 rounded-md p-3
${isdisabled   ? 'bg-[rgba(0,82,155,0.6)] text-gray-400 cursor-not-allowed'
                    : 'bg-[rgba(0,82,155,1)] text-white' }
              `}
//  ${isdisabled ? 'bg-gray-500' : 'bg-brand-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}

            >
              Login
            </button>
          </div>
  
          {/* Footer Text */}
          <div className="text-center text-gray-600 roboto-mono-font">© 2024 Sukam Express</div>
          </div>
        </form>
      </div>
    </div>
  );
  
  
  
};

export default LoginPage;
