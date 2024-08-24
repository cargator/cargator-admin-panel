// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setToken } from "redux/reducers/authReducer";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import Loader from "components/loader/loader";
// import { handleLoginApi } from "services/customAPI";
// import { toast } from "react-toastify";

// export type loginCred = {
//   mobile_Number: number;
//   password: string;
// };

// export default function SignIn() {
//   const dispatch = useDispatch();
//   let navigate = useNavigate();
//   const token = useSelector((store: any) => store.auth.token);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const loginSchema = Yup.object().shape({
//     // email: Yup.string().required("Email is required").email("Invalid email"),
//     mobile_Number:Yup.string().min(10,"Invalid Mobile Number").max(10,"Invalid Mobile Number").required("Mobile number is required"),

//     password: Yup.string()
//       .min(4, "Too short !")
//       // .max(15, "Too long !")
//       .required("Password is required"),
//   });

//   const successToast = (message: string) => {
//     // console.log("Inside successToast", message); // Add this line for debugging
//     toast.success(`${message}`, {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 4000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       style: { borderRadius: "15px" },
//     });
//   };

//   const errorToast = (message: string) => {
//     toast.error(`${message}`, {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 4000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       style: { borderRadius: "15px" },
//     });
//   };

//   const handleLogin = async (
//     formValues: loginCred,
//     setSubmitting: (val: boolean) => void
//   ) => {
//     try {
//       setIsLoading(true);
//       const data = {
//         mobile_Number: formValues.mobile_Number,
//         password: formValues.password,
//       };
//       const loginRes = await handleLoginApi(data);
//       if (!loginRes) {
//         console.log("Invalid mobile_Number or password !");
//         errorToast("Invalid mobile_Number or password !");
//       }
//       console.log("loginRes :>> ", loginRes);
//       dispatch(setToken(loginRes.data.token));
//       navigate("/admin/default");
//     } catch (error: any) {
//       console.log(`handleLogin error :>> `, error);
//       errorToast(error.response.data.message);
//     } finally {
//       setIsLoading(false);
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, []);

//   return (
//     <>
//       {isLoading && <Loader size={40} />}
//       <Formik
//         enableReinitialize={true}
//         initialValues={{ mobile_Number: 1234567890, password: "7890" }}
//         onSubmit={(values, { setSubmitting }) => (
//           console.log("first"), handleLogin(values, setSubmitting)
//         )}
//         validationSchema={loginSchema}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <form about="form" onSubmit={handleSubmit}>
//             <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
//               <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
//                 <p className="text-medium-emphasis">Mobile Number</p>
//                 {errors.mobile_Number && touched.mobile_Number ? (
//                   <div className="error-input text-danger">{errors.mobile_Number}</div>
//                 ) : null}
//                 <input
//                   className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
//                   id="mobile_Number"
//                   type="text"
//                   placeholder="Mobile Number"
//                   autoComplete="mobile_Number"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.mobile_Number}
//                 />
//                 {/* Password */}
//                 <p className="text-medium-emphasis">Password</p>
//                 {errors.password && touched.password ? (
//                   <div className="error-input text-danger">
//                     {errors.password}
//                   </div>
//                 ) : null}
//                 <input
//                   className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder="Password"
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   value={values.password}
//                 />
//                 {/* Checkbox */}
//                 <div className="mb-4 flex items-center justify-between px-2">
//                   <a
//                     className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//                     href="/reset-password"
//                   >
//                     Forgot Password?
//                   </a>
//                 </div>
//                 <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
//                   Log In
//                 </button>
//                 {/* <div className="mt-4">
//                   <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
//                     Not registered yet?
//                   </span>
//                   <a
//                     href="/register"
//                     className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
//                   >
//                     Create an account
//                   </a>
//                 </div> */}
//               </div>
//             </div>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// }





import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLoginApi } from "services/customAPI";
import { setToken } from "redux/reducers/authReducer";
import { toast } from "react-toastify";

const countryCodes = ["+91", "+61", "+81"];

const LoginPage = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0]
  );
  const [phoneNumber, setPhoneNumber] = useState<string[]>(Array(10).fill(""));
  const [password, setPassword] = useState<string[]>(Array(4).fill(""));

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const token = useSelector((store: any) => store.auth.token);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const firstPhoneInputRef = useRef<HTMLInputElement>(null);
  const firstPasswordInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   firstPhoneInputRef.current?.focus();
  // }, []);

  const handleCountryCodeChange = (e: any) => {
    setSelectedCountryCode(e.target.value);
  };

  const handlePhoneNumberChange = (index: number, e: any) => {
    const newPhoneNumber = [...phoneNumber];

    if (e.target.value) {
      newPhoneNumber[index] = e.target.value.slice(-1);
      setPhoneNumber(newPhoneNumber);

      if (index < 9) {
        document.getElementById(`phone-input-${index + 1}`)?.focus();
      }
    } else {
      if (index > 0 || newPhoneNumber[index]) {
        newPhoneNumber[index] = "";
        setPhoneNumber(newPhoneNumber);
        if (index > 0) {
          document.getElementById(`phone-input-${index - 1}`)?.focus();
        }
      }
    }
  };

  const handlePasswordChange = (index: number, e: any) => {
    const newPassword = [...password];

    if (e.target.value) {
      newPassword[index] = e.target.value.slice(-1);
      setPassword(newPassword);

      if (index < 3) {
        document.getElementById(`password-input-${index + 1}`)?.focus();
      }
    } else {
      if (index > 0 || newPassword[index]) {
        newPassword[index] = "";
        setPassword(newPassword);
        if (index > 0) {
          document.getElementById(`password-input-${index - 1}`)?.focus();
        }
      }
    }
  };



  const successToast = (message: string) => {
    // console.log("Inside successToast", message); // Add this line for debugging
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
      const fullPhoneNumber = selectedCountryCode + phoneNumber.join("");
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
        <h2 className="mb-6 text-center text-3xl font-semibold">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Mobile Number:
            </label>
            <div className="flex justify-between">
              <select
                value={selectedCountryCode}
                onChange={handleCountryCodeChange}
                className="focus:ring-3 m-1 h-12 w-20 rounded-md border border-gray-300 p-1 focus:outline-none focus:ring-blue-800"
              >
                {countryCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {phoneNumber.map((value, index) => (
                <input
                  key={index}
                  id={`phone-input-${index}`}
                  ref={index === 0 ? firstPhoneInputRef : null}
                  type="number"
                  value={value}
                  onChange={(e) => handlePhoneNumberChange(index, e)}
                  maxLength={1}
                  className="m-1 h-12 w-12 rounded-md border border-gray-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Password:
            </label>
            <div className="">
              {password.map((value, index) => (
                <input
                  key={index}
                  id={`password-input-${index}`}
                  ref={index === 0 ? firstPasswordInputRef : null}
                  type="password"
                  value={value}
                  placeholder={value}
                  onChange={(e) => handlePasswordChange(index, e)}
                  maxLength={1}
                  className="m-1 h-12 w-12 rounded-md border border-gray-300 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-brand-500 p-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
