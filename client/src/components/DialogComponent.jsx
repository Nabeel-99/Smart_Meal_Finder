import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

const DialogComponent = ({
  showDialog,
  setShowDialog,
  handleYes,
  selectedId,
}) => {
  const handleClose = () => setShowDialog(false);
  return (
    <div>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "#1C1C1E",
            color: "white",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <button
            onClick={() => handleYes(selectedId)}
            className="rounded-md py-2 px-3 bg-[#444444] hover:bg-[#646464] transition-all duration-150"
          >
            Yes
          </button>
          <button
            onClick={handleClose}
            className="rounded-md py-2 px-3 bg-[#444444] hover:bg-[#646464] transition-all duration-150"
          >
            No
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogComponent;