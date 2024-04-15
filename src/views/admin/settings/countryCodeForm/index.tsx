import Loader from 'components/loader/loader';
import Card from "../../../../components/card";
import Navbar from 'components/navbar'
import { Formik } from 'formik';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { createCountryCodeApi, getCountryCodesById, handleCreateCountryCodeApi,  } from 'services/customAPI';

type formvalues = {
  countryCode: string;
  countryName: string;
};

function CountryCodeForm() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({ countryCode: "" ,countryName:"",});
  const navigate = useNavigate();

  const CountryCodeSchema = Yup.object().shape({
    countryCode: Yup.string().required("Country Code is required"),
    countryName: Yup.string().required("Country Name is required"),
  });

  // React.useEffect(() => {
  //   if (params.id) {
  //     console.log("id--------------######3333333",params.id)
  //     getData(params.id);
  //   }
  // }, [params]);

  // // getting country code and Name for updation by id
  // const getData = async (id: string) => {
  //   console.log("get data called :>> ");
  //   setIsLoading(true);
  //   try {
  //     const res = await getCountryCodesById(id);

  //     setInitialFormValues({
  //       countryCode: res.data.countryCode,
  //       countryName: res.data.countryName,
  //     });
  //     setIsLoading(false);
  //   } catch (error: any) {
  //     errorToast(error.response.data.message);
  //     setIsLoading(false);
  //   }
  // };

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

  const handleCreateCountryCode = async (values: any) => {
    setIsLoading(true);
    try {
      // if (params.id) {
      //   const result: any = await handleCreateCountryCodeApi(params.id, {
      //     countryCode: values.countryCode,
      //     countryName: values.countryName,
      //   });

      //   if (result.message) {
      //     successToast("vehicleType Updated Successfully");
      //     navigate("/admin/settings/countrycode");
      //     setIsLoading(false);
      //   } else {
      //     errorToast("Something went wrong");
      //   }
      // } else {

        const result: any = await createCountryCodeApi({
          countryCode: values.countryCode,
          countryName: values.countryName,
        });

        if (result.message) {
          successToast("Country Code Created Successfully");
          navigate("/admin/settings/countrycode");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
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
      <Navbar flag={false} brandText="CountryCodeForm" />

      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-20">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Edit CountryCode
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add CountryCode
              </div>
            )}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleCreateCountryCode(values)}
              validationSchema={CountryCodeSchema}
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
                        htmlFor="countryCode"
                        className="input-custom-label dark:text-white"
                      >
                        Country Code
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="countryCode"
                        type="text"
                        id="countryCode"
                        placeholder="Enter Country Code here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.countryCode}
                      />
                      <div className="error-input">
                        {errors.countryCode && touched.countryCode
                          ? errors.countryCode
                          : null}
                      </div>
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="countryName"
                        className="input-custom-label dark:text-white"
                      >
                        Country Name
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="countryName"
                        type="text"
                        id="countryName"
                        placeholder="Enter Country Name here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.countryName}
                      />
                      <div className="error-input">
                        {errors.countryName && touched.countryName
                          ? errors.countryName
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/settings/countrycode")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </Card>
      )}
    </>
  )
}

export default CountryCodeForm
