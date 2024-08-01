import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
  FieldArray,
} from "formik";
import * as Yup from "yup";
import Loader from "components/loader/loader";
import Navbar from "components/navbar";
import Card from "components/card";
import { createOrder } from "services/customAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CalculateTotalPrice(): any {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const total = values.order_items.reduce(
      (sum: any, item: any) => sum + (parseFloat(item.price) || 0),
      0
    );
    setFieldValue("order_details.order_total", total.toFixed(2));
  }, [values.order_items, setFieldValue]);

  return null;
}

function uniqueRandomId(): string {
  const timestamp = Math.floor(Date.now() / 1000) % 1000000;
  const randomData = timestamp.toString().padStart(6, "0");
  return randomData;
}

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

function CreateOrder() {
  const initialValues = {
    order_details: {
      vendor_order_id: uniqueRandomId(),
      order_total: "",
      paid: "false",
      order_source: "POS",
      customer_orderId: "",
    },
    pickup_details: {
      name: "Food Station",
      contact_number: "9876543210",
      latitude: "19.221172",
      longitude: "72.984738",
      address: "mulund",
      city: "Mumbai",
    },
    drop_details: {
      name: "",
      contact_number: "",
      latitude: "19.102537",
      longitude: "73.007877",
      address: "",
      city: "",
    },
    order_items: [{ id: "", name: "", quantity: 1, price: 0 }],
  };

  const orderSchema = Yup.object().shape({
    order_details: Yup.object().shape({
      vendor_order_id: Yup.string(),
      order_total: Yup.number(),
      paid: Yup.boolean(),
      order_source: Yup.string(),
      customer_orderId: Yup.string().nullable(),
    }),
    pickup_details: Yup.object().shape({
      name: Yup.string(),
      contact_number: Yup.string(),
      latitude: Yup.string(),
      longitude: Yup.string(),
      address: Yup.string(),
      city: Yup.string(),
    }),
    drop_details: Yup.object().shape({
      name: Yup.string(),
      contact_number: Yup.string(),
      latitude: Yup.string(),
      longitude: Yup.string(),
      address: Yup.string(),
      city: Yup.string(),
    }),
    order_items: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        name: Yup.string(),
        quantity: Yup.number().min(1, "Quantity must be at least 1"),
        price: Yup.number().min(0, "Price must be greater than or equal to 0"),
      })
    ),
  });

  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  console.log(orderItems);

  useEffect(() => {
    setOrderItems([
      {
        name: "chicken",
        id: 1,
        price: 145,
      },
      {
        name: "panner",
        id: 3,
        price: 200,
      },
      {
        name: "daal",
        id: 2,
        price: 105,
      },
    ]);
  }, []);

  const handleSubmitAPI = async (values: any) => {
    try {
      console.log("Submitting values:", values);

      const response = await createOrder(values);

      if (response) {
        successToast(t("order Created Successfully"));
        navigate("/admin/order");
        setIsLoading(false);
      } else {
        errorToast(t("Something went wrong"));
      }

      console.log("response", response);
    } catch (errors) {
      // If validation fails, handle errors appropriately
      console.error("Validation errors:", errors);
    }
  };

  const filterAvailableItems = (currentOrderItems: any[]) => {
    // Example filter logic, adjust according to your needs
    return orderItems.filter(
      (item) =>
        !currentOrderItems.some((orderItem) => orderItem.name === item.name)
    );
  };

  return (
    <>
      <Navbar flag={false} brandText="addOrder" />
      <Link
        to="/admin/order"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <FaArrowLeft />
        <div>Back</div>
      </Link>
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
              onSubmit={(values) => handleSubmitAPI(values)}
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
                                <div key={index} className="mb-4 border-b pb-4">
                                  <div className="grid grid-cols-5 gap-3">
                                    <div className="mb-5">
                                      <label
                                        htmlFor={`order_items.${index}.id`}
                                        className="mb-2 block font-medium text-gray-800"
                                      >
                                        ID
                                        <span className="text-red-500">
                                          {" "}
                                          *{" "}
                                        </span>
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
                                        <span className="text-red-500">
                                          {" "}
                                          *{" "}
                                        </span>
                                      </label>
                                      <Field
                                        as="select"
                                        name={`order_items.${index}.name`}
                                        id={`order_items.${index}.name`}
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                        onChange={(
                                          e: React.ChangeEvent<HTMLSelectElement>
                                        ) => {
                                          const selectedName = e.target.value;
                                          const selectedItem = orderItems.find(
                                            (item) => item.name === selectedName
                                          );
                                          setFieldValue(
                                            `order_items.${index}.name`,
                                            selectedName
                                          );
                                          if (selectedItem) {
                                            const quantity =
                                              values.order_items[index]
                                                .quantity; // Get current quantity
                                            const price =
                                              selectedItem.price * quantity;
                                            setFieldValue(
                                              `order_items.${index}.price`,
                                              price
                                            );
                                            setFieldValue(
                                              `order_items.${index}.id`,
                                              selectedItem.id
                                            );
                                          }
                                        }}
                                      >
                                        <option value="">Select Item</option>
                                        {orderItems.map((item) => (
                                          <option
                                            key={item.id}
                                            value={item.name}
                                          >
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
                                        <span className="text-red-500">
                                          {" "}
                                          *{" "}
                                        </span>
                                      </label>
                                      <Field
                                        type="number"
                                        name={`order_items.${index}.quantity`}
                                        id={`order_items.${index}.quantity`}
                                        placeholder="Enter Quantity"
                                        className="w-full rounded-lg border-2 border-gray-200 p-2 hover:border-gray-500 focus:border-gray-500"
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          const quantity = e.target.value;
                                          setFieldValue(
                                            `order_items.${index}.quantity`,
                                            quantity
                                          );
                                          const itemPrice =
                                            values.order_items[index].price;
                                          if (itemPrice) {
                                            setFieldValue(
                                              `order_items.${index}.price`,
                                              (
                                                itemPrice * Number(quantity)
                                              ).toString()
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
                                        <span className="text-red-500">
                                          {" "}
                                          *{" "}
                                        </span>
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
                                      onClick={() => remove(index)}
                                      className="rounded bg-red-500 p-2 text-white hover:bg-red-600 focus:outline-none"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="mt-3 rounded-lg bg-blue-500 px-4 py-2 text-white"
                                onClick={() =>
                                  push({
                                    id: "",
                                    name: "",
                                    quantity: "",
                                    price: "",
                                  })
                                }
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
                  <div className="mt-5 flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="rounded bg-blue-500 p-2 text-white"
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
