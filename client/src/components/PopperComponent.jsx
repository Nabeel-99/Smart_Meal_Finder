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
  viewOptions,
  showGridView,
  showListView,
  setViewOptions,
  anchorRef,
}) => {
  const handleClose = () => {
    setViewOptions(false);
  };

  return (
    <Popper
      open={viewOptions}
      anchorEl={anchorRef.current}
      placement="bottom-start"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <MenuList className="absolute right-0 top-10 p-4 bg-[#08090a] border border-[#343333] flex flex-col gap-4 rounded-md">
          <MenuItem
            onClick={showGridView}
            className="flex items-center text-sm gap-4"
          >
            <CiGrid41 />
            Grid view
          </MenuItem>
          <MenuItem
            onClick={showListView}
            className="flex items-center text-sm gap-4"
          >
            <HiBars3 />
            List View
          </MenuItem>
        </MenuList>
      </ClickAwayListener>
    </Popper>
  );
};

export default PopperComponent;
