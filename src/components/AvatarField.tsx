import { get } from "lodash";

import { Avatar, AvatarProps } from "@mui/material";
import { useRecordContext } from "react-admin";
import { useState, useEffect } from "react";
import { fetchAuthenticatedMedia } from "../utils/fetchMedia";
import storage from "../storage";

const AvatarField = ({ source, ...rest }: AvatarProps & { source: string, label?: string }) => {
  const { alt, classes, sizes, sx, variant } = rest;

  const record = useRecordContext(rest);
  const mxcURL = get(record, source)?.toString();

  const cacheKey = `thumbnail_${mxcURL}`;
  const cachedAvatar = storage.getItem(cacheKey) || "";
  const [src, setSrc] = useState<string>(cachedAvatar);

  const fetchAvatar = async (mxcURL: string) => {
    const response = await fetchAuthenticatedMedia(mxcURL, "thumbnail");

    const contentType = response.headers.get("Content-Type");
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataURL = `data:${contentType};base64,${base64}`;
    setSrc(dataURL);
    storage.setItem(cacheKey, dataURL);
  };

  useEffect(() => {
    if (mxcURL &&!cachedAvatar) {
      fetchAvatar(mxcURL);
    }

  }, [mxcURL, cachedAvatar]);

  return <Avatar alt={alt} classes={classes} sizes={sizes} src={src} sx={sx} variant={variant} />;
};

export default AvatarField;
