import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from './API'
import Notification from './Notification'

const Register = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [role, setRole] = useState('admin')
    const navigate = useNavigate();
    const [isNotification, setIsNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState();
    const [severity, setSeverity] = useState();
    const handleClose = () => {
        setIsNotification(false);
        setNotificationMsg("");
        setSeverity("");
    };
    //register
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const apicall = await api.post(`/auth/signup`, {
                email,
                password,
                role
            })
            localStorage.setItem("accessToken", apicall?.data?.data?.accessToken)
            localStorage.setItem("refreshToken", apicall?.data?.data?.refreshToken)
            localStorage.setItem("role", role)
            navigate('/all-todo')
            setEmail();
            setPassword();
            setRole('admin');
        } catch (error) {
            setIsNotification(true);
            setNotificationMsg(error?.response?.data?.error);
            setSeverity("error");
        }
    }
    const [eyeOpen, setEyeOpen] = useState(false)

    return (
        <>
            {isNotification && notificationMsg ? (
                <Notification
                    message={notificationMsg}
                    close={handleClose}
                    severity={severity}
                />
            ) : (
                <></>
            )}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <div style={{
                    width: '600px',
                    backgroundColor: '#fafafa',
                    height: 'auto',
                    borderRadius: '4px',
                    padding: '20px',
                    border: '1px solid lightgray'
                }}>
                    <h2 style={{ textAlign: 'center' }}>Register</h2>
                    <hr style={{ margin: '20px 0' }} />
                    <form onSubmit={(e) => { handleLogin(e) }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Email</span>
                        <input type='email' style={{
                            padding: '10px 15px',
                            outline: 'none',
                            border: '1px solid gray',
                            width: '100%',
                            borderRadius: '4px',
                            marginBottom: '15px'
                        }} value={email} required placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
                        <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Password</span>
                        <div style={{ position: "relative" }}>
                            <input type={eyeOpen ? 'text' : 'password'} style={{
                                padding: '10px 15px',
                                outline: 'none',
                                border: '1px solid gray',
                                width: '100%',
                                borderRadius: '4px',
                                marginBottom: '15px'
                            }} value={password} required placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                            <div style={{
                                position: 'absolute',
                                right: 10,
                                border: "none",
                                background: 'transparent',
                                top: '40%',
                                transform: 'translateY(-50%)'
                            }} onClick={(e) => { setEyeOpen(!eyeOpen) }}>
                                {
                                    eyeOpen ?
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                                stroke="#000000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                                                stroke="#000000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg> :
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                                                stroke="#000000"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                }
                            </div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Role</span>
                        <select style={{
                            padding: '10px 15px',
                            outline: 'none',
                            border: '1px solid gray',
                            width: '100%',
                            borderRadius: '4px',
                            marginBottom: '15px'
                        }} value={role} required onChange={(e) => setRole(e.target.value)}>
                            <option value=''>Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <button style={{
                            width: '100%',
                        }} type='submit' className='btn'>
                            Register
                        </button>
                    </form>
                    <p style={{
                        fontSize: '13px',
                        textAlign: 'center'
                    }}>You have an account?<Link to='/'> Login</Link></p>
                </div>
            </div>
        </>
    )
}

export default Register