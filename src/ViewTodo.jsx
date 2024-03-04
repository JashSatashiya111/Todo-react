import React, { useEffect, useState } from 'react'
import api from './API';
import { Dialog, Pagination } from '@mui/material';
import Todo from './UpdateTodo';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { checkToken } from './App';
import ConfirmationPopup from './ConfirmationPopup';

const ViewTodo = () => {
    const [isNotification, setIsNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState();
    const [severity, setSeverity] = useState();
    const handleCloseNotification = () => {
        setIsNotification(false);
        setNotificationMsg("");
        setSeverity("");
    };
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const [page, setPage] = useState(1)
    const [storeId, setStoreId] = useState([])
    const [storeTodo, setStoreTodo] = useState([])
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const navigate = useNavigate();

    //get todo list
    const handleGetTodo = async () => {
        try {
            const apicall = await api.get(`/todo/get_todo_list?page=${page}&limit=${10}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setStoreTodo(apicall?.data?.data);
        } catch (error) {
            if (error?.response?.status === 403) {
                navigate('/')
            } else if (error?.response?.status === 401) {
                checkToken()
            }
            setIsNotification(true);
            setNotificationMsg(error?.response?.data?.error);
            setSeverity("error");
        }
    }

    //add todo
    const handleAddTodo = async (e) => {
        e.preventDefault();
        const body = {
            title: title,
            description: description
        }
        try {
            const apicall = await api.post(`/todo/Add_todo`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (apicall?.data) {
                setIsAdd(false);
                setIsNotification(true);
                setNotificationMsg("Added successfully");
                setSeverity("success");
                setDescription();
                setTitle()
                handleGetTodo();
            }
        } catch (error) {
            if (error?.response?.status === 403) {
                navigate('/')
            } else if (error?.response?.status === 401) {
                checkToken()
            }
            setIsNotification(true);
            setNotificationMsg(error?.response?.data?.error);
            setSeverity("error");
        }
    }

    useEffect(() => {
        handleGetTodo();
    }, [page])
    const [editId, setEditId] = useState()
    const handleClose = (value) => {
        if (value === 'call Get api') {
            handleGetTodo();
            setEditId();
            setIsEdit(false);
        } else {
            setEditId();
            setIsEdit(false);
        }
    }
    const [confirmationPopup, setConfirmationPopup] = useState(false)
    const [deleteId, setDeleteId] = useState()
    //delete todo
    const handleDeleteTodo = async () => {
        const body = {
            id: deleteId ? [deleteId] : storeId
        }
        try {
            await api.post(`/todo/delete_todo`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },  
            })
            setStoreId([]);
            setDeleteId()
            setIsNotification(true);
            setNotificationMsg("Removed successfully");
            setSeverity("success");
            handleGetTodo();
        } catch (error) {
            if (error?.response?.status === 403) {
                navigate('/')
            } else if (error?.response?.status === 401) {
                checkToken()
            }
            setIsNotification(true);
            setNotificationMsg(error?.response?.data?.error);
            setSeverity("error");
        }
        setConfirmationPopup(false)
    }

    //logout
    const handleLogOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('role')
        navigate('/')
    }

    //select for multiple delete
    const handleSelectId = (id) => {
        if (id) {
            const existId = storeId?.find((x) => x === id);
            if (!existId) {
                setStoreId([...storeId, id])
            } else {
                const removeSelected = storeId?.filter((x) => x !== id)
                setStoreId(removeSelected);
            }
        } else {
            if (storeId?.length > 0) {
                setStoreId([])
            } else {
                setStoreId(storeTodo?.records?.map((x) => x?._id))
            }
        }
    }
    var startRecord = (storeTodo?.currentPage - 1) * 10 + 1;
    var endRecord = Math.min(storeTodo?.currentPage * 10, storeTodo?.totalRecords);
    const handleCloseConfirm = (value) => {
        setConfirmationPopup(value)
    }
    return (
        <>
            <ConfirmationPopup heading="Delete Banner Group" subheading="Do you really want to delete this Todo?" confirmationPopup={confirmationPopup} handleCloseConfirm={handleCloseConfirm} runFunction={handleDeleteTodo} />
            {isNotification && notificationMsg ? (
                <Notification
                    message={notificationMsg}
                    close={handleCloseNotification}
                    severity={severity}
                />
            ) : (
                <></>
            )}
            <div style={{ padding: '30px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h1>All Todo</h1>
                    <div style={{ display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'end' }}>
                        {
                            role === 'admin' ?
                                <button onClick={(e) => { e.preventDefault(); setIsAdd(true) }} className='btn'>+ Add Todo</button> : <></>
                        }
                        <button className='secondary-btn' onClick={(e) => handleLogOut(e)} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" id="logout">
                                <g data-name="Layer 2">
                                    <g data-name="log-out">
                                        <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zM20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z" />
                                    </g>
                                </g>
                            </svg>
                            <span style={{ marginLeft: '5px' }}>Log Out</span>
                        </button>
                    </div>
                </div>
                {
                    storeId?.length > 0 && role === 'admin' &&
                    <button style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }} onClick={(e) => { e.preventDefault(); setConfirmationPopup(true) }} className='btn'>
                        <svg fill="curruntcolor" height={16} width={16} style={{ marginRight: '10px' }} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4C156.6 0 141 8.827 132.4 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16C0 120.9 7.125 128 16 128H32v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16C440.9 128 448 120.9 448 112V96C448 87.13 440.9 80 432 80zM171.9 50.88C172.9 49.13 174.9 48 177 48h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4L171.9 50.88zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320C368 456.8 360.8 464 352 464zM224 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S208 183.2 208 192v208C208 408.8 215.2 416 224 416zM144 416C152.8 416 160 408.8 160 400V192c0-8.844-7.156-16-16-16S128 183.2 128 192v208C128 408.8 135.2 416 144 416zM304 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S288 183.2 288 192v208C288 408.8 295.2 416 304 416z" />
                        </svg>Delete Selection
                    </button>
                }
                {
                    storeTodo?.records?.length > 0 ?
                        <table style={{
                            width: '100%',
                            border: "1px solid lightgray",
                            marginTop: '20px',
                            textAlign: 'left',
                        }}>
                            <thead style={{
                                height: '40px',
                            }}>
                                <tr>
                                    {
                                        role === 'admin' &&
                                        <th style={{ padding: '10px', borderBottom: '1px solid lightgray' }}>
                                            <input type='checkbox' checked={storeId?.length > 0} onChange={(e) => handleSelectId()} />
                                        </th>
                                    }
                                    <th style={{ padding: '10px', borderBottom: '1px solid lightgray' }}>Title</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid lightgray' }}>Description</th>
                                    {
                                        role === 'admin' &&
                                        <th style={{ padding: '10px', borderBottom: '1px solid lightgray', textAlign: 'right' }}>Action</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    storeTodo?.records?.map((elem, index) => {
                                        return (
                                            <tr key={index} style={{ textAlign: 'left' }}>
                                                {
                                                    role === 'admin' &&
                                                    <td style={{ padding: '10px', width: '20px' }}>
                                                        <input type='checkbox' value={elem?._id} checked={storeId?.find((x) => x === elem?._id)} onChange={(e) => handleSelectId(elem?._id)} />
                                                    </td>
                                                }
                                                <td style={{ padding: '10px', width: '300px' }}>{elem?.title}</td>
                                                <td style={{ padding: '10px' }}>{elem?.description}</td>
                                                {
                                                    role === 'admin' &&
                                                    <td style={{ padding: '10px', textAlign: 'right', width: '100px' }}>
                                                        <button style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }} onClick={(e) => { e.preventDefault(); setIsEdit(true); setEditId(elem?._id) }}>
                                                            <svg
                                                                className="feather feather-edit"
                                                                fill="none"
                                                                height={16}
                                                                stroke="blue"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                viewBox="0 0 24 24"
                                                                width={16}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        <button style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }} onClick={(e) => { e.preventDefault(); setDeleteId(elem?._id); setConfirmationPopup(true) }}>
                                                            <svg fill="red" height={16} width={16} style={{ marginLeft: '10px' }} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4C156.6 0 141 8.827 132.4 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16C0 120.9 7.125 128 16 128H32v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16C440.9 128 448 120.9 448 112V96C448 87.13 440.9 80 432 80zM171.9 50.88C172.9 49.13 174.9 48 177 48h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4L171.9 50.88zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320C368 456.8 360.8 464 352 464zM224 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S208 183.2 208 192v208C208 408.8 215.2 416 224 416zM144 416C152.8 416 160 408.8 160 400V192c0-8.844-7.156-16-16-16S128 183.2 128 192v208C128 408.8 135.2 416 144 416zM304 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S288 183.2 288 192v208C288 408.8 295.2 416 304 416z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table> :
                        <p style={{ padding: '20px', width: '100%', border: '1px solid lightgray', marginTop: '20px', borderRadius: '4px', textAlign: 'center' }}>No Data Found</p>

                }
                {storeTodo?.records?.length > 0 ? (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <div className='hidden sm:block'>
                            <p className='flex w-full  space-x-4'>
                                <span className='text-sm font-medium'>
                                    {
                                        `${startRecord} - ${endRecord} of ${storeTodo?.totalRecords}`
                                    }
                                </span>
                            </p>
                        </div>
                        <div>
                            {storeTodo && storeTodo?.totalPages !== 1 ? (
                                <Pagination
                                    count={storeTodo?.totalPages}
                                    page={page}
                                    onChange={(e, v) => setPage(v)}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <Dialog
                    open={isAdd}
                    onClose={() => setIsAdd(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{
                        width: '600px',
                        backgroundColor: '#fafafa',
                        height: 'auto',
                        borderRadius: '4px',
                        padding: '20px',
                        border: '1px solid #f5f5f5'
                    }}>
                        <form onSubmit={(e) => { handleAddTodo(e) }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <h2 style={{ margin: 0 }}>Add Todo</h2>
                                <button onClick={(e) => { e.preventDefault(); setIsAdd(false) }} style={{ background: 'transparent', border: 'none', outline: 'none' }}>
                                    <svg
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                                            fill="#000000"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <hr style={{ margin: '20px 0' }} />
                            <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Title</span>
                            <input type='text' style={{
                                padding: '10px 15px',
                                outline: 'none',
                                border: '1px solid gray',
                                width: '100%',
                                borderRadius: '4px',
                                marginBottom: '15px'
                            }} value={title} required placeholder='Enter title' onChange={(e) => setTitle(e.target.value)} />
                            <span style={{ fontSize: '13px', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Description</span>
                            <textarea style={{
                                padding: '10px 15px',
                                outline: 'none',
                                border: '1px solid gray',
                                width: '100%',
                                borderRadius: '4px',
                                marginBottom: '15px',
                                textDecoration: 'none'
                            }} value={description} required placeholder='Enter description' onChange={(e) => setDescription(e.target.value)} />
                            <button style={{
                                width: '25%',
                            }} type='submit' className='btn'>
                                Add Todo
                            </button>
                        </form>
                    </div>
                </Dialog>
                {isEdit ? <Todo editId={editId} isEdit={isEdit} handleClose={handleClose} /> : ''}
            </div>
        </>
    )
}

export default ViewTodo