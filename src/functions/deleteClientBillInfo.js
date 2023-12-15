export const deleteClientBillInfo = async (
  setLoading,
  setConfirmModal,
  setMessage,
  setAlertType,
  baseUrl,
  navigateHome,
  invoiceId
) => {
  setLoading(true);
  const token = localStorage.getItem('token');
  const res = await fetch(`${baseUrl}/invoice/deleteInvoice/${invoiceId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    setConfirmModal(false);
    setMessage(
      "This user is Unauthorized to delete this bill information because he/she isn't the one who created it. Please make sure that the current signed in user is the one who created this billing information."
    );
    setAlertType("Danger");
    setTimeout(() => {
      setMessage("");
      setAlertType("");
    }, 4000);

    clearTimeout();
  }
  if (res) {
    setLoading(false);
    console.log(res);
  }
  if (res.ok) {
    navigateHome();
  }
};
