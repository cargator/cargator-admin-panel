import Loader from 'components/loader/loader';
import Card from "../../../../components/card";
import Navbar from 'components/navbar'
import { Formik, useFormikContext } from 'formik';
import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { createVehicleTypeApi, handleCreateVehicleTypeApi } from 'services/customAPI';

type formvalues = {
 vehicleType: string;
};

const Logger = (props: any): JSX.Element => {
  const {
    setVehicleType,
  } = props;
  const firstRender = useRef(true);
  const formik = useFormikContext<any>();
  const params = useParams();

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      // if (formik.values?.vehicleType) {
      //   allAvailableVehicles.map((data: any) => {
      //     if (data.vehicleNumber === formik.values.vehicleNumber) {
      //       formik.values.vehicleType = data.vehicleType;
      //       formik.values.vehicleName = data.vehicleName;
      //       setVehicleType(data.vehicleType);
      //     }
      //   });
      // } else {
      // }
    }
  }, [formik.values?.vehicleNumber]);
  return null;
};

function VehicleType() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({ vehicleType: ""});
  const [vehicleType, setVehicleType] = useState("");
  const navigate = useNavigate();
  const [isProfileImage, setIsProfileImage] = useState(
    params.id ? false : true
  );

  const vehicleTypeSchema = Yup.object().shape({
    vehicleType: Yup.string().required("Vehicle type is required"),
   
  });

  React.useEffect(() => {
    if (params.id) {
      getData(params.id);
    }
  }, [params]);

  const getData = async (id: string) => {
    console.log("get data called :>> ");
    setIsLoading(true);
    try {
      // const res = await getDriverByIdApi(id);
      let docsURLandkeyarray = [];

      // setInitialFormValues({
      //   vehicleType: res.data.vehicleType,
      // });
      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
      setIsLoading(false);
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

  const handleCreateVehicleType = async (values: any) => {
    setIsLoading(true);
    try {
      if (params.id) {
        const result: any = await handleCreateVehicleTypeApi(params.id, {
          vehicleType: values.vehicleType,
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

      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-20">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Edit Vehicle Type
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add Vehicle Type
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
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between"> 
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="vehicleType"
                        className="input-custom-label dark:text-white"
                      >
                        Vehicle Type
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
                        placeholder="Enter vehicle type here"
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
                  </div>

                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/settings")}
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

export default VehicleType