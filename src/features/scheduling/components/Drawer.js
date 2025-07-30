import React from 'react';

const Drawer = ({ children, closeDrawer }) => {
  return (
    <div className="drawer">
      <div className="drawer-content">
        <span className="close" onClick={closeDrawer}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
