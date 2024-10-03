import React, { useEffect, useRef, useState } from "react";
import Card from "../../../../components/card";
import Select from "react-select";
import { Button } from "@chakra-ui/react";
import "./driverform.css";
import { ErrorMessage, Formik, useFormikContext } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
  createDriverApi,
  deleteObjectFromS3Api,
  getAvailableRestaurantApi,
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
import { t } from "i18next";
import { vehicleNumberFormat } from "helper/commonFunction";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

//  for crop function 
import Cropper from 'react-easy-crop';

interface ImageUploadProps {
  setFieldValue: (field: string, value: any) => void;
  handleBlur: () => void;
  params: { id?: string };
  t: (key: string) => string; // Assuming t is a translation function
}

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

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (formik.values?.vehicleNumber === "none") {
        formik.values.vehicleType = "none";
        formik.values.vehicleName = "none";
        setVehicleName("None");
        setVehicleType("None");
      } else {
        allAvailableVehicles.map((data: any) => {
          if (data.vehicleNumber === formik.values.vehicleNumber) {
            formik.values.vehicleType = data.vehicleType;
            formik.values.vehicleName = data.vehicleName;
            setVehicleName(data.vehicleName);
            setVehicleType(data.vehicleType);
          }
        });
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
  restaurantName: string;
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
  const [restaurantName, setRestaurantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<formvalues>({
    firstName: "",
    lastName: "",
    restaurantName: "",
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
  const [allRestaurantList, setAllRestaurantList] = useState([]);
  const [options, setOptions] = useState([]);
  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const anchorImageRef = useRef(null);

  const navigate = useNavigate();
  const params = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [initialProfileImage, setInitialProfileImage] = useState<profImage>();
  const [initialDocArray, setInitialDocArray] = useState<any>([]);
  const [finalProfileImage, setFinalProfileImage] = useState<profImage>();
  const [finalDocArray, setFinalDocArray] = useState<docState>([]);
  const [isdocuments, setIsDocuments] = useState(params.id ? false : false);
  const [isProfileImage, setIsProfileImage] = useState(
    params.id ? false : false
  );

  const [isImageFile, setIsImageFile] = useState<boolean>(false)

   // for crop function
   const [cropCompleted, setCropCompleted] = useState(false);

   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
   const [cropperOpen, setCropperOpen] = useState(false);

  const anchorRefs = useRef(Array(finalDocArray.length).fill(null));

   // for document overflow
   const [showAll, setShowAll] = useState(false);
   const visibleDocs: FinalDocArray[] = showAll ? finalDocArray : finalDocArray.slice(0, 4);
 
  const FILE_SIZE = 1024 * 1024;
  const FILE_SIZE_DOC = 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const SUPPORTED_FORMATS_DOC = ["application/pdf"];

  // for crop image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result as string);
        setCropperOpen(true); // Open cropper when file is selected
      };
      reader.readAsDataURL(file);
    }
  };

  // for crop  image
  const handleCropImage = async (e: any) => {

  
    if (!e) return;

    if (imageFile && croppedAreaPixels && cropCompleted) { // Check if crop is complete
      const imageUrl = await getCroppedImg(imageFile, croppedAreaPixels);

    console.log('this is the imageURL>>>>>>>>>>>>>>>:',imageUrl);

      const response = await fetch(imageUrl);
      const blob = await response.blob(); // Get the Blob

      // Create a File from the Blob
      const croppedFile = new File([blob], `cropped_${uuidv4()}.png`, { type: blob.type });

      setImagePreview(imageUrl);
      setImageFile(croppedFile)
      setFinalProfileImage({
        key: `vehicles/vehicleimage/${uuidv4()}.png`,
        url: imageUrl,
        file: croppedFile,
      });
      setCropperOpen(false);
      // Reset the crop completion status

    }
  };


  const driverSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("First name must be atleast two characters."))
      .required(t("Name is required")),
    restaurantName: Yup.string()
      .min(2, t("Restaurant name must be atleast two characters."))
      .required(t("Restaurant is required")),
    // lastName: Yup.string()
    //   .min(2, "Last name must be atleast two characters.")
    //   .required("Last name is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]+$/, t("Invalid mobile number."))
      .min(10, t("Mobile Number must be 10 digits only."))
      .max(10, t("Mobile Number must be 10 digits only."))
      .required(t("Mobile number is Required")),
    // vehicleNumber: Yup.string()
    // .min(10, "Vehicle Number must be 10 digits only.")
    // .max(10, "Vehicle Number must be 10 digits only.")
    // .matches(
    //   /^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/,
    //   "Vehicle Number must follow the pattern: XX99XX9999"
    // )
    // // .required(t("Vehicle number is required"))
    // ,
    // vehicleType: Yup.string().required(t("Vehicle type is required")),
    // vehicleName: Yup.string().required(t("Vehicle name is required")),
    image: isProfileImage
      ? Yup.mixed()
          // .nullable()
          .required(t("A file is required"))
          .test(
            "fileSize",
            t("Please upload file below 1 MB size"),
            (value: any) => {
              return value && value.size <= FILE_SIZE;
            }
          )
          .test(
            "fileFormat",
            t("Unsupported Format"),
            (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
          )
      : Yup.mixed(),
    documents: isdocuments
      ? Yup.mixed()
          .required(t("A file is required"))
          .test("fileSizeDoc", t("File too large"), (value: any) => {
            let add = 0;
            let i = value?.length - 1;
            while (i >= 0) {
              add = add + value[i]?.size;
              i--;
            }
            return value && add <= FILE_SIZE_DOC;
          })
          .test("fileFormat", t("Unsupported Format"), (value: any) => {
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
      console.log("res", res.data);
      if (!res) {
        errorToast("Vehicles not available");
      }
      setOptions(
        res.data.map((option: any) => {
          return {
            value: option.vehicleNumber,
            label: vehicleNumberFormat(option.vehicleNumber),
          };
        })
      );
      setAllAvailableVehicles(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  const getAvailableRestaurant = async () => {
    try {
      const res = await getAvailableRestaurantApi();
      console.log("res", res.data);
      if (!res) {
        errorToast("Restaurant not available");
      }
      setRestaurantOptions(
        res.data.map((option: any) => {
          return {
            value: option.restaurantName,
            label: option.restaurantName,
          };
        })
      );
      setAllRestaurantList(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message);
    }
  };

  useEffect(() => {
    console.log({ options });
  }, [options]);

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
    console.log("-----------", presignedUrl, uploadPhoto);
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
        if (finalProfileImage?.url === "") {
          console.log("image key to upload :>> ", finalProfileImage?.url);
          {
            const key = finalProfileImage?.key;
            console.log("image key to upload :>> ", key);
            const contentType = "image/*";
            const type = "put";
            if (key !== undefined) {
              const data: any = await getS3SignUrl(key, contentType, type);
              if (data.url) {
                res = await pushProfilePhotoToS3(
                  data.url,
                  finalProfileImage.file
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
            console.log("docs key to upload :>> ", ele?.key);
            const key = ele?.key;
            console.log("docs key to upload :>> ", key);
            const contentType = "application/pdf";
            const type = "put";
            if (key !== undefined) {
              const data: any = await getS3SignUrl(key, contentType, type);

              if (data?.url) {
                res1 = await pushProfilePhotoToS3(data?.url, ele?.file);
                if (res1.status === 200) {
                  console.log("uploaded correctly ");
                }
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
        console.log("image key db:>> ", finalProfileImage?.key);

        const result: any = await handleCreateDriverApi(params.id, {
          firstName: values.firstName,
          lastName: values.lastName,
          restaurantName: values.restaurantName,
          mobileNumber: values.mobileNumber,
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleType: values.vehicleType,
          profileImageKey: finalProfileImage?.key,
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
          const key = finalProfileImage?.key;
          const contentType = "image/png";
          const type = "put";
          if (key !== undefined) {
            const data: any = await getS3SignUrl(key, contentType, type);

            if (data.url) {
              res = await pushProfilePhotoToS3(
                data.url,
                finalProfileImage.file
              );
            }
          }
        }

        {
          finalDocArray.forEach(async (ele) => {
            const key = ele?.key;
            docsKey.push(key);
            const contentType = "application/pdf";
            const type = "put";
            if (key !== undefined) {
              const data: any = await getS3SignUrl(key, contentType, type);

              if (data.url) {
                res1 = await pushProfilePhotoToS3(data.url, ele.file);
              }
            }
          });
        }

        const result: any = await createDriverApi({
          firstName: values.firstName,
          lastName: values.lastName,
          restaurantName: values.restaurantName,
          mobileNumber: values.mobileNumber,
          vehicleNumber: values.vehicleNumber,
          vehicleName: values.vehicleName,
          vehicleMake: values.vehicleMake,
          vehicleModel: values.vehicleModel,
          vehicleType: values.vehicleType,
          profileImageKey: finalProfileImage?.key,
          documentsKey: docsKey,
        });

        if (result.message) {
          successToast(t("Driver Created Successfully"));
          navigate("/admin/drivers");
          setIsLoading(false);
        } else {
          console.log("11112345678");

          errorToast(t("Something went wrong"));
        }
      }
    } catch (error: any) {
      console.log("2222222222");
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

      console.log("get data by driver id ", res.data);

      setInitialFormValues({
        firstName: res.data.firstName,
        restaurantName: res.data.restaurantName,
        lastName: res.data.lastName,
        mobileNumber: res.data.mobileNumber.slice(2, 12),
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
      setRestaurantName(res.data.restaurantName);

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

  useEffect(() => {
    if (options && paramData?.vehicleNumber) {
      if (options[options.length - 1]?.value !== paramData.vehicleNumber) {
        // options.push({
        //   value: paramData?.vehicleNumber,
        //   label: paramData?.vehicleNumber,
        // });
        setOptions([
          ...options,
          {
            value: paramData?.vehicleNumber,
            label: vehicleNumberFormat(paramData.vehicleNumber),
          },
        ]);
        allAvailableVehicles.push(paramData);
      }
    }
  }, [options, paramData]);

  useEffect(() => {
    if (params.id) {
      getData(params.id);
    }
  }, [params]);

  useEffect(() => {
    getAvailableVehicles();
    getAvailableRestaurant();
  }, [vehicleType]);

  return (
    <>
      <Navbar flag={false} brandText="driverform" />
      <Link
        to="/admin/drivers"
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
                Edit Rider
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add Rider
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
                        {t("Name")}
                      </label>
                      <input
                        required
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="firstName"
                        type="text"
                        id="firstName"
                        placeholder={t("Enter your name here")}
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
                    <div className="mb-3 ms-6 w-full">
                      <label
                        htmlFor="restaurant"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Restaurant Name")}
                      </label>
                      <Select
                        options={[
                          { value: "None", label: "None" },
                          ...restaurantOptions,
                        ]}
                        id="restaurantName"
                        name="resturentName"
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                          if (e && e.value) {
                            setRestaurantName(e.value);
                            values.restaurantName = e.value;
                          }
                        }}
                        value={
                          allRestaurantList.find(
                            (option: any) => option.value === restaurantName
                          ) || {
                            value: !restaurantName ? "None" : restaurantName,
                            label: !restaurantName ? "None" : restaurantName,
                          }
                        }
                        styles={{
                          menu: (provided: any) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          control: (provided: any) => ({
                            ...provided,
                            height: "47px",
                            marginTop: "8px",
                            borderRadius: "10px",
                            fontSize: "0.875rem",
                            borderColor: "#e6e6e6",
                          }),
                          option: (provided: any, state: any) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#f2f3f7"
                              : "white",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#f2f3f7",
                            },
                          }),
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                      <div className="error-input">
                        {errors.restaurantName && touched.restaurantName
                          ? errors.restaurantName
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="mb-3 me-6 w-full">
                      <label
                        htmlFor="mobileNumber"
                        className="input-custom-label dark:text-white"
                      >
                        {t("Mobile Number")}
                      </label>
                      <input
                        required
                        className="mt-2 h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                        name="mobileNumber"
                        type="number"
                        id="mobileNumber"
                        placeholder={t("Enter mobile number here")}
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
                        {t("Vehicle Number")}
                      </label>
                      <Select
                        options={[{ value: "none", label: "None" }, ...options]}
                        id="vehicleNumber"
                        name="vehicleNumber"
                        onBlur={handleBlur}
                        onChange={(e: any) => {
                          setVehicleNumber(e.value);
                          values.vehicleNumber = e.value;
                        }}
                        value={
                          options.find(
                            (option: any) => option.value === vehicleNumber
                          ) || { value: "none", label: "None" }
                        }
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
                        {t("Vehicle Nickname")}
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
                        placeholder={t("Enter vehicle nickname here")}
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
                        {imagePreview && !cropperOpen &&(
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
                          className="h-15 mt-4 rounded-xl border bg-white/0 p-2 text-sm outline-none"
                        >

                           {/* for image crop  */}

                           {cropperOpen && (
                              <div className="relative max-w-[300px] mx-auto">
                                <div className="absolute top-2 left-2 z-10 text-gray-800 bg-white bg-opacity-80 p-2 rounded-md">
                                  Zoom and drag to crop the image
                                </div>

                                {/* Wrapper div for styling the Cropper */}
                                <div  className="border-2 border-dashed border-green-600 rounded-md shadow-md h-[300px] w-[300px] relative mb-4">
                                  <Cropper
                                    image={imagePreview!}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // 1:1 aspect ratio
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => {
                                      console.log("hereee in the oncropcomplete")
                                      setCroppedAreaPixels(croppedAreaPixels);
                                      setCropCompleted(true);
                                    }}
                                  />
                                </div>

                                {/* Buttons below the cropping area */}
                                <div className="flex space-x-2"
                                  onClick={(e) => {console.log('inside div >>>>>>>>>>>>>')}}
                                >
                                  <button
                                     type="button"
                                    className="bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer"
                                    onClick={(e) => {
                                      
                                      console.log('Crop button clicked ------------------------',e.target);
                                      handleCropImage(e);
                                    }}
                                  >
                                    Crop Image
                                  </button>
                                  <button
                                    type="button"
                                    className="border border-gray-300 rounded-md py-2 px-4 cursor-pointer"
                                    onClick={(e) => {
                                      setCropperOpen(false);
                                      setImagePreview(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                               </div>
                            )}
                          <label>
                            {!cropperOpen && <div
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
                              <div className="mb-1 mt-1 text-center">
                                {!params.id
                                  ? t(
                                      "Click here to upload driver profile image"
                                    )
                                  : t(
                                      "Click here to change driver profile image"
                                    )}
                                <br />
                                {t("file size below")} 1MB
                              </div>
                            </div>}

                           {!cropperOpen && <input
                              // required
                              accept="image/*"
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.5)",
                                display: "none",
                              }}
                              className="h-15 mt-2 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              name="image"
                              type="file"
                              id="image"
                              onChange={handleFileChange}
                              onBlur={handleBlur}
                            />}
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
                      <div className="flex flex-row items-start flex-wrap">

                        {visibleDocs.length>0 &&
                          visibleDocs.map((doc, index) => {
                            return (
                              <>
                                <div
                                  className="document-container m-0 mb-2 mt-2 me-2"
                                  key={index}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      width: "55px",
                                      height: "40px",
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
                       {/* for document overflow */}
                       {finalDocArray.length > 4 && (
                        <button
                          type="button"
                          className="text-blue-600 underline hover:text-blue-800 mt-3"
                          onClick={() => setShowAll(!showAll)}
                        >
                          {showAll ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                      <div
                        style={{
                          border: "2px solid #9CA3AF",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        className="h-15 mt-4 rounded-xl border bg-white/0 p-2 text-sm outline-none"
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
                            <div className="mb-1 mt-1 text-center">
                              {!params.id
                                ? t("Click here to upload driver documents")
                                : t("Click here to change driver documents")}
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
                      className=" cancel-button my-2 ms-1 sm:my-0"
                      onClick={() => navigate("/admin/drivers")}
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
};


// for crop image 
const getCroppedImg = (imageSrc: File, pixelCrop: any): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = URL.createObjectURL(imageSrc);
    img.onload = () => {
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url as string); // Ensure it's treated as a string
        } else {
          resolve(''); // Resolve with an empty string if blob is null
        }
      }, 'image/png');
    };
  });
};


export default DriverForm;
