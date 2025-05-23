import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ListAlt as ListIcon,
  CloudUpload as UploadIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

// Navigation items based on user role
const getNavItems = (hasRole) => {
  const items = [{ text: "Home", icon: <HomeIcon />, path: "/" }];

  // Only show curriculum list if authenticated
  if (hasRole(["admin", "teacher", "student"])) {
    items.push({
      text: "Curriculums",
      icon: <ListIcon />,
      path: "/curriculums",
    });
  }

  // Only show upload for teachers and admins
  if (hasRole(["admin", "teacher"])) {
    items.push({ text: "Upload", icon: <UploadIcon />, path: "/upload" });
  }

  // Only show user management for admins
  if (hasRole(["admin"])) {
    items.push({
      text: "User Management",
      icon: <PeopleIcon />,
      path: "/admin/users",
    });
  }

  return items;
};

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const navItems = getNavItems(hasRole);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          CurriculumnBank
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CurriculumnBank
          </Typography>
          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit" component={RouterLink} to="/profile">
                <PersonIcon />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{ p: 2, mt: "auto", backgroundColor: "background.paper" }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          CurriculumnBank © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout;
