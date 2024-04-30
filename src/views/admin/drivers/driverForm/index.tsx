import React, { useRef, useState } from "react";
import Card from "../../../../components/card";
import Select from "react-select";
import { Button } from "@chakra-ui/react";
import "./driverform.css";
import { ErrorMessage, Formik, useFormikContext } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  createDriverApi,
  deleteObjectFromS3Api,
  getAvailableVehiclesApi,
  getDriverByIdApi,
  getS3SignUrlApi,
  handleCreateDriverApi,
} from "../../../../services/customAPI";
import Loader from "components/loader/loader";
import Navbar from "../../../../components/navbar";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import pdf from "../../../../assets/svg/pdf.svg";
import cross from "../../../../assets/svg/cross.svg";
import uploadCloud from "../../../../assets/svg/upload-cloud.svg";
import { toast } from "react-toastify";

const Logger = (props: any): JSX.Element => {
  const {
    setVehicleName,
    setVehicleType,
    allAvailableVehicles,
    setIsDocuments,
  } = props;
  const firstRender = useRef(true);
  const formik = useFormikContext<any>();
  const params = useParams();

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (formik.values?.documents?.length > 0) {
        console.log("docu true");
        setIsDocuments(true);
      } else {
        console.log("docu false");
        if (params.id) {
          setIsDocuments(false);
        }
      }

      console.log("documents values in logger :>> ", formik.values?.documents);
    }
  }, [formik.values?.documents]);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (formik.values?.vehicleNumber) {
        allAvailableVehicles.map((data: any) => {
          if (data.vehicleNumber === formik.values.vehicleNumber) {
            formik.values.vehicleType = data.vehicleType;
            formik.values.vehicleName = data.vehicleName;
            setVehicleName(data.vehicleName);
            setVehicleType(data.vehicleType);
          }
        });
      } else {
      }
    }
  }, [formik.values?.vehicleNumber]);
  return null;
};

type profImage = {
  key: string;
  url: string;
  file?: any;
};

type FinalDocArray = {
  key: string;
  url?: string;
  file?: any;
};

type docState = FinalDocArray[];

type formvalues = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleMake: string;
  vehicleName: string;
  image: any;
  documents: any;
};

const DriverForm = () => {
  const [paramData, setParamData] = useState<any>({});
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleName: "",
    vehicleMake: "",
    vehicleModel: "",
    image: {},
    documents: [],
  });
  const [allAvailableVehicles, setAllAvailableVehicles] = useState([]);
  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const anchorImageRef = useRef(null);

  const navigate = useNavigate();
  const params = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [initialProfileImage, setInitialProfileImage] = useState<profImage>();
  const [initialDocArray, setInitialDocArray] = useState<any>([]);
  const [finalProfileImage, setFinalProfileImage] = useState<profImage>();
  const [finalDocArray, setFinalDocArray] = useState<docState>([]);
  const [isdocuments, setIsDocuments] = useState(params.id ? false : true);
  const [isProfileImage, setIsProfileImage] = useState(
    params.id ? false : true
  );
  const anchorRefs = useRef(Array(finalDocArray.length).fill(null));

  const FILE_SIZE = 1024 * 1024;
  const FILE_SIZE_DOC = 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const SUPPORTED_FORMATS_DOC = ["application/pdf"];

  const driverSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First name must be atleast two characters.")
      .required("Name is required"),
    // lastName: Yup.string()
    //   .min(2, "Last name must be atleast two characters.")
    //   .required("Last name is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, "Invalid mobile number.")
      .min(10, "Mobile Number must be 10 digits only.")
      .max(10, "Mobile Number must be 10 digits only.")
      .required("Mobile number is Required"),
      vehicleNumber: Yup.string()
      .min(10, "Vehicle Number must be 10 digits only.")
      .max(10, "Vehicle Number must be 10 digits only.")
      .matches(
        /^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/,
        "Vehicle Number must follow the pattern: XX99XX9999"
      )
      .required("Vehicle number is required"),
    vehicleType: Yup.string().required("Vehicle type is required"),
    vehicleName: Yup.string().required("Vehicle name is required"),
    image: isProfileImage
      ? Yup.mixed()
          // .nullable()
          .required("A file is required")
          .test(
            "fileSize",
            "Please upload file below 1 MB size",
            (value: any) => {
              return value && value.size <= FILE_SIZE;
            }
          )
          .test(
            "fileFormat",
            "Unsupported Format",
            (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
          )
      : Yup.mixed(),
    documents: isdocuments
      ? Yup.mixed()
          .required("A file is required")
          .test("fileSizeDoc", "File too large", (value: any) => {
            let add = 0;
            let i = value?.length - 1;
            while (i >= 0) {
              add = add + value[i]?.size;
              i--;
            }
            return value && add <= FILE_SIZE_DOC;
          })
          .test("fileFormat", "Unsupported Format", (value: any) => {
            let i = value?.length - 1;
            while (i >= 0) {
              if (value && SUPPORTED_FORMATS_DOC.includes(value[i]?.type)) {
                if (i === 0) {
                  return (
                    value && SUPPORTED_FORMATS_DOC.includes(value[i]?.type)
                  );
                }
              } else {
                return value && SUPPORTED_FORMATS_DOC.includes(value[i]?.type);
              }
              i--;
            }
          })
      : Yup.mixed(),
    // .nullable()
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

  const getAvailableVehicles = async () => {
    try {
      const res = await getAvailableVehiclesApi();
      if (!res) {
        errorToast("Vehicles not available");
      }
      setOptions(
        res.data.map((option: any) => {
          return {
            value: option.vehicleNumber,
            label: option.vehicleNumber,
          };
        })
      );
      setAllAvailableVehicles(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

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
    console.log("-----------",presignedUrl   , uploadPhoto)
    const response = await axios.put(presignedUrl, uploadPhoto);
    console.log("pushProfilePhotoToS3  :>> ", response);
    return response;
  }

  const handleCreateDriver = async (values: any) => {
    setIsLoading(true);
    console.log("finalDocArray :>> ", finalDocArray);
    console.log("initialDocArray :>> ", initialDocArray);
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

              console.log("------------- " ,res.data)
            }
            if (initialProfileImage) {
              const response = deleteObjectFromS3Api({
                key: initialProfileImage?.key,
              });
            }
          }
        }

        let docKey: any = [];
        finalDocArray.forEach(async (ele) => {
          docKey.push(ele.key);
          if (ele?.file) {
            console.log("docs key to upload :>> ", ele.key);
            const key = ele.key;
            console.log("docs key to upload :>> ", key);
            const contentType = "application/pdf";
            const type = "put";
            const data: any = await getS3SignUrl(key, contentType, type);

            if (data.url) {
              res1 = await pushProfilePhotoToS3(data.url, ele.file);
              if (res1.status === 200) {
                console.log("uploaded correctly ");
              }
            }
          }
        });

        for (const item of initialDocArray) {
          if (!finalDocArray.includes(item)) {
            console.log("docs key to delete :>> ", item);
            const res = deleteObjectFromS3Api({
              key: item.key,
            });
          }
        }

        console.log("docs key db:>> ", docKey);
        console.log("image key db:>> ", finalProfileImage.key);

        const result: any = await handleCreateDriverApi(params.id, {
          firstName: values.firstName,
          lastName: values.lastName,
          mobileNumber: values.mobileNumber,
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleType: values.vehicleType,
          profileImageKey: finalProfileImage.key,
          documentsKey: docKey,
        });

        if (result.message) {
          successToast("Driver Updated Successfully");
          navigate("/admin/drivers");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {
        let res, res1;
        let docsKey: any = [];
        {
          const key = finalProfileImage.key;
          const contentType = "image/png";
          const type = "put";
          const data: any = await getS3SignUrl(key, contentType, type);

          if (data.url) {
            res = await pushProfilePhotoToS3(data.url, finalProfileImage.file);
          }
        }

        {
          finalDocArray.forEach(async (ele) => {
            const key = ele.key;
            docsKey.push(key);
            const contentType = "application/pdf";
            const type = "put";
            const data: any = await getS3SignUrl(key, contentType, type);

            if (data.url) {
              res1 = await pushProfilePhotoToS3(data.url, ele.file);
            }
          });
        }

        const result: any = await createDriverApi({
          firstName: values.firstName,
          lastName: values.lastName,
          mobileNumber: values.mobileNumber,
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel,
          vehicleType: values.vehicleType,
          profileImageKey: finalProfileImage.key,
          documentsKey: docsKey,
        });

        if (result.message) {
          successToast("Driver Created Successfully");
          navigate("/admin/drivers");
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

  const getData = async (id: string) => {
    console.log("get data called :>> ");
    setIsLoading(true);
    try {
      const res = await getDriverByIdApi(id);
      let docsURLandkeyarray = [];

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

      let docsKeyArray = res?.data?.documentsKey;
      if (docsKeyArray.length > 0) {
        {
          for (let i = 0; i < docsKeyArray.length; i++) {
            const key = docsKeyArray[i];
            // docsKey.push(key);
            // const contentType = "application/pdf";
            // const type = "get";
            // const data: any = await getS3SignUrl(key, contentType, type);
            // const file = await downloadFileFromURL(data.url, key, contentType);
            // docsURLarray.push(file);
            docsURLandkeyarray.push({
              key: key,
              // url: data.url,
            });
          }

          setInitialDocArray([...docsURLandkeyarray]);
          setFinalDocArray(docsURLandkeyarray);
        }
      }

      setInitialFormValues({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        mobileNumber: res.data.mobileNumber,
        vehicleNumber: res.data.vehicleNumber,
        vehicleType: res.data.vehicleType,
        vehicleName: res.data.vehicleName,
        vehicleMake: res.data.vehicleMake,
        vehicleModel: res.data.vehicleModel,
        image: {},
        documents: [],
      });

      setParamData(res.data);
      setVehicleNumber(res.data.vehicleNumber);
      setVehicleName(res.data.vehicleName);
      setVehicleType(res.data.vehicleType);

      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleDivClickDoc = async (index: number, key: string) => {
    const contentType = "application/pdf";
    const type = "get";
    const data: any = await getS3SignUrl(key, contentType, type);
    anchorRefs.current[index].href = data.url;
    if (anchorRefs.current[index]) {
      anchorRefs.current[index].click();
    }
  };

  const handleDivClickImg = () => {
    if (anchorImageRef.current) {
      anchorImageRef.current.click();
    }
  };

  const handleDelete = (index: any) => {
    const newarr = finalDocArray.filter((ele, i) => i !== index);
    const filelist: any = [];
    newarr.forEach((element: any) => {
      if (element?.file) {
        filelist.push(element.file);
      }
    });
    setFinalDocArray(newarr);
    return filelist;
  };

  const handleDocPush = (filelist: any) => {
    let newArray = finalDocArray;
    for (let index = 0; index < filelist.length; index++) {
      newArray.push({
        key: `drivers/docs/${uuidv4()}.pdf`,
        // url: "",
        file: filelist[index],
      });
    }
    setFinalDocArray(newArray);
  };

  React.useEffect(() => {
    if (options && paramData?.vehicleNumber) {
      if (options[options.length - 1]?.value !== paramData.vehicleNumber) {
        options.push({
          value: paramData?.vehicleNumber,
          label: paramData?.vehicleNumber,
        });
        setOptions(options);
        allAvailableVehicles.push(paramData);
      }
    }
  }, [options, paramData]);

  React.useEffect(() => {
    if (params.id) {
      getData(params.id);
    }
  }, [params]);

  React.useEffect(() => {
    getAvailableVehicles();
  }, []);

  return (
    <>
      <Navbar flag={false} brandText="driverform" />

      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-20">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Edit Operators
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add Operators
              </div>
            )}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => handleCreateDriver(values)}
              validationSchema={driverSchema}
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
                  <Logger
                    display="hidden"
                    setVehicleName={setVehicleName}
                    setVehicleType={setVehicleType}
                    allAvailableVehicles={allAvailableVehicles}
                    setIsDocuments={setIsDocuments}
                  />

                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="firstName"
                        className="input-custom-label dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        required
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="firstName"
                        type="text"
                        id="firstName"
                        placeholder="Enter your name here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.firstName}
                      />
                      <div className="error-input">
                        {errors.firstName && touched.firstName
                          ? errors.firstName
                          : null}
                      </div>
                    </div>
                    {/* <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="lastName"
                        className="input-custom-label dark:text-white"
                      >
                        Last Name
                      </label>
                      <input
                        required
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="lastName"
                        type="text"
                        id="lastName"
                        placeholder="Enter last name here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.lastName}
                      />
                      <div className="error-input">
                        {errors.lastName && touched.lastName
                          ? errors.lastName
                          : null}
                      </div>
                    </div> */}
                    {/* <div className="mb-3 ms-6 w-full">
                    </div> */}
                  </div>

                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="mobileNumber"
                        className="input-custom-label dark:text-white"
                      >
                        Mobile Number
                      </label>
                      <input
                        required
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="mobileNumber"
                        type="number"
                        id="mobileNumber"
                        placeholder="Enter mobile number here"
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
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="vehicleNumber"
                        className="input-custom-label dark:text-white"
                      >
                        Vehicle Number
                      </label>
                      <Select
                        options={options}
                        id="vehicleNumber"
                        name="vehicleNumber"
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                          setVehicleNumber(e.value);
                          values.vehicleNumber = e.value;
                        }}
                        value={options.filter(function (option: any) {
                          return option.value == vehicleNumber;
                        })}
                        styles={{
                          // Fixes the overlapping problem of the component
                          menu: (provided: any) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          control: (provided: any) => ({
                            ...provided,
                            height: "47px", // Adjust the height as needed
                            marginTop: "8px",
                            borderRadius: "10px",
                            fontSize: "0.875rem",
                            borderColor: "#e6e6e6",
                          }),
                          option: (provided: any, state: any) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#f2f3f7"
                              : "white", // Change the background color here
                            color: "black", // Change the text color here
                            "&:hover": {
                              backgroundColor: "#f2f3f7", // Change the background color on hover
                            },
                          }),
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                      <div className="error-input">
                        {errors.vehicleNumber && touched.vehicleNumber
                          ? errors.vehicleNumber
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="vehicleName"
                        className="input-custom-label dark:text-white"
                      >
                        Vehicle Nickname
                      </label>
                      <input
                        required
                        style={{
                          backgroundColor: "rgba(242, 242, 242, 0.5)",
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="vehicleName"
                        type="text"
                        id="vehicleName"
                        placeholder="Enter vehicle nickname here"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={vehicleName}
                        disabled
                      />
                      <div className="error-input">
                        {errors.vehicleName && touched.vehicleName
                          ? errors.vehicleName
                          : null}
                      </div>
                    </div>
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
                        value={vehicleType}
                        disabled
                      />
                      <div className="error-input">
                        {errors.vehicleType && touched.vehicleType
                          ? errors.vehicleType
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <div className="mt-2">
                        {imagePreview && (
                          <>
                            <div
                              className="image-preview"
                              style={{
                                width: "65px",
                                height: "65px",
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
                          className="mt-4 h-15 rounded-xl border bg-white/0 p-2 text-sm outline-none"
                        >
                          <label>
                            <div
                              className="flex items-center justify-center gap-3"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="mb-3">
                                <img
                                  src={uploadCloud}
                                  alt="Upload Cloud"
                                  height="24px"
                                  width="24px"
                                  className="mr-3"
                                />
                              </div>
                              <div
                                className="mb-1 mt-1 text-center"
                              >
                                {!params.id
                                  ? "Click here to upload driver profile image"
                                  : "Click here to change driver profile image"}
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
                              className="mt-2 h-15 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
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
                    <div className="mb-3 ms-6 w-full">
                      <div className="flex flex-row items-start">
                        {finalDocArray.length > 0 &&
                          finalDocArray.map((doc, index) => {
                            return (
                              <>
                                <div
                                  className="document-container m-0 mb-2 me-2"
                                  key={index}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      width: "65px",
                                      height: "65px",
                                      padding: "2px",
                                      cursor: "pointer",
                                      border: "2px solid #9CA3AF",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    <img
                                      src={pdf}
                                      style={{
                                        objectFit: "contain",
                                        height: "100%",
                                        width: "auto",
                                        cursor: "pointer",
                                        padding: "5px",
                                      }}
                                      onClick={() => {
                                        if (!doc?.file) {
                                          handleDivClickDoc(index, doc.key);
                                        }
                                      }}
                                    />
                                    <a
                                      ref={(el) =>
                                        (anchorRefs.current[index] = el)
                                      }
                                      download="your-pdf-file.pdf"
                                      style={{
                                        display: "none",
                                      }}
                                    ></a>
                                    <p>{doc.key.slice(0, 6)}</p>
                                    <span
                                      style={{
                                        position: "absolute",
                                        top: "0",
                                        right: "0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "0 4px 0 0", // Rounded top-right corner
                                        cursor: "pointer",
                                        padding: "-2px -2px 5px 5px",
                                      }}
                                      onClick={() => {
                                        values.documents = handleDelete(index);
                                      }}
                                    >
                                      <img
                                        src={cross}
                                        alt="cross"
                                        width="22px"
                                        height="22px"
                                        style={{
                                          margin: "-8px -8px 0px 0px",
                                        }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                      </div>
                      <div
                        style={{
                          border: "2px solid #9CA3AF",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        className="mt-4 h-15 rounded-xl border bg-white/0 p-2 text-sm outline-none"
                      >
                        <label>
                          <div
                            className="flex items-center justify-center gap-3"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="mb-3">
                              <img
                                src={uploadCloud}
                                alt="Upload Cloud"
                                height="24px"
                                width="24px"
                                className="mr-3"
                              />
                            </div>
                            <div
                              className="mb-1 mt-1 text-center"
                            >
                              {!params.id
                                ? "Click here to upload driver documents"
                                : "Click here to change driver documents"}
                              <br />
                              (file size below 1MB)
                            </div>
                          </div>
                          <input
                            // required
                            multiple={true}
                            accept="application/pdf"
                            style={{
                              backgroundColor: "rgba(242, 242, 242, 0.5)",
                              display: "none",
                            }}
                            className="mt-6 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            name="documents"
                            type="file"
                            id="documents"
                            onChange={(event) => {
                              setFieldValue("documents", event.target.files);
                              handleDocPush(event.target.files);
                            }}
                            onBlur={handleBlur}
                          />
                        </label>
                      </div>
                      <ErrorMessage
                        name="documents"
                        component="div"
                        className="error-input"
                      />
                    </div>
                  </div>

                  <div className="button-save-cancel mt-3 flex justify-end">
                    <Button
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/drivers")}
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

export default DriverForm;
