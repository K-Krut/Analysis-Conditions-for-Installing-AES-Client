const Notification = ({message, onClose}) => {
    if (!message) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: '#070707',
            opacity: 1,
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000
        }}>
            <span style={{ marginRight: '10px' }}>⚠️</span>{message}
            <br></br>
            <button onClick={onClose} style={{marginLeft: '10px', color: 'white'}}>Close</button>
        </div>
    );
};

export default Notification;