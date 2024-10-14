import React, { Children, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactPlayer from "react-player";
import { height } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,

  bgcolor: "black",
  border: "2px solid #1f1f1f",
  boxShadow: 24,
  p: 4,
};

const ModalComponent = ({ showVideo, setShowVideo, url }) => {
  const handleClose = () => setShowVideo(false);

  return (
    <div>
      <Modal
        keepMounted
        open={showVideo}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <ReactPlayer url={url} controls width="100%" height="300px" />
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;
