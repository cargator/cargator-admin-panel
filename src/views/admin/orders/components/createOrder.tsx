import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage, useFormikContext, FieldArray } from "formik";
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

function CalculateTotalPrice(): any {

  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const total = values.order_items.reduce((sum: any, item: any) => sum + (parseFloat(item.price) || 0), 0);
    setFieldValue("order_details.order_total", total.toFixed(2));
  }, [values.order_items, setFieldValue]);

  return null;
}

function CreateOrder() {
  const initialValues = {
    order_details: {
      vendor_order_id: 101,
      order_total: "",
      paid: true,
      agree: Yup.boolean()
        .oneOf([true], 'You must paid to the terms'),
      order_source: "",
      customer_orderId: "",
    },
    pickup_details: {
      name: "Food Station",
      contact_number: "9876543210",
      latitude: "17.342545",
      longitude: "16.74518",
      address: "mulund",
      city: "Mumbai",
    },
    drop_details: {
      name: "",
      contact_number: "",
      latitude: "",
      longitude: "",
      address: "",
      city: "",
    },
    order_items: [{ id: "", name: "", quantity: 1, price: 0 }],
  };

  console.log("initialValues ===> ", initialValues);

  const orderSchema = Yup.object().shape({
    order_details: Yup.object().shape({
      vendor_order_id: Yup.string(),
      order_total: Yup.number().required("Order total is required"),
      paid: Yup.boolean(),
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
        id: Yup.number(),
        // .required("Item ID is required"),
        name: Yup.string().required("Item name is required"),
        quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
        price: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Price is required'),
      })
    ),
  });

  const params = useParams<{ id?: string }>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  console.log(orderItems);


  useEffect(() => {
    setOrderItems([{
      name: 'chicken',
      id: 1,
      price: 145,
    }, {
      name: 'panner',
      id: 3,
      price: 200,
    }, {
      name: 'daal',
      id: 2,
      price: 105,
    }]);
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Validate the form using Yup schema
      // await orderSchema.validate(values, { abortEarly: false });

      // If validation succeeds, proceed with form submission logic
      console.log("Submitting values:", values);

      // Simulate API call or perform actual submission
      // Replace with actual API call logic
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2)); // Replace with actual submission logic
        setSubmitting(false);
      }, 500);
    } catch (errors) {
      // If validation fails, handle errors appropriately
      console.error("Validation errors:", errors);
      setSubmitting(false); // Ensure setSubmitting is called appropriately
    }
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
              onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(false);
              }}
            >
              {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <CalculateTotalPrice />
                  <div className="flex flex-grow gap-3">
                    <div className="w-full">

                      {/* drop details */}
                      <div>
                        <label className="mb-2 font-bold text-gray-800">
                          Drop Details
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="mb-5">
                            <label
                              htmlFor="drop_details.name"
                              className="mb-2 block font-medium text-gray-800"
                            >
                              Name
                              <span className="text-red-500"> * </span>
                            </label>
                            <Field
                              type="text"
                              name="drop_details.name"
                              id="drop_details.name"
                              placeholder="Enter Name"
                              className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                            />
                            <ErrorMessage
                              name="drop_details.name"
                              component="div"
                              className="text-red-600"
                            />
                          </div>

                          <div className="mb-5">
                            <label
                              htmlFor="drop_details.contact_number"
                              className="mb-2 block font-medium text-gray-800"
                            >
                              Contact Number
                              <span className="text-red-500"> * </span>
                            </label>
                            <Field
                              type="text"
                              name="drop_details.contact_number"
                              id="drop_details.contact_number"
                              placeholder="Enter Contact Number"
                              className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                            />
                            <ErrorMessage
                              name="drop_details.contact_number"
                              component="div"
                              className="text-red-600"
                            />
                          </div>

                          <div className="mb-5">
                            <label
                              htmlFor="drop_details.address"
                              className="mb-2 block font-medium text-gray-800"
                            >
                              Address
                              <span className="text-red-500"> * </span>
                            </label>
                            <Field
                              type="text"
                              name="drop_details.address"
                              id="drop_details.address"
                              placeholder="Enter Address"
                              className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                            />
                            <ErrorMessage
                              name="drop_details.address"
                              component="div"
                              className="text-red-600"
                            />
                          </div>

                          <div className="mb-5">
                            <label
                              htmlFor="drop_details.city"
                              className="mb-2 block font-medium text-gray-800"
                            >
                              City
                              <span className="text-red-500"> * </span>
                            </label>
                            <Field
                              type="text"
                              name="drop_details.city"
                              id="drop_details.city"
                              placeholder="Enter City"
                              className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                            />
                            <ErrorMessage
                              name="drop_details.city"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* order items */}
                      <div>
                        <label className="mb-2 font-bold text-gray-800">
                          Order Items
                        </label>
                        <FieldArray name="order_items">
                          {({ push, remove }) => (
                            <div>
                              {values.order_items.map((item, index) => (
                                <div key={index} className="border-b pb-4 mb-4">
                                  <div className="grid grid-cols-5 gap-3">
                                    <div className="mb-5">
                                      <label
                                        htmlFor={`order_items.${index}.id`}
                                        className="mb-2 block font-medium text-gray-800"
                                      >
                                        ID
                                        <span className="text-red-500"> * </span>
                                      </label>
                                      <Field
                                        disabled
                                        type="number"
                                        name={`order_items.${index}.id`}
                                        placeholder="Enter Item ID"
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                      />
                                      <ErrorMessage
                                        name={`order_items.${index}.id`}
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                    <div className="mb-5">
                                      <label
                                        htmlFor={`order_items.${index}.name`}
                                        className="mb-2 block font-medium text-gray-800"
                                      >
                                        Item Name
                                        <span className="text-red-500"> * </span>
                                      </label>
                                      <Field
                                        as="select"
                                        name={`order_items.${index}.name`}
                                        id={`order_items.${index}.name`}
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                          const selectedName = e.target.value;
                                          const selectedItem = orderItems.find((item) => item.name === selectedName);
                                          setFieldValue(`order_items.${index}.name`, selectedName);
                                          if (selectedItem) {
                                            const quantity = values.order_items[index].quantity; // Get current quantity
                                            const price = selectedItem.price * quantity
                                            setFieldValue(`order_items.${index}.price`, price);
                                            setFieldValue(`order_items.${index}.id`, selectedItem.id);
                                          }
                                        }}
                                      >
                                        <option value="">Select Item</option>
                                        {orderItems.map((item) => (
                                          <option key={item.id} value={item.name}>
                                            {item.name}
                                          </option>
                                        ))}
                                      </Field>
                                      <ErrorMessage
                                        name={`order_items.${index}.name`}
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>

                                    <div className="mb-5">
                                      <label
                                        htmlFor={`order_items.${index}.quantity`}
                                        className="mb-2 block font-medium text-gray-800"
                                      >
                                        Quantity
                                        <span className="text-red-500"> * </span>
                                      </label>
                                      <Field
                                        type="number"
                                        name={`order_items.${index}.quantity`}
                                        id={`order_items.${index}.quantity`}
                                        placeholder="Enter Quantity"
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const quantity = e.target.value;
                                          setFieldValue(`order_items.${index}.quantity`, quantity);
                                          const itemPrice = values.order_items[index].price;
                                          if (itemPrice) {
                                            setFieldValue(
                                              `order_items.${index}.price`,
                                              (itemPrice * Number(quantity)).toString()
                                            );
                                          }
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`order_items.${index}.quantity`}
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>

                                    <div className="mb-5">
                                      <label
                                        htmlFor={`order_items.${index}.price`}
                                        className="mb-2 block font-medium text-gray-800"
                                      >
                                        Price
                                        <span className="text-red-500"> * </span>
                                      </label>
                                      <Field
                                        type="number"
                                        name={`order_items.${index}.price`}
                                        id={`order_items.${index}.price`}
                                        placeholder="Enter Price"
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                      />
                                      <ErrorMessage
                                        name={`order_items.${index}.price`}
                                        component="div"
                                        className="text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      className="text-red-600 hover:text-red-900"
                                      onClick={() => remove(index)}
                                    >
                                      Remove Item
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => push({ id: "", name: "", quantity: "", price: "" })}
                              >
                                Add Item
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      {/* order details */}
                      <div>
                        <label className="mb-2 font-bold text-gray-800">
                          Order Details
                        </label>
                        <div className="grid grid-cols-2 gap-7">

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
                              name="order_details.order_total"
                              id="orderAmount"
                              placeholder="Enter Order Amount"
                              className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                              readOnly
                            />
                            <ErrorMessage
                              name="order_details.order_total"
                              component="div"
                              className="text-red-600"
                            />
                          </div>

                          <div className="mb-5">
                            <label
                              htmlFor="order_details.paid"
                              className="mb-4 block font-medium text-gray-800"
                            >
                              Paid
                            </label>
                            <Field
                              type="checkbox"
                              name="order_details.paid"
                              id="order_details.paid"
                              className="mr-2"
                            />
                            <ErrorMessage
                              name="order_details.paid"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Submit */}
                  <div className="flex justify-end mt-5 space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded"
                    // disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
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
