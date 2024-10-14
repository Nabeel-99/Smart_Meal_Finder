import { Snackbar } from "@mui/material";
import React, { useState } from "react";

const AutoHideSnackbar = ({ message, displayMsg, setDisplayMsg }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDisplayMsg(false);
  };

  return (
    <div>
      <Snackbar
        ContentProps={{
          sx: {
            backgroundColor: "white",
            color: "black",
          },
        }}
        open={displayMsg}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
};

export default AutoHideSnackbar;
