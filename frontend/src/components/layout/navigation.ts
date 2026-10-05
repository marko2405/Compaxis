import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export type NavigationItem = {
  href: string;
  icon: SvgIconComponent;
  label: string;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", icon: HomeOutlinedIcon, label: "Overview" },
  { href: "/players", icon: PersonSearchOutlinedIcon, label: "Players" },
  { href: "/teams", icon: GroupsOutlinedIcon, label: "Teams" },
  { href: "/standings", icon: LeaderboardOutlinedIcon, label: "Standings" },
];

export const scoutNavigation: NavigationItem = {
  href: "/scout",
  icon: AutoAwesomeOutlinedIcon,
  label: "AI Scout",
};

const routeTitles = [...primaryNavigation, scoutNavigation];

export function getPageTitle(pathname: string): string {
  if (pathname === "/dev/theme") {
    return "Theme Preview";
  }

  return (
    routeTitles.find(({ href }) => isActiveRoute(pathname, href))?.label ??
    "Compaxis"
  );
}

export function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}
