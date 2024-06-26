import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next'
import "../vehicles.css";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import {
  createVehicleApi,
  deleteObjectFromS3Api,
  getS3SignUrlApi,
  getVehicleByIdApi,
  getVehicleTypeList,
  handleCreateVehicleApi,
} from "services/customAPI";
import Loader from "components/loader/loader";
import Card from "components/card";
import { Button } from "@chakra-ui/react";
import { vehicleType } from "utils/constants";
import { type } from "os";
import Navbar from "components/navbar";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import pdf from "../../../../assets/svg/pdf.svg";
import cross from "../../../../assets/svg/cross.svg";
import uploadCloud from "../../../../assets/svg/upload-cloud.svg";
import { t } from "i18next";

const Logger = (props: any): JSX.Element => {
  const {
    setVehicleMake,
    setVehicleType,
    allAvailableVehiclesTypes,
    setIsDocuments,
  } = props;
  const firstRender = useRef(true);
  const formik = useFormikContext<any>();
  const params = useParams();
  const { t } = useTranslation();

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

  // React.useEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //   } else {
  //     if (formik.values?.vehicleModel) {
  //       allAvailableVehiclesTypes.map((data: any) => {
  //         if (data.vehicleModel === formik.values.vehicleModel) {
  //           console.log("data.vehicleType",data.vehicleType)
  //           formik.values.vehicleMake = data.vehicleMake;
  //           formik.values.vehicleType = data.vehicleType;
  //           setVehicleMake(data.vehicleMake);
  //           setVehicleType(data.vehicleType);
  //         }
  //       });
  //     } else {
  //     }
  //   }
  // }, [formik.values?.vehicleModel]);
  return null;
};

type profImage = {
  key: string;
  url?: string;
  file?: any;
};

type FinalDocArray = {
  key: string;
  url?: string;
  file?: any;
};

type docState = FinalDocArray[];

type formvalues = {
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  image: any;
  documents: any;
};

const VehicleForm: React.FC = () => {
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({
    vehicleName: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    image: {},
    documents: [],
  });
  const [paramData, setParamData] = useState<any>({});
  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const anchorImageRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>(); // Correctly define the type of params
  const [imagePreview, setImagePreview] = useState(null);
  const [initialProfileImage, setInitialProfileImage] = useState<profImage>();
  const [initialDocArray, setInitialDocArray] = useState<any>([]);
  const [finalProfileImage, setFinalProfileImage] = useState<profImage>();
  const [finalDocArray, setFinalDocArray] = useState<docState>([]);
  const [allAvailableVehiclesTypes, setAllAvailableVehiclesTypes] = useState([]);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [isdocuments, setIsDocuments] = useState(params.id ? false : false);
  const [isProfileImage, setIsProfileImage] = useState(
    params.id ? false : false
  );
  const [isImageFile, setIsImageFile] = useState<boolean>(false)
  const anchorRefs = useRef(Array(finalDocArray.length).fill(null));

  const FILE_SIZE = 1024 * 1024;
  const FILE_SIZE_DOC = 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const SUPPORTED_FORMATS_DOC = ["application/pdf"];

  const vehicleSchema = Yup.object().shape({
    vehicleName: Yup.string()
      .min(2, "Vehicle name must be atleast two characters.")
      .required("First name is required"),
    vehicleNumber: Yup.string()
      .min(10, "Vehicle Number must be 10 digits only.")
      .max(10, "Vehicle Number must be 10 digits only.")
      .matches(
        /^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/,
        "Vehicle Number must follow the pattern: XX99XX9999"
      )
      .required("Vehicle number is required"),
    vehicleType: Yup.string().required("Vehicle type is required"),
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

  const handleCreateVehicle = async (values: any) => {
    setIsLoading(true);
    try {
      if (params.id) {
        let res, res1;
        if (finalProfileImage?.url === "") {
          // console.log("image key to upload :>> ", finalProfileImage.url);
          {
            const key = finalProfileImage?.key;
            console.log("image key to upload :>> ", key);
            const contentType = "image/*";
            const type = "put";
            if(key !== undefined){
              const data: any = await getS3SignUrl(key, contentType, type);
              if (data.url) {
                res = await pushProfilePhotoToS3(
                  data?.url,
                  finalProfileImage?.file
                );
              }
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
          docKey.push(ele?.key);
          if (ele?.file) {
            // console.log("docs key to upload :>> ", ele?.key);
            const key = ele?.key;
            // console.log("docs key to upload :>> ", key);
            const contentType = "application/pdf";
            const type = "put";
            if (key !== undefined) {
              const data: any = await getS3SignUrl(key, contentType, type);

            if (data.url) {
              res1 = await pushProfilePhotoToS3(data?.url, ele.file);
              if (res1.status === 200) {
                console.log("uploaded correctly ");
              }
            }
            }
            
          }
        });

        for (const item of initialDocArray) {
          if (!finalDocArray.includes(item)) {
            // console.log("docs key to delete :>> ", item);
            const res = deleteObjectFromS3Api({
              key: item.key,
            });
          }
        }

        // console.log("docs key db:>> ", docKey);
        // console.log("image key db:>> ", finalProfileImage?.key);

        const result: any = await handleCreateVehicleApi(params.id, {
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleType: values.vehicleType,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel,
          profileImageKey: finalProfileImage?.key,
          documentsKey: docKey,
        });
        // console.log("result :>> ", result);

        if (result.message) {
          successToast("Vehicle Updated Successfully");
          navigate("/admin/vehicles");
          setIsLoading(false);
        } else {
          errorToast("Something went wrong");
        }
      } else {
        let res, res1;
        let docsKey: any = [];
        {
          const key = finalProfileImage?.key;
          const contentType = "image/*";
          const type = "put";
          if (key !== undefined) {
            const data: any = await getS3SignUrl(key, contentType, type);

            if (data?.url) {
              res = await pushProfilePhotoToS3(data.url, finalProfileImage.file);
            }
          }
        }
        {
          finalDocArray.forEach(async (ele) => {
            const key = ele?.key;
            docsKey.push(key);
            const contentType = "application/pdf";
            const type = "put";
            if(key !== undefined){
              const data: any = await getS3SignUrl(key, contentType, type);

              if (data?.url) {
                res1 = await pushProfilePhotoToS3(data.url, ele.file);
              }
            }
           
          });
        }

        const result: any = await createVehicleApi({
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleType: values.vehicleType,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel,
          profileImageKey: finalProfileImage?.key,
          documentsKey: docsKey,
        });
        // console.log("result :>> ", result);
        if (result.message) {
          successToast("Vehicle Created Successfully");
          navigate("/admin/vehicles");
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
    // console.log("get data called :>> ", id);
    setIsLoading(true);
    try {
      const res: any = await getVehicleByIdApi(id);
      let docsURLandkeyarray = [];

      console.log("res  :>> ", res);

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
        vehicleNumber: res.data.vehicleNumber,
        vehicleType: res.data.vehicleType,
        vehicleName: res.data.vehicleName,
        vehicleMake: res.data.vehicleMake,
        vehicleModel: res.data.vehicleModel,
        image: {},
        documents: [],
      });
      setParamData(res.data);
      setVehicleModel(res.data.vehicleModel);
      setVehicleMake(res.data.vehicleMake);
      setVehicleType(res.data.vehicleType);

      setIsLoading(false);
    } catch (error: any) {
      errorToast(error.response?.data?.message || "Something went wrong");
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
        key: `vehicles/vehicledoc/${uuidv4()}.pdf`,
        // url: "",
        file: filelist[index],
      });
    }
    setFinalDocArray(newArray);
  };

  const handleClick = () => {
    // Set the desired value to the input field
    setInitialFormValues({
      vehicleNumber: initialFormValues.vehicleNumber,
      vehicleType: initialFormValues.vehicleType,
      vehicleName: params.id
        ? initialFormValues.vehicleName
        : initialFormValues.vehicleNumber,
      vehicleMake: initialFormValues.vehicleMake,
      vehicleModel: initialFormValues.vehicleModel,
      image: initialFormValues.image,
      documents: initialFormValues.documents,
    });
  };

  const getVehicleTypes = async () => {
    try {
      const res = await getVehicleTypeList();
      console.log("res", res.data);
      if (!res) {
        errorToast("Vehicles Types not available");
      }
      setOptions(
        res.data.map((option: any) => {
          return {
            value: option.vehicleModel,
            label: option.vehicleModel,
          };
        })
      );
      setAllAvailableVehiclesTypes(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  React.useEffect(() => {
    console.log("object params.id :>> ", params.id);
    if (params.id) {
      getData(params.id);
    }
  }, [params]);

  React.useEffect(() => {
    console.log("finalDocArray :>> ", finalDocArray);
    console.log("initialDocArray :>> ", initialDocArray);
  }, [finalDocArray, initialDocArray]);

  React.useEffect(() => {
    getVehicleTypes();
  }, []);

  return (
    <>
      <Navbar flag={false} brandText="vehicleform" />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-10">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Edit Vehicle")}
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Add Vehicle")}
              </div>
            )}
          </header>
          <div className="p-10 pb-5 pe-20 ps-20" onClick={handleClick}>
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              onSubmit={(values) => {
                handleCreateVehicle(values);
              }}
              validationSchema={vehicleSchema}
            >
              {({
                handleChange,
                setFieldValue,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Logger
                    display="hidden"
                    setVehicleMake={setVehicleMake}
                    setVehicleType={setVehicleType}
                    allAvailableVehiclesTypes={allAvailableVehiclesTypes}
                    setIsDocuments={setIsDocuments}
                  />
                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="vehicleNumber"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Number")}
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        required
                        name="vehicleNumber"
                        type="text"
                        id="vehicleNumber"
                        width="90%"
                        // label="Vehicle Name"
                        placeholder={t("Vehicle Number")}
                        onChange={handleChange}
                        onBlur={(event) => {
                          handleBlur(event);
                          // Copy the value of vehicleNumber to vehicleName
                          if (!params.id) {
                            setFieldValue("vehicleName", event.target.value);
                          }
                        }}
                        value={values?.vehicleNumber}
                        aria-describedby="exampleFormControlInputHelpInline"
                      />
                      {errors.vehicleNumber && touched.vehicleNumber ? (
                        <div className="error-input">
                          {errors.vehicleNumber}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="firstName"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Nickname")}
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        required
                        name="vehicleName"
                        type="text"
                        id="vehicleName"
                        width="90%"
                        // label="Vehicle Number"
                        placeholder={t("Vehicle Nickname")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.vehicleName}
                        aria-describedby="exampleFormControlInputHelpInline"
                      />
                      {errors.vehicleName && touched.vehicleName ? (
                        <div className="error-input">{errors.vehicleName}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="firstName"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Model")}
                      </label>
                      <Select
                        options={options}
                        name="vehicleModel"
                        id="vehicleModel"
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                          console.log("e", e.value)
                          setFieldValue("vehicleModel", e.value)
                          if (e.value) {
                            allAvailableVehiclesTypes.map((data: any) => {
                              if (data.vehicleModel === e.value) {
                                console.log("data.vehicleType", data.vehicleType)
                                setFieldValue('vehicleMake', data.vehicleMake)
                                setFieldValue('vehicleType', data.vehicleType)
                              }
                            });
                          }
                        }}
                        value={options.filter(function (option: any) {
                          return option.value == values.vehicleModel;
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
                      {errors.vehicleModel && touched.vehicleModel ? (
                        <div className="error-input">{errors.vehicleModel}</div>
                      ) : null}
                    </div>
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="firstName"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Make")}
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        required
                        name="vehicleMake"
                        type="text"
                        id="vehicleMake"
                        width="90%"
                        // label="Vehicle Name"
                        placeholder={t("Vehicle Make")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.vehicleMake}
                        disabled
                      />
                      {errors.vehicleMake && touched.vehicleMake ? (
                        <div className="error-input">{errors.vehicleMake}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="vehicleType"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Vehicle Type")}
                      </label>
                      <input
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        required
                        name="vehicleType"
                        type="text"
                        id="vehicleType"
                        width="90%"
                        // label="Vehicle Number"
                        placeholder={t("Vehicle Type")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.vehicleType}
                        // aria-describedby="exampleFormControlInputHelpInline"
                        disabled
                      />

                      {errors.vehicleType && touched.vehicleType ? (
                        <div className="error-input">{errors.vehicleType}</div>
                      ) : null}
                    </div>
                    <div className="mb-3 ms-6 w-full"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <div className="mt-4">
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
                          className="h-15 mt-2 rounded-xl border bg-white/0 p-3 text-sm outline-none"
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
                                  className="mr-1"
                                />
                              </div>
                              <div className="mb-1 mt-1 text-center">
                                {!params.id
                                  ? t("Click here to upload your vehicle image")
                                  : t("Click here to change your vehicle image")}
                                <br />
                                {t("file size below")} 1MB
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
                                  key: `vehicles/vehicleimage/${uuidv4()}.png`,
                                  url: "",
                                  file: file,
                                });
                                if (file) {
                                  setIsImageFile(true);
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
                                      width: "55px",
                                      height: "55px",
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
                        className="h-15 mt-4 rounded-xl border bg-white/0 p-3 text-sm outline-none"
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
                                className="mr-2"
                              />
                            </div>
                            <div className="mb-1 mt-1 text-center">
                              {!params.id
                                ? t("Click here to upload your vehicle documents")
                                : t("Click here to change your vehicle documents")}
                              <br />
                              {t("file size below")} 1MB
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
                      color="dark"
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/vehicles")}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      color="dark"
                      type="submit"
                      className="save-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 sm:my-0"
                      onClick={() => handleSubmit}
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
};
export default VehicleForm;
