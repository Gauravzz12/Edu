import React from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect = ({ message }) => {
  const confettiPopupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    
  };

  const messageStyle = {
    color: 'GoldenRod',
    fontSize: '50px',
    textAlign: 'center',
    marginTop: '20px',
  };

  return (
    <div style={confettiPopupStyle}>
      <Confetti/>
      <h1 className="message" style={messageStyle}>{message}</h1>
    </div>
  );
};

export default ConfettiEffect;
