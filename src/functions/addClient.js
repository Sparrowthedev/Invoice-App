import { addNewClient } from "../redux/clientSlice";


export const addClient = async (e, setMessage, setLoading, setAlertType, clientDetails, dispatch, setActive) => {
    e.preventDefault();
    try {
        if (
            !clientDetails.clientName ||
            !clientDetails.clientPhone ||
            !clientDetails.clientEmail ||
            !clientDetails.clientCountry ||
            !clientDetails.clientCity ||
            !clientDetails.clientStreetAddress ||
            !clientDetails.clientPostalCode 
          ) {
            setMessage("Update all client's details");       
            setAlertType('Danger');
            setTimeout(() => {
              setMessage("");
            }, 2000);
          } else {
            setLoading(true)
            await dispatch(addNewClient(clientDetails))
            setMessage('Client added successfully');
            setAlertType('Success');  
            setLoading(false)
            setActive(false)       
         }
        
    } catch (error) {
        setMessage("Failed to add client");
        setAlertType('Danger');
    } finally {
        setLoading(false);
    }
}

