import React from 'react'

const Toast = ({msg, handleShow, bgColor}) => {
    return (
        <div className={`toast show position-fixed text-light ${bgColor}`}
        style={{
            top: '20px', 
            right: '20px', 
            minWidth: '300px', 
            zIndex: 9999,
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            border: 'none',
            overflow: 'hidden'
        }}>
            <div className={`toast-header text-light ${bgColor} d-flex justify-content-between align-items-center`}
                 style={{borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px'}}>
                <strong className="flex-grow-1" style={{fontSize: '16px', fontWeight: '600'}}>
                    {msg.title}
                </strong>
                <button 
                    className="close text-light"
                    data-dismiss="toast" 
                    style={{
                        outline: 'none',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '24px',
                        fontWeight: '300',
                        lineHeight: '1',
                        padding: '0',
                        margin: '0',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'scale(1)';
                    }}
                    onClick={handleShow}
                >
                    &times;
                </button>
            </div>
            <div className="toast-body" style={{padding: '16px', fontSize: '14px', lineHeight: '1.5'}}>
                {msg.body}
            </div>
        </div>
    )
}

export default Toast