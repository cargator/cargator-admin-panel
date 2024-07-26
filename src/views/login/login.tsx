import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "redux/reducers/authReducer";
import * as Yup from "yup";
import { Formik } from "formik";
import Loader from "components/loader/loader";
import { handleLoginApi } from "services/customAPI";
import { toast } from "react-toastify";

export type loginCred = {
  email: string;
  password: string;
};

export default function SignIn() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const token = useSelector((store: any) => store.auth.token);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),

    password: Yup.string()
      .min(4, "Too short !")
      // .max(15, "Too long !")
      .required("Password is required"),
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

  const handleLogin = async (
    formValues: loginCred,
    setSubmitting: (val: boolean) => void
  ) => {
    try {
      setIsLoading(true);
      const data = {
        email: formValues.email,
        password: formValues.password,
      };
      const loginRes = await handleLoginApi(data);
      if (!loginRes) {
        console.log("Invalid email or password !");
        errorToast("Invalid email or password !");
      }
      console.log("loginRes :>> ", loginRes);
      dispatch(setToken(loginRes.data.token));
      navigate("/admin/default");
    } catch (error: any) {
      console.log(`handleLogin error :>> `, error);
      errorToast(error.response.data.message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
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
        initialValues={{ email: "hello@gmail.com", password: "00000000" }}
        onSubmit={(values, { setSubmitting }) => (
          console.log("first"), handleLogin(values, setSubmitting)
        )}
        validationSchema={loginSchema}
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
                <p className="text-medium-emphasis">Password</p>
                {errors.password && touched.password ? (
                  <div className="error-input text-danger">
                    {errors.password}
                  </div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {/* Checkbox */}
                <div className="mb-4 flex items-center justify-between px-2">
                  <a
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    href="/reset-password"
                  >
                    Forgot Password?
                  </a>
                </div>
                <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                  Log In
                </button>
                <div className="mt-4">
                  <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                    Not registered yet?
                  </span>
                  <a
                    href="/register"
                    className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                  >
                    Create an account
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
