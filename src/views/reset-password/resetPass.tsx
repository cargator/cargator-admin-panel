import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "redux/reducers/authReducer";
import * as Yup from "yup";
import { Formik } from "formik";
import Loader from "components/loader/loader";
import { handleChangePasswordApi, handleRegisterApi } from "services/customAPI";
import { toast } from "react-toastify";

export type resetPassword = {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const token = useSelector((store: any) => store.auth.token);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changePasswordSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
    oldPassword: Yup.string()
      .required("Old password is required")
      .min(8, "Too short !")
      .max(15, "Too long !"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Too short !")
      .max(15, "Too long !")
      .notOneOf(
        [Yup.ref("oldPassword")],
        "Try other password! Old password should not match with new Password"
      ),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "New Password must match")
      .required("Please confirm password"),
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

  const handleChangePassword = async (formValues: resetPassword) => {
    try {
      setIsLoading(true);
      const changePasswordRes = await handleChangePasswordApi({
        ...formValues,
      });
      // console.log(`changePasswordRes :>> `, changePasswordRes)
      if (!changePasswordRes) {
        errorToast("Something went wrong ! Please try again.");
      }
      successToast("Password changed successfully !");
      dispatch(setToken(changePasswordRes.data.token));
      navigate("/");
    } catch (error: any) {
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
          email: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={(values) => handleChangePassword(values)}
        validationSchema={changePasswordSchema}
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
                {/* {oldPassword} */}
                <p className="text-medium-emphasis">Old Password</p>
                {errors.oldPassword && touched.oldPassword ? (
                  <div className="error-input text-danger">
                    {errors.oldPassword}
                  </div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="oldPassword"
                  name="oldPassword"
                  type="oldPassword"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.oldPassword}
                />
                {/* Password */}
                <p className="text-medium-emphasis">New Password</p>
                {errors.newPassword && touched.newPassword ? (
                  <div className="error-input text-danger">
                    {errors.newPassword}
                  </div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="newPassword"
                  name="newPassword"
                  type="newPassword"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newPassword}
                />
                {/* Confirm Password */}
                <p className="text-medium-emphasis">Confirm Password</p>
                {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="error-input text-danger">
                    {errors.confirmPassword}
                  </div>
                ) : null}
                <input
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="confirmPassword"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />
                <button
                  className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  // onClick={handleSubmit}
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
