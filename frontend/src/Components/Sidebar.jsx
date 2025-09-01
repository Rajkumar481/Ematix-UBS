"use client";

import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import {
  PointOfSale,
  FormatListBulleted,
  Inventory,
  ManageAccounts,
  ShoppingCart,
  Person,
  Group,
  TrendingUp,
} from "@mui/icons-material";
import { orange } from "@mui/material/colors";

// Floating animation
const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

// Glow pulse animation
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px currentColor; }
  50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
`;

const Sidebar = ({ setActiveComponent }) => {
  const [activeItem, setActiveItem] = useState("");
  const theme = useTheme();

  const buttons = [
    { label: "Sales Form", value: "sales", icon: <PointOfSale /> },
    { label: "Sales List", value: "sales-list", icon: <FormatListBulleted /> },
    { label: "Stock Overview", value: "stock", icon: <Inventory /> },
    {
      label: "Stock Management",
      value: "stack-management",
      icon: <ManageAccounts />,
    },
    { label: "Product Details", value: "product", icon: <ShoppingCart /> },
    { label: "User Details", value: "user", icon: <Person /> },
    { label: "Buyer Details", value: "buyer", icon: <Group /> },
    { label: "Profit", value: "profit", icon: <TrendingUp /> },
  ];

  const handleItemClick = (value) => {
    setActiveItem(value);
    setActiveComponent(value);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: 280,
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(to bottom right, #f472b6, #f43f5e, #f87171)",
        // background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        // backgroundImage: `linear-gradient(to right top, #d82c57, #ca295f, #bb2a66, #aa2c6a, #992e6d, #7f3575, #633b77, #483d73, #1e3e66, #073950, #143138, #1f2727)`,
        // background: "orange",
        color: "white",
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor:
                i % 2 === 0
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
              borderRadius: "50%",
              animation: `${floatingAnimation} ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
              "&::before": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "inherit",
                borderRadius: "50%",
                animation: `${pulseGlow} 2s ease-in-out infinite`,
              },
            }}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(${theme.palette.primary.main}20 1px, transparent 1px),
              linear-gradient(90deg, ${theme.palette.primary.main}20 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            opacity: 0.1,
          }}
        />
      </Box>

      {/* Header */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          background: alpha(theme.palette.common.black, 0.1),
          zIndex: 1,
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "bold",
            letterSpacing: 2,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            background: "linear-gradient(45deg, #fff 30%, rgb(0, 255, 30) 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          UBS
        </Typography>
        <Typography
          variant="caption"
          sx={{ opacity: 0.8, display: "block", mt: 0.5, letterSpacing: 1 }}
        >
          Business Suite
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ p: 2, flex: 1, zIndex: 1, position: "relative" }}>
        {buttons.map(({ label, value, icon }) => (
          <ListItem key={value} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleItemClick(value)}
              sx={{
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  background: alpha(theme.palette.common.white, 0.15),
                  transform: "translateX(8px)",
                  "&::before": {
                    width: "100%",
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: activeItem === value ? "100%" : "0%",
                  background: alpha(theme.palette.common.white, 0.1),
                  transition: "width 0.3s ease",
                  zIndex: 0,
                },
                ...(activeItem === value && {
                  background: alpha(theme.palette.common.white, 0.2),
                  transform: "translateX(8px)",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 4,
                    height: "60%",
                    background: theme.palette.secondary.main,
                    borderRadius: "2px 0 0 2px",
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.2s ease",
                  ...(activeItem === value && {
                    transform: "scale(1.1)",
                  }),
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  "& .MuiListItemText-primary": {
                    fontWeight: activeItem === value ? 600 : 400,
                    fontSize: "0.95rem",
                    transition: "font-weight 0.2s ease",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          background: alpha(theme.palette.common.black, 0.1),
          zIndex: 1,
          position: "relative",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            opacity: 0.6,
            textAlign: "center",
            display: "block",
          }}
        >
          © 2024 UBS System
        </Typography>
      </Box>
    </Paper>
  );
};

export default Sidebar;
