import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoaderComponent";
import { getAllClientInfo } from "../redux/clientSlice";
import { addInvoice } from "../functions/addInvoice";
import { checkTokenAndRedirect } from "../functions/token";

const NewInvioce = ({ baseUrl }) => {
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loading, setLoading] = useState(false);
  const { clients } = useSelector((state) => state.client);
  const [clientDetails, setClientDetails] = useState(null);
  const dispatch = useDispatch();

  const [invoice, setInvoice] = useState({
    clientId: '',
    invoiceDate: "",
    paymentTerms: "",
    productDescription: "",
    itemList: [],
    status: "Pending",
    grandTotal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const newItems = [...invoice.itemList];
    const { name, value } = e.target;
    newItems[index][name] = value;

    if (name === "itemQuantity" || name === "itemPrice") {
      const quantity = newItems[index].itemQuantity || 0;
      const price = newItems[index].itemPrice || 0;
      newItems[index].total = quantity * price;
    }

    setInvoice({ ...invoice, itemList: newItems });
  };

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      itemList: [
        ...invoice.itemList,
        { itemName: "", itemQuantity: "", itemPrice: "", total: "" },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...invoice.itemList];
    newItems.splice(index, 1);
    setInvoice({ ...invoice, itemList: newItems });
  };

  const navigate = useNavigate();

  const { vendorData } = useSelector((state) => state.vendorAuth);
  const { vendor } = vendorData;


  useEffect(() => {
    setLoading(true);
    if (!vendorData) {
      console.log("Not logged in");
      navigate("/login");
    } else {
      checkTokenAndRedirect(navigate)
      dispatch(getAllClientInfo());
      setLoading(false);
    }
  }, []);

  const handleClientChange = (e) => {
    const matchedClient = clients.find(
      (client) => client._id === e.target.value
    );
    setClientDetails(matchedClient);
    setInvoice((prevState) => ({
      ...prevState,
      clientId: e.target.value
    }))
  };


  return (
    <div className="md:px-[100px] px-5 mx-auto w-full md:w-[90%] md:mt-2 mt-[6rem] md:mb-2 mb-[10rem]">
      <div className="text-white mt-20 w-full md:w-[80%] mx-auto justify-between gap-[5rem] bg-[#1F213A] px-4 py-8 md:p-8 rounded-md mb-10 relative">
        {message && (
          <Alert
            message={message}
            alertType={alertType}
            alertLocation={""}
            setMessage={setMessage}
          />
        )}{" "}
        {loading && <LoadingSpinner />}
        <h1 className="text-xl font-bold">Create Billing Info</h1>
        {vendor && (
          <div className="mt-9">
            <p className="font-bold text-[#7B5EF8]">Bill From</p>
            <div className="flex items-center flex-col md:flex-row md:gap-4">
              <div className="block my-3 w-full">
                <h1>Country</h1>
                <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                  {vendor.country}
                </p>
              </div>
              <div className="block my-3 w-full">
                <h1>City</h1>
                <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                  {vendor.city}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-col md:flex-row md:gap-4 mt-3">
              <div className="block my-3 w-full">
                <h1>Street Address</h1>
                <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                  {vendor.streetAddress}
                </p>
              </div>
              <div className="block my-3 w-full">
                <h1>Postal Code</h1>
                <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                  {vendor.postalCode}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="h-[1px] my-10 bg-gray-500 w-full"></div>
        <form>
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#7B5EF8]">Bill To</p>

              <select
                onChange={handleClientChange}
                className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2  bg-[#141625]"
              >
                <option value="">-- Select Client --</option>
                {clients?.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            {clientDetails !== null && (
              <div className="mt-9">
                <div className="flex items-center flex-col md:flex-row md:gap-4">
                  <div className="block my-3 w-full">
                    <h1>Name</h1>
                    <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                      {clientDetails.clientName}
                    </p>
                  </div>
                  <div className="block my-3 w-full">
                    <h1>City</h1>
                    <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                      {clientDetails.clientCity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-col md:flex-row md:gap-4 mt-3">
                  <div className="block my-3 w-full">
                    <h1>Street Address</h1>
                    <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                      {clientDetails.clientStreetAddress}
                    </p>
                  </div>
                  <div className="block my-3 w-full">
                    <h1>Postal Code</h1>
                    <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                      {clientDetails.clientPostalCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-col md:flex-row md:gap-4 mt-3">
                  <div className="block my-3 w-full md:w-[49%]">
                    <h1>Country</h1>
                    <p className="text-white bg-[#141625] py-[7px] mt-1 px-2 rounded-[4px]">
                      {clientDetails.clientCountry}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="h-[1px] my-10 bg-gray-500 w-full"></div>

            <div>
              <p className="font-bold text-[#7B5EF8]">Invoice Info</p>
            </div>

            <div className="flex items-center md:gap-4 flex-col md:flex-row mt-1">
              <div className="block my-3 w-full">
                <h1>Invioce Date</h1>
                <input
                  type="date"
                  name="invoiceDate"
                  value={invoice.invoiceDate}
                  onChange={handleChange}
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] px-3 py-2 w-full bg-[#141625]"
                />
              </div>
              <div className="block my-3 w-full">
                <h1>Payment Terms</h1>
                <select
                  name="paymentTerms"
                  value={invoice.paymentTerms}
                  onChange={handleChange}
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                >
                  <option value="">-- Select Payment Terms --</option>
                  <option value="Next 10 Days">Next 10 Days</option>
                  <option value="Next 20 Days">Next 20 Days</option>
                  <option value="Next 30 Days">Next 30 Days</option>
                </select>
              </div>
            </div>

            <div>
              <h3>Provide details of item bought</h3>
              {invoice.itemList.length > 0 &&
                invoice.itemList.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center md:gap-4 flex-col md:flex-row mt-1">
                      <div className="block my-3 w-full">
                        <input
                          type="text"
                          name="itemName"
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, e)}
                          placeholder="Item Name"
                          className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                        />
                      </div>
                      <div className="block my-3 w-full">
                        <input
                          type="number"
                          name="itemQuantity"
                          value={item.itemQuantity}
                          onChange={(e) => handleItemChange(index, e)}
                          placeholder="Item Quantity"
                          className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center md:gap-4 flex-col md:flex-row mt-1">
                      <div className="block my-3 w-full">
                        <input
                          type="text"
                          name="itemPrice"
                          value={item.itemPrice}
                          onChange={(e) => handleItemChange(index, e)}
                          placeholder="Item Price"
                          className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                        />
                      </div>
                      <div className="block my-3 w-full">
                        <p className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]">
                          {item.total ? item.total : "total"}
                        </p>
                      </div>
                    </div>

                    {/* Add inputs for itemQuantity, itemPrice, and total */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-5 flex items-center justify-center gap-2 text-white w-36 bg-[#7B5EF8] py-2 rounded-lg pl-2"
                      >
                        <i className="fa-solid fa-circle-minus"></i>
                        <p>Remove Item</p>
                      </button>
                    </div>
                  </div>
                ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-5 flex items-center justify-center gap-2 text-white w-36 bg-[#7B5EF8] py-2 rounded-lg pl-2"
              >
                <i className="fa-solid fa-circle-plus"></i>
                <p>Add Item</p>
              </button>
            </div>

            <div className="block my-7 w-full">
              <h1>Product Description</h1>
              <input
                type="text"
                name="productDescription"
                value={invoice.productDescription}
                onChange={handleChange}
                placeholder="Web Development"
                className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
              />
            </div>
          </div>
          <div className="flex items-center sm:flex-row flex-col-reverse justify-end sm:gap-1">
            <div className="flex items-center justify-between bg-[#141625] rounded-full gap-2 py-3 px-5 hover:cursor-pointer">
              <Link to="/" className="text-[14px]">
                Cancel
              </Link>
            </div>
            <button
              type="submit"
              onClick={(e) =>
                addInvoice(
                  e,
                  invoice,
                  setMessage,
                  setLoading,
                  setAlertType,
                  dispatch,
                  setClientDetails,
                  setInvoice
                )
              }
              className="text-[14px] flex items-center justify-between bg-[#7B5EF8] rounded-full gap-2 py-3 px-5 hover:cursor-pointer"
              value="Submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvioce;
