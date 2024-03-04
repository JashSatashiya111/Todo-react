import React, { useEffect, useState } from 'react'
import api from './API'
import { Dialog } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { checkToken } from './App'

const Todo = ({ editId, isEdit, handleClose }) => {
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    //update todo
    const handleEditTodo = async (e) => {
        e.preventDefault();
        const body = {
            title: title,
            description: description
        }
        try {
            await api.put(`/todo/update_todo/${editId}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            handleClose('call Get api')
        } catch (error) {
            if (error?.response?.status === 403) {
                navigate('/')
            } else if (error?.response?.status === 401) {
                checkToken()
            }
            console.log(error);
        }
    }

    //get perticuler todo
    const handleGetTodo = async () => {
        try {
            const apicall = await api.get(`/todo/get_todo/${editId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setDescription(apicall?.data?.data?.description)
            setTitle(apicall?.data?.data?.title)
        } catch (error) {
            if (error?.response?.status === 403) {
                navigate('/')
            } else if (error?.response?.status === 401) {
                checkToken()
            }
        }
    }

    //call get todo
    useEffect(() => {
        handleGetTodo();
    }, [])
    return (
        <Dialog
            open={isEdit}
            onClose={() => handleClose()}
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
                <form onSubmit={(e) => { handleEditTodo(e) }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <h2 style={{ margin: 0 }}>Update Todo</h2>
                        <button onClick={(e) => { e.preventDefault(); handleClose() }} style={{ background: 'transparent', border: 'none', outline: 'none' }}>
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
                        marginBottom: '15px'
                    }} value={description} required placeholder='Enter description' onChange={(e) => setDescription(e.target.value)} />
                    <button style={{
                        width: '25%',
                    }} type='submit' className='btn'>
                        Update Todo
                    </button>
                </form>
            </div>
        </Dialog>
    )
}

export default Todo