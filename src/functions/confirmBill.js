export const confirmBill = async (setLoading, setFileGenerateModal, setMessage, setAlertType, baseUrl, billInfo, invoiceId) => {
    setLoading(true)

    let token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/invoice/updateInvoice/${invoiceId}`, {
        method: "PUT",
        headers: {
            'Content-type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...billInfo, status: "Paid" })
    })
    if(res){
        setLoading(false)
    }
    if (!res.ok) {
        console.log("Un Successful")
        setMessage("Un Successful")
        setAlertType("Danger")
    }
    if (res.ok) {
        setFileGenerateModal(true)
    }
    
}