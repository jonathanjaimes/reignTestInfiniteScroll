import React from "react";

const ItemSelect = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={props.imagePath} />
      <p style={{ margin: "0 0 0 20px" }}>{props.tech}</p>
    </div>
  );
};

export default ItemSelect;
