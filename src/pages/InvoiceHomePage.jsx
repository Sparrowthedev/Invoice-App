import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import HomePageTopNav from '../components/HomePageTopNav'
import InvoiceCardContainer from '../components/InvoiceCardContainer'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from '../components/LoaderComponent'
import { getAllInvoices } from '../redux/invoiceSlice'
import { checkTokenAndRedirect } from '../functions/token'


const InvoiceHomePage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { invoices } = useSelector((state) => state.invoices)
    const { vendorData } = useSelector((state) => state.vendorAuth)

    let logedInVendor = JSON.parse(localStorage.getItem('vendorInfo'))

    useEffect(() => {
        if (vendorData) {
            navigate('/home')
        }
        if (logedInVendor === null) {
            navigate('/login')
        } else {
            checkTokenAndRedirect(navigate)
            dispatch(getAllInvoices())
        }
    }, [])

    return (
        <>
            {vendorData ?
                <div className="flex flex-col justify-start items-center">
                    <HomePageTopNav billData={invoices}/>
                    <InvoiceCardContainer billData={invoices} />
                </div>
                :
                // <>Loading</>
                <LoadingSpinner />
            }
        </>

    )
}

export default InvoiceHomePage