import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "redux/reducers/authReducer";
import * as Yup from "yup";
import { Formik } from "formik";
import Loader from "components/loader/loader";
import { handleRegisterApi } from "services/customAPI";
import { toast } from "react-toastify";

export type registerCred = {
  name: string;
  email: string;
  mobile_Number:string
  // password: string;
  // confirmPassword: string;
};

export default function Register() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const token = useSelector((store: any) => store.auth.token);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, "Too short !")
      .max(30, "Too long !")
      .required("Name is required"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    mobile_Number:Yup.string().min(10,"Invalid Mobile Number").max(10,"Invalid Mobile Number")
    // password: Yup.string()
    //   .required("Password is required")
    //   .min(8, "Too short !")
    //   .max(15, "Too long !"),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password")], "Password must match")
    //   .required("Please confirm password"),
  });

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

  const handleRegister = async (formValues: registerCred) => {
    try {
      setIsLoading(true);
      console.log({...formValues});
      const registerRes = await handleRegisterApi({ ...formValues });
      if (!registerRes) {
        errorToast("Something went wrong ! Please try again.");
      }
     
      dispatch(setToken(registerRes.data.token));
      successToast("Account created successfully !");
      navigate("/");
    } catch (error: any) {
      console.log("error", error);
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
    <>
      {isLoading && <Loader size={40} />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          mobile_Number:"",
          email: "",
        }}
        onSubmit={(values) => handleRegister(values)}
        validationSchema={registerSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <form about="form" onSubmit={handleSubmit}>
            <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
              <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                {/* {name} */}
                <p className="text-medium-emphasis">Name</p>
                {errors.name && touched.name ? (
                  <div className="error-input text-danger">{errors.name}</div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="name"
                  type="text"
                  placeholder="Name"
                  autoComplete="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />

                <p className="text-medium-emphasis">Mobile Number</p>
                {errors.mobile_Number && touched.mobile_Number? (
                  <div className="error-input text-danger">{errors.mobile_Number}</div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="mobile_Number"
                  type="number"
                  placeholder="1234567890"
                  // autoComplete="mobile_Number"
                  // pattern="[6-9]\d{9}"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.mobile_Number}
                />

                {/* {email} */}
                <p className="text-medium-emphasis">Email</p>
                {errors.email && touched.email ? (
                  <div className="error-input text-danger">{errors.email}</div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="email"
                  type="text"
                  placeholder="Email"
                  autoComplete="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {/* Password */}
                {/* <p className="text-medium-emphasis">Password</p> */}
                {/* {errors.password && touched.password ? (
                  <div className="error-input text-danger">
                    {errors.password}
                  </div>
                ) : null} */}
                {/* <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                /> */}
                {/* Confirm Password */}
                {/* <p className="text-medium-emphasis">Confirm Password</p> */}
                {/* {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="error-input text-danger">
                    {errors.confirmPassword}
                  </div>
                ) : null} */}
                {/* <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="confirmPassword"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                /> */}
                <button
                  className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  // onClick={handleSubmit}
                >
                  Create Accout
                </button>
                <div className="mt-4">
                  <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                    Already have an account?
                  </span>
                  <a
                    href="/login"
                    className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
