import {
  Popper,
  Button,
  ClickAwayListener,
  MenuItem,
  MenuList,
} from "@mui/material";
import React from "react";
import { CiGrid41 } from "react-icons/ci";
import { HiBars3 } from "react-icons/hi2";

const PopperComponent = ({
  viewPopper,
  setViewPopper,
  anchorRef,
  children,
}) => {
  const handleClose = () => {
    setViewPopper(false);
  };

  return (
    <Popper
      open={viewPopper}
      anchorEl={anchorRef.current}
      placement="bottom-start"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <div> {children}</div>
      </ClickAwayListener>
    </Popper>
  );
};

export default PopperComponent;
