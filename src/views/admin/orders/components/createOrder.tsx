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
      vendor_order_id: '',
      order_total: '',
      paid: '',
      order_source: '',
      customer_orderId: ''
    },
    pickup_details: {
      name: '',
      contact_number: '',
      latitude: '',
      longitude: '',
      address: '',
      city: ''
    },
    drop_details: {
      name: '',
      contact_number: '',
      latitude: '',
      longitude: '',
      address: '',
      city: ''
    },
    order_items: [
      { id: '', name: '', quantity: '', price: '' }
    ]
  };

  const orderSchema = Yup.object().shape({
    order_details: Yup.object().shape({
      vendor_order_id: Yup.string().required('Vendor order ID is required'),
      order_total: Yup.number().required('Order total is required'),
      paid: Yup.string().required('Paid status is required'),
      order_source: Yup.string().required('Order source is required'),
      customer_orderId: Yup.string().nullable()
    }),
    pickup_details: Yup.object().shape({
      name: Yup.string().required('Pickup name is required'),
      contact_number: Yup.string().required('Contact number is required'),
      latitude: Yup.string().required('Latitude is required'),
      longitude: Yup.string().required('Longitude is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required')
    }),
    drop_details: Yup.object().shape({
      name: Yup.string().required('Drop name is required'),
      contact_number: Yup.string().required('Contact number is required'),
      latitude: Yup.number().required('Latitude is required'),
      longitude: Yup.number().required('Longitude is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required')
    }),
    order_items: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required('Item ID is required'),
        name: Yup.string().required('Item name is required'),
        quantity: Yup.number().required('Item quantity is required'),
        price: Yup.number().required('Item price is required')
      })
    )
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
              initialValues={initialValues}
              validationSchema={orderSchema}
              onSubmit={(values) => {
                handleCreateOrder(values);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <Form>
                  <div>
                    <h3>Order Details</h3>
                    <div>
                      <label>Vendor Order ID</label>
                      <Field name="order_details.vendor_order_id" />
                      <ErrorMessage name="order_details.vendor_order_id" />
                    </div>
                    <div>
                      <label>Order Total</label>
                      <Field name="order_details.order_total" type="number" />
                      <ErrorMessage name="order_details.order_total" />
                    </div>
                    <div>
                      <label>Paid</label>
                      <Field name="order_details.paid" />
                      <ErrorMessage name="order_details.paid" />
                    </div>
                    <div>
                      <label>Order Source</label>
                      <Field name="order_details.order_source" />
                      <ErrorMessage name="order_details.order_source" />
                    </div>
                    <div>
                      <label>Customer Order ID</label>
                      <Field name="order_details.customer_orderId" />
                      <ErrorMessage name="order_details.customer_orderId" />
                    </div>
                  </div>

                  <div>
                    <h3>Pickup Details</h3>
                    <div>
                      <label>Name</label>
                      <Field name="pickup_details.name" />
                      <ErrorMessage name="pickup_details.name" />
                    </div>
                    <div>
                      <label>Contact Number</label>
                      <Field name="pickup_details.contact_number" />
                      <ErrorMessage name="pickup_details.contact_number" />
                    </div>
                    <div>
                      <label>Latitude</label>
                      <Field name="pickup_details.latitude" />
                      <ErrorMessage name="pickup_details.latitude" />
                    </div>
                    <div>
                      <label>Longitude</label>
                      <Field name="pickup_details.longitude" />
                      <ErrorMessage name="pickup_details.longitude" />
                    </div>
                    <div>
                      <label>Address</label>
                      <Field name="pickup_details.address" />
                      <ErrorMessage name="pickup_details.address" />
                    </div>
                    <div>
                      <label>City</label>
                      <Field name="pickup_details.city" />
                      <ErrorMessage name="pickup_details.city" />
                    </div>
                  </div>

                  <div>
                    <h3>Drop Details</h3>
                    <div>
                      <label>Name</label>
                      <Field name="drop_details.name" />
                      <ErrorMessage name="drop_details.name" />
                    </div>
                    <div>
                      <label>Contact Number</label>
                      <Field name="drop_details.contact_number" />
                      <ErrorMessage name="drop_details.contact_number" />
                    </div>
                    <div>
                      <label>Latitude</label>
                      <Field name="drop_details.latitude" />
                      <ErrorMessage name="drop_details.latitude" />
                    </div>
                    <div>
                      <label>Longitude</label>
                      <Field name="drop_details.longitude" />
                      <ErrorMessage name="drop_details.longitude" />
                    </div>
                    <div>
                      <label>Address</label>
                      <Field name="drop_details.address" />
                      <ErrorMessage name="drop_details.address" />
                    </div>
                    <div>
                      <label>City</label>
                      <Field name="drop_details.city" />
                      <ErrorMessage name="drop_details.city" />
                    </div>
                  </div>

                  <div>
                    <h3>Order Items</h3>
                    {values.order_items.map((item, index) => (
                      <div key={index}>
                        <div>
                          <label>ID</label>
                          <Field name={`order_items[${index}].id`} />
                          <ErrorMessage name={`order_items[${index}].id`} />
                        </div>
                        <div>
                          <label>Name</label>
                          <Field name={`order_items[${index}].name`} />
                          <ErrorMessage name={`order_items[${index}].name`} />
                        </div>
                        <div>
                          <label>Quantity</label>
                          <Field name={`order_items[${index}].quantity`} />
                          <ErrorMessage name={`order_items[${index}].quantity`} />
                        </div>
                        <div>
                          <label>Price</label>
                          <Field name={`order_items[${index}].price`} />
                          <ErrorMessage name={`order_items[${index}].price`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit">Submit</button>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      )}
    </>
  );
}

export default CreateOrder;
