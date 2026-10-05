"use client";

import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSeason } from "./season-context";

import {
  isActiveRoute,
  primaryNavigation,
  scoutNavigation,
  type NavigationItem,
} from "./navigation";

export const sidebarWidth = 256;

type SidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { withSeason } = useSeason();
  const content = (
    <Stack sx={{ height: "100%", p: 2 }}>
      <Stack
        direction="row"
        spacing={1.25}
        sx={{ alignItems: "center", minHeight: 48, px: 1 }}
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "primary.main",
            borderRadius: 2.5,
            color: "primary.contrastText",
            display: "flex",
            height: 36,
            justifyContent: "center",
            width: 36,
          }}
        >
          <SportsBasketballOutlinedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 750, letterSpacing: "-0.025em" }}>
            EuroScoutAI
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Scouting intelligence
          </Typography>
        </Box>
      </Stack>

      <List aria-label="Primary navigation" sx={{ mt: 3 }}>
        {primaryNavigation.map((item) => (
          <NavigationLink
            item={item}
            key={item.href}
            onNavigate={onMobileClose}
            pathname={pathname}
            seasonHref={withSeason(item.href)}
          />
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <List aria-label="AI tools">
        <NavigationLink
          emphasized
          item={scoutNavigation}
          onNavigate={onMobileClose}
          pathname={pathname}
          seasonHref={withSeason(scoutNavigation.href)}
        />
      </List>
    </Stack>
  );

  const drawerStyles = {
    "& .MuiDrawer-paper": {
      borderBottom: 0,
      borderLeft: 0,
      borderTop: 0,
      boxSizing: "border-box",
      width: sidebarWidth,
    },
  };

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { md: sidebarWidth } }}>
      <Drawer
        onClose={onMobileClose}
        open={mobileOpen}
        sx={{ ...drawerStyles, display: { xs: "block", md: "none" } }}
        variant="temporary"
      >
        {content}
      </Drawer>
      <Drawer
        open
        sx={{ ...drawerStyles, display: { xs: "none", md: "block" } }}
        variant="permanent"
      >
        {content}
      </Drawer>
    </Box>
  );
}

type NavigationLinkProps = {
  emphasized?: boolean;
  item: NavigationItem;
  onNavigate: () => void;
  pathname: string;
  seasonHref: string;
};

function NavigationLink({
  emphasized = false,
  item,
  onNavigate,
  pathname,
  seasonHref,
}: NavigationLinkProps) {
  const active = isActiveRoute(pathname, item.href);
  const Icon = item.icon;

  return (
    <ListItemButton
      aria-current={active ? "page" : undefined}
      component={Link}
      href={seasonHref}
      onClick={onNavigate}
      selected={active}
      sx={{
        bgcolor: emphasized && !active ? "action.hover" : undefined,
        border: "1px solid",
        borderColor: emphasized ? "divider" : "transparent",
        borderRadius: 2.5,
        color: active ? "primary.main" : "text.secondary",
        mb: 0.5,
        minHeight: 44,
        px: 1.5,
        "&.Mui-selected": {
          bgcolor: "selectedRow",
          color: "primary.main",
        },
        "&.Mui-selected:hover": { bgcolor: "selectedRow" },
      }}
    >
      <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{ primary: { sx: { fontWeight: emphasized ? 700 : 600 } } }}
      />
    </ListItemButton>
  );
}
