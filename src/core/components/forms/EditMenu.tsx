import React, { Fragment } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton, Menu, MenuItem } from "@material-ui/core";

interface EditMenuProps {
  onDelete(): void;
  onEdit(): void;
}

export default function EditMenu({ onDelete, onEdit }: EditMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleEdit() {
    onEdit();
    handleClose();
  }

  function handleDelete() {
    onDelete();
    handleClose();
  }

  return (
    <Fragment>
      <IconButton
        color="inherit"
        aria-label="more"
        component="span"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Fragment>
  );
}
