import { addNewInvoice } from "../redux/invoiceSlice";

export const addInvoice = async (
  e,
  invoice,
  setMessage,
  setLoading,
  setAlertType,
  dispatch,
  setClientDetails,
  setInvoice
) => {
  e.preventDefault();
  try {
    if (
      !invoice.invoiceDate ||
      !invoice.paymentTerms ||
      !invoice.productDescription ||
      !invoice.status
    ) {
      setMessage("Update all invoice details");
      setAlertType("Danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else {
      setLoading(true);
      await dispatch(addNewInvoice(invoice));
      setMessage("Invoice added successfully");
      setAlertType("Success");
      setClientDetails(null);
      setInvoice({
        clientId: "",
        invoiceDate: "",
        paymentTerms: "",
        productDescription: "",
        itemList: [],
        status: "Pending",
        grandTotal: "",
      });
    }
  } catch (error) {
    setMessage("Failed to add client");
    setAlertType("Danger");
  } finally {
    setLoading(false);
  }
};
