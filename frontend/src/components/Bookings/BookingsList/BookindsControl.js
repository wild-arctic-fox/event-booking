import React from "react";

const bookingControl = (props) => {
  return (
    <div className="wrap">
      <button className="btn" onClick={props.onClickType.bind(this, "list")}>
        List
      </button>
      <button className="btn" onClick={props.onClickType.bind(this, "chart")}>
        Chart
      </button>
    </div>
  );
};

export default bookingControl;
