import React from 'react'
import { Dialog } from '@mui/material'
const ConfirmationPopup = ({ heading, subheading, confirmationPopup, handleCloseConfirm, runFunction }) => {
    return (
        <Dialog
            open={confirmationPopup}
            keepMounted
            onClose={() => handleCloseConfirm(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <div style={{
                width: '100%',
                padding: '20px',
                borderRadius: '4px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <p style={{
                        fontSize: '20px',
                        fontWeight:'500'
                    }} className='text-lg font-medium'>{heading}</p>
                    <div style={{cursor:'pointer'}} onClick={(e) => (e.preventDefault, handleCloseConfirm(false))}>
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
                    </div>
                </div>
                <hr style={{margin:'15px 0'}}></hr>
                <p style={{fontSize:'16px',marginBottom:'15px'}}>{subheading}</p>
                <button style={{marginRight:'10px'}} className='btn' onClick={(e) => { e.preventDefault(); runFunction() }}>{heading === "Change Order Status" || heading === "Change Store Mode" ? 'Yes, change' : 'Yes, delete'}</button>
                <button className='secondary-btn' onClick={(e) => { e.preventDefault(); handleCloseConfirm(false) }}>No, not now</button>
            </div>
        </Dialog>
    )
}

export default ConfirmationPopup