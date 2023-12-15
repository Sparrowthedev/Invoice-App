import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClientInfo } from "../redux/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoaderComponent";
import { addClient } from "../functions/addClient";
import Alert from "../components/Alert";
import { checkTokenAndRedirect } from "../functions/token";

const Clients = ({baseUrl}) => {
  const [searchWord, setSearchWord] = useState("");
  const [clientDetails, setClientDetails] = useState({
    clientName: "",
    clientEmail: "",
    clientStreetAddress: "",
    clientCountry: "",
    clientCity: "",
    clientPostalCode: "",
    clientPhone: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.client);
  const { vendorData } = useSelector((state) => state.vendorAuth);
  const [clientInfo, setClientInfo] = useState();
  const [clientModal, setClientModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState();
  let logedInVendor = JSON.parse(localStorage.getItem("vendorInfo"));

  useEffect(() => {
    setLoading(true);
    if (vendorData) {
      navigate("/clients");
    }
    if (logedInVendor === null) {
      navigate("/login");
    } else {
      checkTokenAndRedirect(navigate)
      dispatch(getAllClientInfo());
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function viewClientInfo(clientId) {
    setClientModal(true);
    let client = clients.find((client) => {
      return client._id === clientId;
    });
    setClientInfo(client);
  }

  return (
    <div className="lg:px-[100px] px-5 lg:ml-[10rem] mx-auto w-full lg:w-[90%] md:mt-2 mt-[6rem] md:mb-2 mb-[10rem]">
      <div className="searchAndText text-white mt-20 w-full  mx-auto">
        <h1 className="w-full">My Clients</h1>
        <SearchBar setSearchWord={setSearchWord} setActive={setActive}/>
      </div>
      {message && <Alert message={message} alertType={alertType} alertLocation={''} setMessage={setMessage}/>}
      {loading && <LoadingSpinner />}
      {clients ? (
        <div className="text-white w-full lg:w-[90%] mx-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            {clients &&
              clients
                .filter((client) => {
                  if (searchWord === "") return client;
                  else if (
                    client.clientName
                      .toLowerCase()
                      .includes(searchWord.toLowerCase())
                  )
                    return client;
                })
                .map((client) => (
                  <div
                    onClick={() => viewClientInfo(client._id)}
                    key={client._id}
                    className="bg-[#1F213A] p-5 rounded-md hover:cursor-pointer flex items-center justify-between border-gray-700 border-[1px]"
                  >
                    <p>{client.clientName}</p>
                    <i className="ph ph-eye text-[20px]"></i>
                  </div>
                ))}
          </div>
        </div>
      ) : (!active &&
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 animation-placeholder w-full mx-auto lg:w-[90%]">
          <div className="bg-[#1F213A] p-5 rounded-md animated-background"></div>
          <div className="bg-[#1F213A] p-5 rounded-md animated-background"></div>
          <div className="bg-[#1F213A] p-5 rounded-md animated-background"></div>
        </div>
      )}
      {active && (
        <form action="" className="bg-[#1F213A] px-10 py-10 mt-5 rounded-lg text-white">
          <div>
            <p className="font-bold text-[#7B5EF8]">Client Details</p>
            <label className="block my-7 w-full">
              <h1>Client's Name</h1>
              <input
                type="text"
                name="clientName"
                value={clientDetails.daName}
                onChange={handleChange}
                placeholder="Sparrow"
                className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
              />
            </label>

            <div className="flex items-center md:gap-4 flex-col md:flex-row">
              <div className="block my-3 w-full">
                <h1>Client's Email</h1>
                <input
                  type="text"
                  name="clientEmail"
                  value={clientDetails.clientEmail}
                  onChange={handleChange}
                  placeholder="client@gmail.com"
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
              <div className="block my-3 w-full">
                <h1>Client's Phone Number</h1>
                <input
                  type="number"
                  name="clientPhone"
                  value={clientDetails.clientPhone}
                  onChange={handleChange}
                  placeholder="+234 813 936 296 9"
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
            </div>

            <div className="flex items-center md:gap-4 flex-col md:flex-row">
              <div className="block my-3 w-full">
                <h1>Client's Country</h1>
                <input
                  type="text"
                  name="clientCountry"
                  value={clientDetails.clientCountry}
                  onChange={handleChange}
                  placeholder="Nigeria"
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
              <div className="block my-3 w-full">
                <h1>Client's City</h1>
                <input
                  type="text"
                  name="clientCity"
                  value={clientDetails.clientCity}
                  onChange={handleChange}
                  placeholder="Lagos"
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
            </div>

            <div className="flex items-center md:gap-4 flex-col md:flex-row mt-1">
              <div className="block my-3 w-full">
                <h1>Client's Street Address</h1>
                <input
                  type="text"
                  name="clientStreetAddress"
                  value={clientDetails.clientStreetAddress}
                  onChange={handleChange}
                  placeholder="No 3 Mary's Crescent"
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
              <div className="block my-3 w-full">
                <h1>Client's Postal Code</h1>
                <input
                  type="text"
                  name="clientPostalCode"
                  value={clientDetails.clientPostalCode}
                  placeholder="141270"
                  onChange={handleChange}
                  className="focus:outline-none border-gray-800 rounded-[4px] border-[1px] pl-3 py-2 w-full bg-[#141625]"
                />
              </div>
            </div>
            <div className="flex items-end justify-end mt-3">
              <button type="submit" className='text-[14px] font-bold flex items-center justify-between bg-[#7B5EF8] rounded-lg gap-2 py-3 px-5 hover:cursor-pointer' onClick={(e) => addClient(e, setMessage, setLoading, setAlertType, clientDetails, dispatch, setActive)}>Submit</button>
              </div>
            </div>
        </form>
      )}
      {clientModal && (
        <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full bg-black bg-opacity-[90%] z-[51]">
          <div className="bg-white py-10 px-5 w-[85%] md:w-[40%] gap-4 rounded-lg text-black text-center relative">
            <i
              className="ri-close-circle-fill absolute top-2 right-2 text-2xl text-[#0f141d] cursor-pointer"
              onClick={() => setClientModal(!clientModal)}
            ></i>
            <div className="clientInfo mt-2">
              <div className="flex gap-2 items-center">
                <i className="ri-user-3-line"></i>
                <p>{clientInfo.clientName}</p>
              </div>
            </div>
            <div className="clientInfo mt-2">
              <div className="flex gap-2 items-center">
                <i className="ri-mail-fill"></i>
                <a href={`mailto:${clientInfo.clientEmail}`}>
                  {clientInfo.clientEmail}
                </a>
              </div>
            </div>
            <div className="clientInfo mt-2">
              <div className="flex gap-2 items-center">
                <i className="ph ph-globe"></i>
                <p>{clientInfo.clientCountry}</p>
              </div>
            </div>
            <div className="clientInfo mt-2">
              <div className="flex gap-2 items-center">
                <i className="ri-building-fill"></i>
                <p>{clientInfo.clientCity}</p>
              </div>
            </div>

            <div className="clientInfo mt-2">
              <div className="flex gap-2 items-center">
                <i className="ph ph-phone"></i>
                <a href={`tel:+${2348139692969}`}>{clientInfo.clientPhone}</a>
                {/* <p>+234 813 969 296 9</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
