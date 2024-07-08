import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Loader from "components/loader/loader";
import Navbar from "components/navbar";
import Card from "components/card";

const Logger = (props: any): JSX.Element => {
  const { setIsDocuments } = props;
  const firstRender = useRef(true);
  const formik = useFormikContext<any>();
  const params = useParams();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      if (formik.values?.documents?.length > 0) {
        setIsDocuments(true);
      } else {
        if (params.id) {
          setIsDocuments(false);
        }
      }
    }
  }, [formik.values?.documents]);

  return null;
};

function CreateOrder() {
  const initialValues = {
    order_details: {
      vendor_order_id: "",
      order_total: "",
      paid: "",
      order_source: "",
      customer_orderId: "",
    },
    pickup_details: {
      name: "",
      contact_number: "",
      latitude: "",
      longitude: "",
      address: "",
      city: "",
    },
    drop_details: {
      name: "",
      contact_number: "",
      latitude: "",
      longitude: "",
      address: "",
      city: "",
    },
    order_items: [{ id: "", name: "", quantity: "", price: "" }],
  };

  const orderSchema = Yup.object().shape({
    order_details: Yup.object().shape({
      vendor_order_id: Yup.string().required("Vendor order ID is required"),
      order_total: Yup.number().required("Order total is required"),
      paid: Yup.string().required("Paid status is required"),
      order_source: Yup.string().required("Order source is required"),
      customer_orderId: Yup.string().nullable(),
    }),
    pickup_details: Yup.object().shape({
      name: Yup.string().required("Pickup name is required"),
      contact_number: Yup.string().required("Contact number is required"),
      latitude: Yup.string().required("Latitude is required"),
      longitude: Yup.string().required("Longitude is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
    }),
    drop_details: Yup.object().shape({
      name: Yup.string().required("Drop name is required"),
      contact_number: Yup.string().required("Contact number is required"),
      latitude: Yup.number().required("Latitude is required"),
      longitude: Yup.number().required("Longitude is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
    }),
    order_items: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required("Item ID is required"),
        name: Yup.string().required("Item name is required"),
        quantity: Yup.number().required("Item quantity is required"),
        price: Yup.number().required("Item price is required"),
      })
    ),
  });

  const params = useParams<{ id?: string }>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async (values: any) => {
    setIsLoading(true);
    // Call your API to create or update the order here
    console.log(values);
    setIsLoading(false);
  };

  return (
    <>
      <Navbar flag={false} brandText="addOrder" />
      {isLoading ? (
        <Loader />
      ) : (
        <Card extra={"w-full pb-6 p-4 mt-4 pt-10"}>
          <header className="relative flex items-center justify-between ps-10">
            {params.id ? (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Edit Order")}
              </div>
            ) : (
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {t("Add Order")}
              </div>
            )}
          </header>

          <div className="p-10 pb-5 pe-20 ps-20">
            <Formik
              initialValues={{ ...initialValues, toggle: false }}
              validationSchema={orderSchema}
              onSubmit={(values) => {
                handleCreateOrder(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => {
                return (
                  <Form>
                    <div className="flex flex-grow gap-3">
                      <div className="w-full">
                        <div>
                          <label className="mb-2 font-bold text-gray-800">
                            Order Details
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="mb-5">
                              <label
                                htmlFor="orderId"
                                className="mb-2 block font-medium text-gray-800"
                              >
                                Order ID
                                <span className="text-red-500"> * </span>
                              </label>
                              <Field
                                type="text"
                                name="orderId"
                                id="orderId"
                                placeholder="Enter Order ID"
                                className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                              />
                              <ErrorMessage
                                name="orderId"
                                component="div"
                                className="text-red-600"
                              />
                            </div>

                            <div className="mb-5">
                              <label
                                htmlFor="orderAmount"
                                className="mb-2 block font-medium text-gray-800"
                              >
                                Order Amount
                                <span className="text-red-500"> * </span>
                              </label>
                              <Field
                                type="text"
                                name="orderAmount"
                                id="orderAmount"
                                placeholder="Enter Order Amount"
                                className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                              />
                              <ErrorMessage
                                name="orderAmount"
                                component="div"
                                className="text-red-600"
                              />
                            </div>

                            <div className="mb-5">
                              <label className="mb-2 block font-medium text-gray-800">
                                Paid
                              </label>
                              <label className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="paid"
                                  className="checked:border-transparent h-6 w-6 appearance-none rounded-md border-2 border-gray-200 checked:bg-blue-600 focus:outline-none"
                                />
                              </label>
                              <ErrorMessage
                                name="paid"
                                component="div"
                                className="text-red-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Card>
      )}
    </>
  );
}

export default CreateOrder;
