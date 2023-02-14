import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Alert,
  AppBar,
  Link,
  Snackbar,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import Notifications from "./NotificationDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationDrawer from "./NotificationDrawer";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { logout, reset,  selectCurrentToken } from "../features/auth/authSlice";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const DashHeader = ({ handleSidebarToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  const { isLoading, isError, isSuccess, message } =
    useSelector(selectCurrentToken);

  

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //for adding border bottom on scroll
  const matches = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  /**------------------------------
   * ACCOUNT MENU/DROPDOWN
   -------------------------------------*/
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**------------------------------
   * NOTIFICATIONS
   -------------------------------------*/
  //toggle //notifications//drawer//
  const handleDrawerToggle = () => {
    setNotificationOpen((prev) => !prev);
  };
  //toggle props sent to notification component
  const drawerProps = {
    open: notificationOpen,
    handleToggle: handleDrawerToggle,
  };

 

  const handleLogout =  () => {
    dispatch(logout());
  };

 


  if(isSuccess) navigate("/");

useEffect(() => {
 
   return () => {
     dispatch(reset());
   };
 }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError || isSuccess || isLoading}
        autoHideDuration={6000}
        onClose={() => dispatch(reset())}
      >
        <Alert
          variant="filled"
          severity="error"
          onClose={() => dispatch(reset())}
        >
          {isLoading && "Loading..."}
          {message}
        </Alert>
      </Snackbar>

      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          px: 3,
        }}
        elevation={matches && 1}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ color: "dark.main", mr: "auto", display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />
          <IconButton
            sx={{ mr: 3 }}
            underline="none"
            onClick={handleDrawerToggle}
          >
            <Badge color="secondary" badgeContent={1000} max={999}>
              <MailOutlinedIcon
                sx={{ color: "dark.main", width: 25, height: 25 }}
              />
            </Badge>
          </IconButton>
          <IconButton
            sx={{ mr: 3 }}
            underline="none"
            onClick={handleDrawerToggle}
          >
            <Badge color="secondary" badgeContent={1000} max={999}>
              <NotificationsNoneIcon
                sx={{ color: "dark.main", width: 25, height: 25 }}
              />
            </Badge>
          </IconButton>
          <NotificationDrawer {...drawerProps} />

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ width: 30, height: 30, bgcolor: "dark.main" }}
              ></Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar>
            <ManageAccountsIcon />{" "}
          </Avatar>{" "}
          Subscriptions
        </MenuItem>
        <MenuItem>
          <Avatar /> Manage funds
        </MenuItem>
        <Divider />

        <MenuItem onClick={() => navigate("/account/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Setting
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default DashHeader;
