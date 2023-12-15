import { useState, useEffect } from 'react'
import InputItemComponent from '../components/InputItemComponent'
import ItemListContainer from '../components/ItemListContainer'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { checkTokenAndRedirect } from '../functions/token';

const Itemlist = () => {

    const { invoiceId } = useParams()

    const [clientBillInfo, setClientBillInfo] = useState()
    const [itemName, setItemName] = useState("")
    const [itemQuantity, setItemQuantity] = useState()
    const [itemPrice, setItemPrice] = useState()
    const [total, setTotal] = useState(itemQuantity * itemPrice)
    const [previousItemList, setPreviousItemList] = useState()

    const navigate = useNavigate()
    const logedInVendor = localStorage.getItem('vendorInfo')
    let token = localStorage.getItem("token")

    useEffect(() => {
        if (!logedInVendor) {
            navigate('/')
        } else {
            checkTokenAndRedirect(navigate)
            getInvoice()
        }
    }, [])

    async function getInvoice() {
        const res = await fetch(`http://localhost:5000/api/v1/invoice/singleInvoice/${invoiceId}`, {
            headers: {
                'Content-type': "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        if (res.ok) {
            setPreviousItemList(data.singleInvoice.itemList)
            setClientBillInfo(data.singleInvoice)
        }
    }

    return (
        <div>
            <InputItemComponent setItemName={setItemName} setItemQuantity={setItemQuantity} setItemPrice={setItemPrice} setTotal={setTotal} />
            {previousItemList && <ItemListContainer previousItemList={previousItemList} clientBillInfo={clientBillInfo} />}
        </div>
    )
}

export default Itemlist