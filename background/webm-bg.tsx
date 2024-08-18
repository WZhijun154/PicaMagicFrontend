export function Video() {
  return (
    <video
      width="100%"
      height="100%"
      autoPlay
      muted
      // controls
      loop
      preload="auto"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        objectFit: "cover",
        zIndex: 0,
      }}
    >
      <source src="/video_2024-08-18_09_48_46.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}
