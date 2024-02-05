import Navbar from "components/navbar";
import React, { useState } from "react";
import Card from "components/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { addFare, getFare, upDateFare } from "services/customAPI";
import Loader from "components/loader/loader";

type formvalues = {
  fare: string;
};

function Fare() {
  const params = useParams();
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({
    fare: "",
  });

  const driverSchema = Yup.object().shape({
    fare: Yup.string().min(1).required("Fare is required"),
  });

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

  const handleAddFare = async (values: any) => {
    console.log("get data called :>> ");
    setIsLoading(true);
    try {
      if (check) {
        const res: any = await upDateFare(id, { fare: values.fare });
        setInitialFormValues({
          fare: res.data.fare,
        });
        if (res.message) {
          successToast("Fare updated successfully");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
        setIsLoading(false);
        return;
      }
      const res: any = await addFare(values);
      setCheck(true);
      setInitialFormValues({
        fare: res?.data[0].fare,
      });
      setId(res?.data[0]._id);
      if (res.message) {
        successToast("Fare added successfully");
        setIsLoading(false);
      } else {
        errorToast("Something went wrong");
      }

      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log("get data called :>> ");
    setIsLoading(true);
    try {
      const res = await getFare();
      if (res.data.length !== 0) {
        setCheck(true);
        setId(res?.data[0]._id);
      } else {
        setIsLoading(false);
        return;
      }

      setInitialFormValues({
        fare: res?.data[0].fare,
      });
      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar flag={false} brandText="fare" />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full mt-4 pb-10 p-4 h-full"}>
          <header className="relative flex items-center justify-between p-10">
            {/* {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Edit Fare
              </div>
            ) : ( */}
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Fare
              </div>
            {/* )} */}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleAddFare(values)}
              validationSchema={driverSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between">
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="fare"
                        className="input-custom-label dark:text-white"
                      >
                        Fare
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="fare"
                        type="text"
                        id="fare"
                        placeholder="Enter fare here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.fare}
                      />
                      <div className="error-input">
                        {errors.fare && touched.fare ? errors.fare : null}
                      </div>
                    </div>
                  </div>
                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className="cancel-button my-2 ms-1 sm:my-0"
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
    </div>
  );
}

export default Fare;
