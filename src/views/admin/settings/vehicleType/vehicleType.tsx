import Loader from 'components/loader/loader';
import Card from "../../../../components/card";
import Navbar from 'components/navbar'
import { Formik } from 'formik';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { createVehicleTypeApi, getVehicleTypeById, handleCreateVehicleTypeApi } from 'services/customAPI';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

type formvalues = {
 vehicleType: string;
 vehicleMake: string;
 vehicleModel: string;
};

function VehicleType() {
  // translation function
  const { t } = useTranslation();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({ vehicleType: "" ,vehicleMake:"", vehicleModel:""});
  const navigate = useNavigate();

  const vehicleTypeSchema = Yup.object().shape({
    vehicleType: Yup.string().required(t("Vehicle type is required")),
    vehicleModel: Yup.string().required(t("Vehicle Model is required")),
    vehicleMake: Yup.string().required(t("Vehicle Make is required")),
  });

  React.useEffect(() => {
    if (params.id) {
      console.log("id",params.id)
      getData(params.id);
    }
  }, [params]);

  const getData = async (id: string) => {
    console.log("get data called :>> ");
    setIsLoading(true);
    try {
      const res = await getVehicleTypeById(id);

      setInitialFormValues({
        vehicleType: res.data.vehicleType,
        vehicleMake: res.data.vehicleMake,
        vehicleModel: res.data.vehicleModel,
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

  const handleCreateVehicleType = async (values: any) => {
    setIsLoading(true);
    try {
      if (params.id) {
        const result: any = await handleCreateVehicleTypeApi(params.id, {
          vehicleType: values.vehicleType,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel 
        });

        if (result.message) {
          successToast("vehicleType Updated Successfully");
          navigate("/admin/settings");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {

        const result: any = await createVehicleTypeApi({
          vehicleType: values.vehicleType,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel
        });

        if (result.message) {
          successToast("Vehicle Type Created Successfully");
          navigate("/admin/settings");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      }
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar flag={false} brandText="vehicletypeform" />
      <Link
        to="/admin/settings"
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
                {t("Edit Vehicle Type")}
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Add Vehicle Type")}
              </div>
            )}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleCreateVehicleType(values)}
              validationSchema={vehicleTypeSchema}
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
                        htmlFor="vehicleMake"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Make")}
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="vehicleMake"
                        type="text"
                        id="vehicleMake"
                        placeholder={t("Enter vehicle Make here")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.vehicleMake}
                      />
                      <div className="error-input">
                        {errors.vehicleMake && touched.vehicleMake
                          ? errors.vehicleMake
                          : null}
                      </div>
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="vehicleModel"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Model")}
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="vehicleModel"
                        type="text"
                        id="vehicleModel"
                        placeholder={t("Enter vehicle Model here")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.vehicleModel}
                      />
                      <div className="error-input">
                        {errors.vehicleModel && touched.vehicleModel
                          ? errors.vehicleModel
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="vehicleType"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Type")}
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="vehicleType"
                        type="text"
                        id="vehicleType"
                        placeholder={t("Enter vehicle type here")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.vehicleType}
                      />
                      <div className="error-input">
                        {errors.vehicleType && touched.vehicleType
                          ? errors.vehicleType
                          : null}
                      </div>
                    </div>
                    <div className="mb-3 ms-6 w-full"></div>
                  </div>

                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/settings")}
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

export default VehicleType