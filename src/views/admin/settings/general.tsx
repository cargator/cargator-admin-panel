import Navbar from "components/navbar";
import React, { useRef, useState } from "react";
import Card from "components/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  addFare,
  getFare,
  getS3SignUrlApi,
  upDateFare,
} from "services/customAPI";
import Loader from "components/loader/loader";
import uploadCloud from "../../../assets/svg/upload-cloud.svg";

type formvalues = {
  name: string;
  image: any;
};

type profImage = {
  key: string;
  url: string;
  file?: any;
};

function General() {
  const params = useParams();
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const anchorImageRef = useRef(null);
  const [finalProfileImage, setFinalProfileImage] = useState<profImage>();
  const [initialProfileImage, setInitialProfileImage] = useState<profImage>();
  const [imagePreview, setImagePreview] = useState(null);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({
    name: "",
    image: {},
  });
  const [isProfileImage, setIsProfileImage] = useState(
    params.id ? false : true
  );

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

  const handleDivClickImg = () => {
    if (anchorImageRef.current) {
      anchorImageRef.current.click();
    }
  };

  const handleAddFare = async (values: any) => {
    console.log("get data called :>> ");
    setIsLoading(true);
    // try {
    //   if (check) {
    //     const res: any = await upDateFare(id, { fare: values.fare });
    //     // setInitialFormValues({
    //     //   name: res.data.fare,
    //     //   image: {},
    //     // });
    //     if (res.message) {
    //       successToast("Fare updated successfully");
    //       setIsLoading(false);
    //     } else {
    //       errorToast("Something went wrong");
    //     }
    //     setIsLoading(false);
    //     return;
    //   }
    //   const res: any = await addFare(values);
    //   setCheck(true);
    //   // setInitialFormValues({
    //   //   name: res?.data[0].fare,
    //   //   image: {},
    //   // });
    //   setId(res?.data[0]._id);
    //   if (res.message) {
    //     successToast("Fare added successfully");
    //     setIsLoading(false);
    //   } else {
    //     errorToast("Something went wrong");
    //   }

    //   setIsLoading(false);
    // } catch (error: any) {
    //   errorToast(error.response.data.message);
    //   setIsLoading(false);
    // }
  };

  React.useEffect(() => {
    getData();
  }, []);

  // async function getS3SignUrl(key: string, contentType: string, type: string) {
  //   const headers = { "Content-Type": "application/json" };
  //   const response: any = await getS3SignUrlApi(
  //     {
  //       key,
  //       contentType,
  //       type,
  //     },
  //     { headers }
  //   );
  //   return response;
  // }

  const getData = async () => {
    console.log("get data called :>> ");
    // setIsLoading(true);
    // try {
    //   const res = await getFare();
    //   const key = res.data?.profileImageKey;
    //   if (key) {
    //     {
    //       const contentType = "image/png";
    //       const type = "get";
    //       const data: any = await getS3SignUrl(key, contentType, type);
    //       setInitialProfileImage({ key: key, url: data.url });
    //       setFinalProfileImage({ key: key, url: data.url });
    //       setImagePreview(data.url);
    //     }
    //   }
    //   if (res.data.length !== 0) {
    //     setCheck(true);
    //     setId(res?.data[0]._id);
    //   } else {
    //     setIsLoading(false);
    //     return;
    //   }

    //   setInitialFormValues({
    //     name: res?.data[0].fare,
    //     image: {},
    //   });
    //   setIsLoading(false);
    // } catch (error: any) {
    //   errorToast(error.response.data.message);
    //   setIsLoading(false);
    // }
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
              General
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
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between gap-4 ">
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="name"
                        className="input-custom-label dark:text-white"
                      >
                        App Name
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="name"
                        type="text"
                        id="name"
                        placeholder="Enter app name here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.name}
                      />
                      <div className="error-input">
                        {errors.name && touched.name ? errors.name : null}
                      </div>
                    </div>
                    <div className="mb-3 me-6 w-full">
                    <label
                        htmlFor="image"
                        className="input-custom-label dark:text-white"
                      >
                        App Image
                      </label>
                      <div className="mt-2">
                        {imagePreview && (
                          <>
                            <div
                              className="image-preview"
                              style={{
                                width: "55px",
                                height: "55px",
                                padding: "2px",
                                border: "2px solid #9CA3AF",
                                borderRadius: "4px",
                              }}
                            >
                              <img
                                src={imagePreview}
                                style={{
                                  objectFit: "contain",
                                  height: "100%",
                                  width: "auto",
                                  cursor: "pointer",
                                  padding: "5px",
                                }}
                                alt="img"
                                onClick={handleDivClickImg}
                              />
                              <a
                                ref={anchorImageRef}
                                href={imagePreview}
                                download="your-image-file.png"
                                style={{ display: "none" }}
                              ></a>
                            </div>
                          </>
                        )}
                        <div
                          style={{
                            border: "2px solid #9CA3AF",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          className="mt-2 h-12 rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        >
                          <label>
                            <div
                              className="flex items-center justify-center"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="mb-3">
                                <img
                                  src={uploadCloud}
                                  alt="Upload Cloud"
                                  height="24px"
                                  width="24px"
                                  className="mr-1"
                                />
                              </div>
                              <div className="mb-3">
                                {!params.id
                                  ? "Click here to upload your app image (file size below 1MB)"
                                  : "Click here to update your app image(file size below 1MB)"}
                              </div>
                            </div>
                            <input
                              // required
                              accept="image/*"
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.5)",
                                display: "none",
                              }}
                              className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              name="image"
                              type="file"
                              id="image"
                              onChange={(event) => {
                                setFieldValue("image", event.target.files[0]);
                                const file = event.target.files[0];
                                setFinalProfileImage({
                                  key: `drivers/profileImages/${uuidv4()}.png`,
                                  url: "",
                                  file: file,
                                });
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    setImagePreview(e.target.result);
                                  };
                                  reader.readAsDataURL(file);
                                } else {
                                  setImagePreview(null);
                                }
                                if (event.target.files[0]) {
                                  setIsProfileImage(true);
                                }
                              }}
                              onBlur={handleBlur}
                            />
                          </label>
                        </div>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="error-input"
                        />
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

export default General;
