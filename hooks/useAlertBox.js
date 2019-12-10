import { useState, useEffect, useCallback } from "react";
import ReactDOM from 'react-dom';
import useHeightToTop from "./useHeightToTop";


const types = ["success", "info", "warn", "error"];

const def = {
  color: '#004085',
  backgroundColor: '#cce5ff',
  borderColor: '#b8daff'
}

const success = {
  color: '#155724',
  backgroundColor: '#d4edda',
  borderColor: '#c3e6cb'
}

const info = {
  color: '#0c5460',
  backgroundColor: '#d1ecf1',
  borderColor: '#bee5eb'
}

const warn = {
  color: '#856404',
  backgroundColor: '#fff3cd',
  borderColor: '#ffeeba'
}

const error = {
  color: '#721c24',
  backgroundColor: '#f8d7da',
  borderColor: '#f5c6cb'
}

const alertBoxDisplay = (height, typed = def) => {
  return {
    position: 'absolute',
    top: height + 50,
    right: '50px',
    width: '300px',
    minHeight: '70px',
    padding: '30px 12px 12px 12px',
    borderRadius: '12px',
    zIndex: '999',
    ...typed
  }
}

const alertBoxCloseButton = {
  position: "absolute",
  width: "30px",
  height: "30px",
  top: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    transform: 'scale(1.3, 1.3)'
  }
}

const alertBoxMessage = {
  marginLeft: '24px'
}


const useAlertBox = (type, timeout = 2000) => {
  const [show, setShow] = useState(null);
  const height = useHeightToTop();

  // types.indexOf(type) > -1 ? type


  const showAlert = useCallback(
    (_message) => {
      setShow(true);
      let alertStyle = alertBoxDisplay(height);
      let alert = alertBox(_message, alertStyle);
      ReactDOM.render(alert, document.getElementById('alertBox'));
    }, [height])

  const close = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('alertBox'));
    setShow(false);
  }

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        close();
      }, timeout);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [show])

  const alertBox = (message, alertStyle) => (
    <div style={alertStyle}>
      <div style={alertBoxCloseButton} onClick={close} > x </div>
      <div style={alertBoxMessage}>{message}</div>
    </div>
  )


  return { showAlert };
};

export default useAlertBox;
