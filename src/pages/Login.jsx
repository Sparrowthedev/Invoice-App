import { useState, useEffect } from 'react'
import LoginImage from '../assets/images/3d signin.jpeg'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../components/LoaderComponent'

const Login = ({ baseUrl }) => {

    // const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [alertType, setAlertType] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputType, setInputType] = useState('password');
    const [showPassword, setShowPassword] = useState(false)

    const { vendorData } = useSelector((state) => state.vendorAuth)
    const navigate = useNavigate();

    useEffect(() => {
        if (vendorData) {
            navigate('/')
        }
    }, [])


    const handleVedorLogin = async (e) => {
        console.log(baseUrl)
        setLoading(true)
        e.preventDefault();
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        if (response) {
            setLoading(false)
        }
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.err)
            setAlertType("Danger")
            setTimeout(() => {
                setMessage("")
                setAlertType("")
            }, 3000)
        }
        if (response.ok) {
            localStorage.setItem('vendorInfo', JSON.stringify(data.vendor))
            localStorage.setItem('token', data.token)
            navigate('/')
            location.reload()
            setAlertType("Success")
        }
    }

    const toggleInput = () => {
        setInputType(inputType === 'password' ? 'text' : 'password')
        setShowPassword(!showPassword)
    }

    return (
        <div className="p-0 lg:p-12 mx-auto h-screen flex justify-center items-center">
            {/* {loading && <LoadingSpinner />} */}
            <form className="border-gray-800 border-[2px] w-[90%] relative flex items-center h-auto justify-between gap-9 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]" onSubmit={handleVedorLogin}>
                <div className="w-full px-5 lg:px-12 py-12">
                    <h1 className="text-start text-xl text-white">Sign In</h1>
                    {message && <Alert message={message} alertType={alertType} />}
                    <label className="block my-7">
                        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className="focus:outline-none border-gray-300 rounded-[4px] border-[1px] pl-3 py-2 w-full" />
                    </label>
                    <label className="block my-7 relative">
                        <input type={inputType} placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)} className="focus:outline-none border-gray-300 rounded-[4px] border-[1px] pl-3 py-2 w-full" />
                        <div className='absolute md:top-[10px] top-[10px] right-5 cursor-pointer'>
                            {showPassword ? <i className="ri-eye-fill" onClick={toggleInput}></i> : <i className="ri-eye-off-fill" onClick={toggleInput}></i>}
                        </div>
                    </label>
                    {!loading ?
                        <input type="submit" value="Sign In" className="w-full bg-green-500 text-white py-2 rounded-[4px] hover:cursor-pointer" />
                        :
                        <button type="submit" disabled className="buttonload cursor-not-allowed flex items-center justify-center gap-3 w-full bg-green-300 text-white py-2 rounded-[4px]">
                            <i className="fa fa-spinner fa-spin"></i>
                            <p>Sign In</p>
                        </button>
                    }
                    <p className="text-center pt-3 text-white">Don't have an account? <Link to='/register'>Sign Up</Link> </p>
                    <p className='text-white text-center pt-2'><Link to='/forgotPassword'>Forgot Password?</Link></p>
                </div>
                <img src={LoginImage} className="lg:w-1/2 lg:block hidden" alt="" />
            </form>
        </div >
    )
}

export default Login