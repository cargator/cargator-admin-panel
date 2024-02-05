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
  createAppNameAndImageApi,
  deleteObjectFromS3Api,
  getAppNameAndImage,
  getS3SignUrlApi,
  handleCreateAppNameAndImageApi,
} from "services/customAPI";
import Loader from "components/loader/loader";
import uploadCloud from "../../../assets/svg/upload-cloud.svg";
import axios from "axios";

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

  const FILE_SIZE = 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

  const appSchema = Yup.object().shape({
    name: Yup.string().min(1).required("AppName is required"),
    image: isProfileImage
    ? Yup.mixed()
        // .nullable()
        .required("A file is required")
        .test("fileSize", "Please upload file below 1 MB size", (value: any) => {
          return value && value.size <= FILE_SIZE;
        })
        .test(
          "fileFormat",
          "Unsupported Format",
          (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
        )
    : Yup.mixed(),
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
    getData();
  }, []);

  async function getS3SignUrl(key: string, contentType: string, type: string) {
    const headers = { "Content-Type": "application/json" };
    const response: any = await getS3SignUrlApi(
      {
        key,
        contentType,
        type,
      },
      { headers }
    );
    return response;
  }

  async function pushProfilePhotoToS3(presignedUrl: string, uploadPhoto: any) {
    const response = await axios.put(presignedUrl, uploadPhoto);
    // console.log("pushProfilePhotoToS3  :>> ", response);
    return response;
  }

  const handleCreateApp= async (values: any) => {
    setIsLoading(true);
    try {
      if (params.id) {
        let res, res1;
        if (finalProfileImage.url === "") {
          // console.log("image key to upload :>> ", finalProfileImage.url);
          {
            const key = finalProfileImage.key;
            console.log("image key to upload :>> ", key);
            const contentType = "image/*";
            const type = "put";
            const data: any = await getS3SignUrl(key, contentType, type);
            if (data.url) {
              res = await pushProfilePhotoToS3(
                data.url,
                finalProfileImage.file
              );
            }
            if (initialProfileImage) {
              const response = deleteObjectFromS3Api({
                key: initialProfileImage?.key,
              });
            }
          }
        }

        console.log("image key db:>> ", finalProfileImage.key);

        const result: any = await handleCreateAppNameAndImageApi(params.id, {
          name: values.name,
          profileImageKey: finalProfileImage.key,
        });
        console.log("result :>> ", result);

        if (result.message) {
          successToast("app Updated Successfully");
          // navigate("/admin/vehicles");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {
        let res;
        {
          const key = finalProfileImage.key;
          const contentType = "image/*";
          const type = "put";
          const data: any = await getS3SignUrl(key, contentType, type);

          if (data.url) {
            res = await pushProfilePhotoToS3(data.url, finalProfileImage.file);
            console.log("resData",res)
          }
        }

        const result: any = await createAppNameAndImageApi({
          name: values.name,
          profileImageKey: finalProfileImage.key,
        });
        console.log("result :>> ", result);
        if (result.message) {
          successToast("App Created Successfully");
          // navigate("/admin/vehicles");
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

  const getData = async () => {
    // console.log("get data called :>> ", id);
    setIsLoading(true);
    try {
      const res: any = await getAppNameAndImage();

      console.log("res  :>> ", res);

      setInitialFormValues({
        name: res.data.name,
        image: {},
      });
      // setVehicleTypes(res.data.vehicleType);

      const key = res.data?.profileImageKey;
      if (key) {
        {
          const contentType = "image/png";
          const type = "get";
          const data: any = await getS3SignUrl(key, contentType, type);
          setInitialProfileImage({ key: key, url: data.url });
          setFinalProfileImage({ key: key, url: data.url });
          setImagePreview(data.url);
        }
      }
      
      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response?.data?.message || "Something went wrong");
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
              General
            </div>
            {/* )} */}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleCreateApp(values)}
              validationSchema={appSchema}
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
                                  key: `app/appImage/${uuidv4()}.png`,
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
