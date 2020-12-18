import React from 'react';

const LogoutButton = ({handleLogout}) => {

  return (
    <>
    <label onClick={(e) => {
                
      handleLogout();
      e.stopPropagation();
  }
} className='logout-button'>
</label>
    </>
  );
};

export default LogoutButton;
