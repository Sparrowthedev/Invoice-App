import { useSelector, useDispatch } from 'react-redux';
import ItemListCard from './ItemListCard';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import PreviousItemListComponent from './PreviousItemListComponent';
import LoadingSpinner from '../components/LoaderComponent'


const ItemListContainer = ({ previousItemList, clientBillInfo }) => {
    let token = localStorage.getItem("token")


    const items = useSelector((state) => state.itemList)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


    const { invoiceId } = useParams();

    const [invoiceDate, setInvoiceDate] = useState(clientBillInfo.invoiceDate)
    const [paymentTerms, setPaymentTerms] = useState(clientBillInfo.paymentTerms)
    const [productDescription, setProductDescription] = useState(clientBillInfo.productDescription)
    const [status, setStatus] = useState(clientBillInfo.status)
    const [itemList, setItemList] = useState()
    const [confirmModal, setConfirmModal] = useState(false)

    const updatedClientBillInfo = {
        invoiceDate, paymentTerms, productDescription,
        status, itemList
    }

    function confirmGoods() {
        setItemList(items.concat(previousItemList))
        setConfirmModal(true)
    }



    async function updateClintBillInfo() {
        setLoading(true)
        const res = await fetch(`http://localhost:5000/api/v1/invoice/updateInvoice/${invoiceId}`, {
            method: "PUT",
            headers: {
                'Content-type': "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...updatedClientBillInfo })
        })
        if (res) {
            setLoading(false)
        }
        if (res.ok) {
            navigate(`/invoicepreview/${invoiceId}`)
        }
    }

    return (
        <div className="w-[90%] md:w-[80%] mx-auto lg:ml-[14rem] my-[4rem] relative">
            {loading && <LoadingSpinner />}
            {items &&
                <>
                    <div className='text-white flex items-center justify-between'>
                        <h1 className='text-left text-2xl font-bold'>Item List</h1>
                        <div className='text-[18px] relative flex items-center justify-center'>
                            <i className="fa-solid fa-cart-shopping text-[35px] md:text-[50px]"></i>
                            <p className="absolute bg-[#7B5EF8] text-[10px] md:text-[14px] rounded-full py-1 px-2 border-2 border-[#141625] top-[-15px] right-[-10px]">{(items.length + previousItemList.length)}</p>
                        </div>
                    </div>
                    <p className='text-white text-lg'>Newly Purchased Items <span className='text-[16px] font-normal'>({items.length})</span></p>
                    {items.map((item) =>
                        <div key={item.itemId} className="my-5">
                            <ItemListCard item={item} previousItemList={previousItemList} />
                        </div>
                    ).reverse()}
                </>
            }
            {previousItemList &&
                <div className="my-[1rem]">
                    <p className='text-white text-lg'>Previously Purchased Items <span className='text-[16px] font-normal'>({previousItemList.length})</span></p>
                    {previousItemList.map((previousItem) =>
                        <div key={previousItem._id} className="my-5">
                            <PreviousItemListComponent previousItem={previousItem} previousItemList={previousItemList} />
                        </div>
                    ).reverse()}
                </div>
            }
            <div className='text-right'>
                {items && items.length === 0 ? "" : <button className='text-white bg-green-500 px-3 py-2' onClick={confirmGoods}>Confirm</button>}
            </div>

            {confirmModal &&
                <ConfirmModal setConfirmModal={setConfirmModal} performAction={updateClintBillInfo} header="Confirm" body="Are you sure you want to proceed with payment?" />
            }
        </div>
    )
}

export default ItemListContainer