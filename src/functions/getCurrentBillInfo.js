const updateClientBill = (prevState, propertyName, value) => {
  return {
    ...prevState,
    [propertyName]: value,
  };
};

export const getCurrentBillInfo = async (
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
) => {
  let token = localStorage.getItem("token");
  setLoading(true);
  const res = await fetch(`${baseUrl}/invoice/singleInvoice/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res) {
    setLoading(false);
  }
  const data = await res.json();
  if (res.ok) {
    setClientBill((prevState = clientBill) =>
      updateClientBill(prevState, "clientName", data.singleInvoice.client.clientName)
    );
    setClientBill((prevState = clientBill) =>
      updateClientBill(prevState, "clientCity", data.singleInvoice.client.clientCity)
    );
    setClientBill((prevState = clientBill) =>
      updateClientBill(prevState, "clientCountry", data.singleInvoice.client.clientCountry)
    );
    setClientBill((prevState = clientBill) =>
      updateClientBill(prevState, "clientEmail", data.singleInvoice.client.clientEmail)
    );
    setClientBill((prevState = clientBill) =>
      updateClientBill(
        prevState,
        "clientPostalCode",
        data.singleInvoice.client.clientPostalCode
      )
    );
    setClientBill((prevState = clientBill) =>
      updateClientBill(
        prevState,
        "clientStreetAddress",
        data.singleInvoice.client.clientStreetAddress
      )
    );
    setProductDescription(data.singleInvoice.productDescription);
    setPaymentTerms(data.singleInvoice.paymentTerms);
    setInvoiceDate(data.singleInvoice.invoiceDate);
    setBillIssuedBy(data.billWasGivenBy);
    setBillInfo(data.singleInvoice);
  }
};
