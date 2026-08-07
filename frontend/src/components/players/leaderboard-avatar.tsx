"use client";

import Avatar from "@mui/material/Avatar";
import type { AvatarProps } from "@mui/material/Avatar";
import { useState } from "react";

type LeaderboardAvatarProps = {
  alt: string;
  fallback: React.ReactNode;
  size: number;
  src: string | null;
  variant?: AvatarProps["variant"];
};

export function LeaderboardAvatar({
  alt,
  fallback,
  size,
  src,
  variant = "circular",
}: LeaderboardAvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Avatar
      alt={alt}
      slotProps={{
        img: {
          decoding: "async",
          height: size,
          loading: "lazy",
          onError: () => setFailed(true),
          width: size,
        },
      }}
      src={!failed && src ? src : undefined}
      sx={{
        bgcolor: "action.hover",
        color: "text.secondary",
        flexShrink: 0,
        height: size,
        width: size,
        "& .MuiAvatar-img": {
          objectFit: variant === "rounded" ? "contain" : "cover",
        },
      }}
      variant={variant}
    >
      {fallback}
    </Avatar>
  );
}
