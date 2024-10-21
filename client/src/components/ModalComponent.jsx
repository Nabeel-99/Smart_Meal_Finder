import React, { Children, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactPlayer from "react-player";
import { height, width } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    sm: 500,
    md: 720,
    lg: 960,
    xl: 1080,
  },
  bgcolor: "black",
  border: "2px solid #1f1f1f",
  boxShadow: 24,
};

const ModalComponent = ({ showModal, setShowModal, children }) => {
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Modal
        keepMounted
        open={showModal}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;
