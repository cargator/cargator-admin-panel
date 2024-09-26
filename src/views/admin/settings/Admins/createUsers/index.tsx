import Loader from 'components/loader/loader';
import Card from "../../../../../components/card";
import Navbar from 'components/navbar'
import { Formik } from 'formik';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { createCountryCodeApi, createUsersApi, getCountryCodesById, getUsersById, handleCreateCountryCodeApi, updateUsersApi,  } from 'services/customAPI';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

type formvalues = {
  fullName: string;
  mobileNumber: string;
};

function CreateUsers() {
  // translation function
  const { t } = useTranslation();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({ fullName: "" ,mobileNumber:"",});
  const navigate = useNavigate();

  const CreateUserSChema = Yup.object().shape({
    fullName: Yup.string().required(t("Name  is required")),
    mobileNumber: Yup.string().min(10,"Invalid Mobile Number").max(10,"Invalid Mobile Number").required("Mobile number is required"),
  });


  React.useEffect(() => {
    if (params.id) {
      console.log("id", params.id)
      getData(params.id);
    }
  }, [params]);

  const getData = async (id: any) => {
    console.log("get data called for update:>> ");
    setIsLoading(true);
    try {
      const res = await getUsersById(id);
      setInitialFormValues({
        fullName: res.data.name,
        mobileNumber: res.data.mobile_Number,
      });
      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
      setIsLoading(false);
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

  const handleCreateUsers = async (values: any) => {
    setIsLoading(true);
    try {
      if (params.id) {
        const result: any = await updateUsersApi(params.id, {
          fullName: values.fullName,
          mobileNumber: values.mobileNumber,
        });

        if (result.message) {
          successToast("User Updated Successfully");
          navigate("/admin/settings/users")
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {
        const result: any = await createUsersApi({
          fullName: values.fullName,
          mobileNumber: values.mobileNumber,
        });

        if (result.message) {
          successToast("User Created Successfully");
          navigate("/admin/settings/users");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      }
      // }
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar flag={false} brandText="CreateUserForm" />
      <Link
        to="/admin/settings/users"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-20">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Edit User")}
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Add Users")}
              </div>
            )}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleCreateUsers(values)}
              validationSchema={CreateUserSChema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between">
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="fullName"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Full Name")}
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="fullName"
                        type="text"
                        id="fullName"
                        placeholder={t("Enter full name here")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.fullName}
                      />
                      <div className="error-input">
                        {errors.fullName && touched.fullName
                          ? errors.fullName
                          : null}
                      </div>
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="mobileNumber"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Mobile Number")}
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="mobileNumber"
                        type="text"
                        id="mobileNumber"
                        placeholder={t("Enter mobile number here")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.mobileNumber}
                      />
                      <div className="error-input">
                        {errors.mobileNumber && touched.mobileNumber
                          ? errors.mobileNumber
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/settings/users")}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                    >
                      {t("Save")}
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </Card>
      )}
    </>
  );
}

export default CreateUsers;
