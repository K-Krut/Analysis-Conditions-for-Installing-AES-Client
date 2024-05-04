const Notification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000
        }}>
            {message}
            <button onClick={onClose} style={{ marginLeft: '10px', color: 'white' }}>Close</button>
        </div>
    );
};

export default Notification;