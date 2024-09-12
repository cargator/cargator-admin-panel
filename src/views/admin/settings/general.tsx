import Navbar from "components/navbar";
import React, { useEffect, useRef, useState } from "react";
import Card from "components/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  addFare,
  createAppFlowAPI,
  createAppNameAndImageApi,
  deleteObjectFromS3Api,
  getAppNameAndImage,
  getCurrentMap,
  getFlow,
  getS3SignUrlApi,
  handleCreateAppNameAndImageApi,
  updateAppFlowAPI,
  updateAppImage,
  updateCurrentMap,
} from "services/customAPI";
import Loader from "components/loader/loader";
import uploadCloud from "../../../assets/svg/upload-cloud.svg";
import axios from "axios";
import { useSelector } from "react-redux";

type formvalues = {
  appImage: File;
};

type profImage = {
  key: string;
  url: string;
  file?: any;
};

function General() {
  const appStoreData = useSelector((store: any) => store.app.sukam);
  const navigate = useNavigate();
  const anchorImageRef = useRef(null);
  const [selectedMapOption, setSelectedMapOption] = useState(
    appStoreData.currentMap || "OlaMap"
  );
  const [imagePreview, setImagePreview] = useState(appStoreData.appImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const initialFormValues = {
    appImage: null as File,
  };

  const handleOptionChange = (event: any) => {
    setSelectedMapOption(event.target.value);
    console.log("event.target.value", event.target.value);
  };

  const handleSelectedMap = async () => {
    setIsLoading(true);
    try {
      if (appStoreData.utilId) {
        const data = { selectedMapOption };
        const res = await updateCurrentMap(appStoreData.utilId, data);
        console.log("respone:>>>>", res);
        setIsLoading(false);
      }
    } catch (error: any) {
      errorToast(error.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const FILE_SIZE = 1024 * 6024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  const appSchema = Yup.object().shape({
    appImage: Yup.mixed()
      // .nullable()
      .required("A file is required")
      .test("fileSize", "Please upload file below 1 MB size", (value: any) => {
        return value && value.size <= FILE_SIZE;
      })
      .test(
        "fileFormat",
        "Unsupported Format",
        (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
      ),
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

  React.useEffect(() => {
    // getData();
  }, []);

  async function getS3SignUrl(key: string, contentType: string, type: string) {
    try {
      const headers = { "Content-Type": "application/json" };
      const response: any = await getS3SignUrlApi(
        {
          key,
          contentType,
          type,
        },
        { headers }
      );
      console.log("response", response);

      return response.url;
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
    }
  }

  const handleUpdateAppImage = async (values: formvalues) => {
    setIsLoading(true);
    try {
      const key = `sukam/logo-${values.appImage.name}.png`;
      const presignedUrl = await getS3SignUrl(key, "image/png", "put");
      console.log("presignedUrl", presignedUrl);
      await axios.put(presignedUrl, values.appImage);
      const response = await updateAppImage(appStoreData.utilId, {
        appImageKey: key,
      });
      successToast("Image Updated Successfuly");
    } catch (error: any) {
      errorToast(error.response.data.message);
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Navbar flag={false} brandText="fare" />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-50 mt-4 pb-10 h-full"}>
          <header className="relative flex items-center justify-between p-10">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              General
            </div>
          </header>
          <div className="pb-5 pe-20 ps-20" style={{ width: "50%" }}>
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => {
                console.log("hitt submit");
                handleUpdateAppImage(values);
              }}
              validationSchema={appSchema}
            >
              {({ handleBlur, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <div className="flex w-full flex-col justify-between gap-4">
                    <div className="mb-3 w-full">
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
                          className="h-15 mt-2 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        >
                          <label>
                            <div
                              className="flex items-center justify-center gap-4"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="mb-3">
                                <img
                                  src={uploadCloud}
                                  alt="Upload Cloud"
                                  height="24px"
                                  width="24px"
                                  className="mr-2"
                                />
                              </div>
                              <div className="mb-2 mt-2 text-center">
                                Click here to upload your app image
                                <br />
                                (file size below 1MB)
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
                              name="appImage"
                              type="file"
                              id="appImage"
                              onChange={(event) => {
                                setFieldValue(
                                  "appImage",
                                  event.target.files[0]
                                );
                                const file = event.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    setImagePreview(e.target.result);
                                  };
                                  reader.readAsDataURL(file);
                                } else {
                                  setImagePreview(null);
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
            {isLoading ? (
              <Loader />
            ) : (
              <div className="mb-5">
                <label
                  htmlFor="flow"
                  className="input-custom-label dark:text-white"
                >
                  Choose Map
                </label>
                <div className="w-full justify-between  gap-5">
                  <label htmlFor="default" className="mr-8 ">
                    <input
                      type="radio"
                      id="google"
                      name="option"
                      value="google"
                      checked={selectedMapOption === "google"}
                      onChange={handleOptionChange}
                      // disabled={isDisabled}
                    />
                    <label className="ml-2">Google</label>
                  </label>
                  <label htmlFor="custom" className="mr-8">
                    <input
                      type="radio"
                      id="olaMap"
                      name="option"
                      value="olaMap"
                      checked={selectedMapOption === "olaMap"}
                      onChange={handleOptionChange}
                      // disabled={isDisabled}
                    />
                    <label className="ml-2">OlaMap</label>
                  </label>
                  <button
                    onClick={() => handleSelectedMap()}
                    className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default General;
