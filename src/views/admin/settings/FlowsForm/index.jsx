import React, { useRef, useState } from "react";
import Card from "../../../../components/card";
import { Button } from "@chakra-ui/react";
import "./flowForm.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { createBreakPointApi, getBreakPointById, updateBreakPointApi } from '../../../../services/customAPI'
import Loader from "components/loader/loader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "components/navbar";


const FlowsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialFormValues] = useState({ breakPoints: "", sequence: "" })

  const BreakPointSchema = Yup.object().shape({
    breakPoints: Yup.string().required("Flow is required"),
    sequence: Yup.number().required("Sequence is required"),
  });

  const navigate = useNavigate();
  const params = useParams();


  React.useEffect(() => {
    if (params.id) {
      console.log("id", params.id)
      getData(params.id);
    }
  }, [params]);

  const getData = async (id) => {
    console.log("get data called for update:>> ");
    setIsLoading(true);
    try {
      const res = await getBreakPointById(id);

      setInitialFormValues({
        breakPoints: res.data.breakingPointName,
        sequence: res.data.sequenceNo,
      });
      setIsLoading(false);
    } catch (error) {
      errorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  const successToast = (message) => {
    toast.success(`${message}`, {
      position: 'top-right',
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

  const errorToast = (message) => {
    toast.error(`${message}`, {
      position: 'top-right',
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

  const handleCreateBreakingPoint = async (values) => {
    // console.log("object---------" , values.breakPoints,values.sequence)
    // console.log("params-------------------id" ,params.id)
    setIsLoading(true);
    try {
      if (params.id) {
        const result = await updateBreakPointApi(params.id, {
          BreakPoints: values.breakPoints,
          Sequence: values.sequence,
        });

        if (result.message) {
          successToast("Flow Updated Successfully");
          navigate("/admin/settings/flows")
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {
        const result = await createBreakPointApi({
          BreakPoints: values.breakPoints,
          Sequence: values.sequence,
        });


        if (result.message) {
          successToast("Flow Added Successfully");
          navigate("/admin/settings/flows")
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      }

    } catch (error) {
      errorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar flag={false} brandText="Settings" />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-20">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Edit Flows
              </div>
            )
              : (
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                  Add Flows
                </div>
              )
            }
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              initialValues={initialValues}
              validationSchema={BreakPointSchema}
              onSubmit={(values) => handleCreateBreakingPoint(values)}
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
                        htmlFor="breakPoints"
                        className="input-custom-label dark:text-white"
                      >
                        Flow Name
                      </label>
                      <input
                        required
                        style={{ backgroundColor: "rgba(242, 242, 242, 0.5)" }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="breakPoints"
                        type="text"
                        id="breakPoints"
                        placeholder="Enter Flows Name Here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.breakPoints}
                      />
                      <div className="error-input">
                        {errors.breakPoints && touched.breakPoints && errors.breakPoints}
                      </div>
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="sequence"
                        className="input-custom-label dark:text-white"
                      >
                        Sequence
                      </label>
                      <input
                        required
                        style={{ backgroundColor: "rgba(242, 242, 242, 0.5)" }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="sequence"
                        type="number"
                        id="sequence"
                        placeholder="Enter Sequence here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sequence}
                      />
                      <div className="error-input">
                        {errors.sequence && touched.sequence && errors.sequence}
                      </div>
                    </div>
                  </div>

                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/settings/flows")}
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
  );
};

export default FlowsForm;
