import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoaderComponent";
import { confirmBill } from "../functions/confirmBill";
import { deleteClientBillInfo } from "../functions/deleteClientBillInfo";
import { getCurrentBillInfo } from "../functions/getCurrentBillInfo";
import { generateImg } from "../functions/generateImage";
import { generatePDF } from "../functions/generatePDF";
import { checkTokenAndRedirect } from "../functions/token";

const PreviewInvoice = ({ baseUrl }) => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [clientBill, setClientBill] = useState({
    clientName: "",
    clientCountry: "",
    clientCity: "",
    clientEmail: "",
    clientStreetAddress: "",
    clientPostalCode: "",
  });

  const { vendorData } = useSelector((state) => state.vendorAuth);

  useEffect(() => {
    if (!vendorData) {
      console.log("Not logged in");
      navigate("/login");
    } else {
      checkTokenAndRedirect(navigate)
      getCurrentBillInfo(
        setLoading,
        setClientBill,
        setProductDescription,
        setPaymentTerms,
        setInvoiceDate,
        setBillIssuedBy,
        setBillInfo,
        baseUrl,
        invoiceId,
        clientBill
      );
    }
  }, []);

  const items = useSelector((state) => state.itemList);

  const [invoiceDate, setInvoiceDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [status, setStatus] = useState("");
  const [itemList, setItemList] = useState(items);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [paidState, setPaidState] = useState(false);
  const [loading, setLoading] = useState(false);

  const [billIssuedBy, setBillIssuedBy] = useState();
  const [billInfo, setBillInfo] = useState();
  const [fileGenerateModal, setFileGenerateModal] = useState(false);

  const navigateHome = () => {
    navigate("/");
  };

  const confirmDelete = () => {
    setConfirmModal(true);
  };

  const confirmBillPaid = () => {
    setWarningModal(true);
  };

  const updatePaid = () => {
    setPaidState(true);
  };

  return (
    <div className="text-white w-[90%] md:w-[75%] mx-auto lg:ml-[15rem] mt-24 mb-10">
      {loading && <LoadingSpinner />}
      {billInfo && billInfo.status === "Paid" ? (
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-[5rem] bg-[#1F213A] py-5 px-6 rounded-md">
          <div className="flex items-center gap-4">
            <p>Status</p>
            <div className="py-[5px] px-3 bg-[#202B3F] rounded-md flex items-center gap-2">
              <i className="ri-checkbox-circle-line p-[3px] text-green-400"></i>
              <p className="font-[600] text-green-400">Paid</p>
            </div>
          </div>
          
        
          <div className="flex items-center gap-4">
            <button
                className={`${billInfo.status === "Paid" ? "hidden" : "py-[5px] px-3 bg-[#202B3F] rounded-md"}`}
                onClick={() => navigate(`/itemlist/${invoiceId}`)}
              >
                Edit
            </button>
            <button
              className="py-[5px] px-3 bg-red-500 rounded-md"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-[5rem] bg-[#1F213A] py-5 px-6 rounded-md">
          <div className="flex items-center gap-4">
            <p>Status</p>
            <>
              {!paidState ? (
                <div className="py-[5px] px-3 bg-[#202B3F] rounded-md flex items-center gap-2">
                  {/* <span className="p-[4px] bg-yellow-600 rounded-full"></span> */}
                  <i className="ri-time-line p-[4px] text-yellow-600"></i>
                  <p className="font-[600] text-yellow-400">Pending</p>
                </div>
              ) : (
                <div className="py-[5px] px-3 bg-[#202B3F] rounded-md flex items-center gap-2">
                  <i className="ri-checkbox-circle-line p-[3px] text-green-400"></i>
                  <p className="font-[600] text-green-400">Paid</p>
                </div>
              )}
            </>
          </div>
          <div className="flex items-center gap-3">
            {!paidState && (
              <button
                className="py-[5px] px-3 bg-[#202B3F] rounded-md"
                onClick={() => navigate(`/itemlist/${invoiceId}`)}
              >
                Edit
              </button>
            )}
            <button
              className="py-[5px] px-3 bg-red-500 rounded-md"
              onClick={confirmDelete}
            >
              Delete
            </button>
            {!paidState && (
              <button
                className="py-[5px] text-[14px] px-3 bg-green-500 rounded-md"
                onClick={updatePaid}
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className=" bg-[#1F213A] py-5 px-4 md:px-6 rounded-md mt-8"
        id="bill"
      >
        <div className="flex md:flex-row flex-col items-start justify-between gap-[2rem] md:gap-[5rem]">
          <div className="flex items-start flex-col">
            <p className="font-bold text-xl text-white">
              #{invoiceId.toString().substring(0, 6).toUpperCase()}
            </p>
            <p className="text-gray-500 text-[18px]">
              {billInfo?.productDescription}
            </p>
          </div>
          <div className="flex items-start flex-col text-gray-500">
            {billIssuedBy && (
              <>
                <p className="text-white">Bill From</p>
                <p>{billIssuedBy.streetAddress}</p>
                <p>{billIssuedBy.city}</p>
                <p>{billIssuedBy.postalCode}</p>
                <p>{billIssuedBy.country}</p>
              </>
            )}
          </div>
        </div>

        {billInfo && (
          <div className="flex md:flex-row flex-col items-start justify-between gap-[2rem] md:gap-[5rem] mt-9">
            <div className="flex items-start justify-between flex-row md:flex-col">
              <div className="mb-5">
                <p className="text-gray-500">Invoice Date</p>
                <p className="font-bold text-sm md:text-lg text-white">
                  {billInfo.invoiceDate}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Due</p>
                <p className="font-bold text-sm md:text-lg text-white">
                  {paymentTerms}
                </p>
              </div>
            </div>
            <div className="flex items-start flex-col text-gray-500 ">
              <p className="text-gray-500">Bill to</p>
              <p className="font-bold text-lg my-2 text-white">
                {clientBill.clientName}
              </p>
              <p>{clientBill.clientStreetAddress}</p>
              <p>{clientBill.clientCity}</p>
              <p>{clientBill.clientPostalCode}</p>
              <p>{clientBill.clientCountry}</p>
            </div>
            <div className="flex items-start flex-col">
              <p className="text-gray-500">Send to</p>
              <p className="font-bold text-lg text-white">
                {clientBill.clientEmail}
              </p>
            </div>
          </div>
        )}

        <div className="text-gray-500 flex items-start flex-col w-full justify-between gap-[2rem] bg-[#202B3F] mt-10 py-4 px-4 rounded-md">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            {billInfo &&
              billInfo.itemList.map((item) => (
                <tbody key={item._id}>
                  <tr>
                    <td className="font-bold text-white">{item.itemName}</td>
                    <td>{item.itemQuantity}</td>
                    <td>{item.itemPrice}</td>
                    <td className="text-white flex items-center">
                      <i className="ph-currency-ngn"></i>
                      <p>
                        {item.total
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "NGN",
                          })
                          .toString()
                          .slice(4)}
                      </p>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
        <div className="flex items-center w-full justify-between gap-[2rem] bg-[#0f141d] mt-7 py-4 px-4 rounded-md">
          <p className="text-white">Grand Total</p>
          {billInfo && (
            <div className="text-white flex items-center">
              <i className="ph-currency-ngn"></i>
              {billInfo.grandTotal ? (
                <p className="font-bold">
                  {billInfo.grandTotal
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "NGN",
                    })
                    .toString()
                    .slice(4)}
                </p>
              ) : (
                <p>0</p>
              )}
            </div>
          )}
        </div>
      </div>
      {message && (
        <Alert
          message={message}
          alertType={alertType}
          setMessage={setMessage}
        />
      )}

      {paidState || billInfo?.status === "Paid" ? (
        <div
          className={`${
            billInfo?.status === "Paid" ? "hidden" : `flex items-center w-full`
          }`}
        >
          <button
            className="my-[2rem] text-white bg-green-500 px-3 py-2 rounded-md"
            onClick={() =>
              confirmBill(
                setLoading,
                setFileGenerateModal,
                setMessage,
                setAlertType,
                baseUrl,
                billInfo,
                invoiceId,
                navigate
              )
            }
          >
            Confirm Payment
          </button>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <button
            className="my-[2rem] text-white bg-green-500 px-3 py-2 rounded-md"
            onClick={confirmBillPaid}
          >
            Confirm Bill
          </button>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          setConfirmModal={setConfirmModal}
          performAction={() =>
            deleteClientBillInfo(
              setLoading,
              setConfirmModal,
              setMessage,
              setAlertType,
              baseUrl,
              navigateHome,
              invoiceId
            )
          }
          header="Confirm Delete"
          body="Are you sure you want to delete this invoice data?"
        />
      )}

      {warningModal && (
        <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full bg-black bg-opacity-[90%] z-[51]">
          <div className="bg-white flex items-center justify-center py-10 px-5 w-[85%] lg:w-1/3 gap-4 flex-col rounded-lg text-black text-center relative">
            <i
              className="ri-close-circle-fill absolute top-2 right-2 text-2xl text-[#0f141d] cursor-pointer"
              onClick={() => setWarningModal(!warningModal)}
            ></i>
            <i className="ri-error-warning-fill text-7xl text-yellow-500"></i>
            <p>
              Please Mark the bill as{" "}
              <span className="px-1 py-[1px] bg-green-500 text-white rounded-sm">
                Paid
              </span>{" "}
              before you can confirm this purchase
            </p>
          </div>
        </div>
      )}

      {fileGenerateModal && (
        <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full bg-black bg-opacity-[90%] z-[51]">
          <div className="bg-white flex items-center justify-center py-10 px-5 w-[90%] mt-[80px] md:w-1/3 gap-4 flex-col rounded-lg text-black text-center relative">
            <i
              className="ri-close-circle-fill absolute top-2 right-2 text-2xl text-[#0f141d] cursor-pointer"
              onClick={() => setFileGenerateModal(!fileGenerateModal)}
            ></i>
            <i className="ri-checkbox-circle-fill text-7xl text-green-600"></i>
            <p>Bill and Payment has been confirmed</p>
            <p>Export Invoice as</p>
            <div className="flex items-center justify-center gap-[3rem]">
              <div
                className="flex items-center justify-center flex-col cursor-pointer"
                onClick={() => generateImg(setFileGenerateModal)}
              >
                <box-icon
                  size="40px"
                  type="solid"
                  name="file-image"
                  color="#202B3F"
                ></box-icon>
                <p>Image</p>
              </div>
              <p>OR</p>
              <div
                className="flex items-center justify-center gap-2 flex-col cursor-pointer"
                onClick={() => generatePDF(setFileGenerateModal)}
              >
                <box-icon
                  size="40px"
                  type="solid"
                  name="file-pdf"
                  color="#202B3F"
                ></box-icon>
                <p>PDF</p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewInvoice;
