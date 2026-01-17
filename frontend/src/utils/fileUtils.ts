function contentTypeToExt(contentType: string): string {
  const map: Record<string, string> = {
    // Images
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",

    // Documents
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",

    // Text
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "application/json": "json",
    "application/xml": "xml",

    // Audio
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",

    // Video
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/x-msvideo": "avi",
  };

  return map[contentType] ?? "OTHER"; // fallback
}

function removeExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
}

export { contentTypeToExt, removeExtension };
