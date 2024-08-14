"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function MergeVideo() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const messageRef = useRef(null);

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const videoUrl =
      "https://video.xx.fbcdn.net/v/t39.25447-2/454829554_1243044910384882_990000744712823401_n.mp4?_nc_cat=110&ccb=1-7&_nc_sid=9a5d50&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfcjJldmV2cDktcjFnZW4ydnA5X3E5MCIsInZpZGVvX2lkIjo3NzE4ODAyMTc4MjI5NjkwfQ%3D%3D&_nc_ohc=OHukotW-BVsQ7kNvgH1mSkI&_nc_ht=scontent.fcgp36-1.fna&oh=00_AYCyuWbLhiWwrDM0EVvOdbL4NMmIv18l0o8i3kiE6UTr1w&oe=66C2C80D";
    const audioUrl =
      "https://video.xx.fbcdn.net/v/t39.25447-2/454723110_374052069068953_7717764902501555151_n.mp4?_nc_cat=101&ccb=1-7&_nc_sid=9a5d50&efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfYXVkaW9fYWFjcF82NF9mbm9ybTE0X2ZyYWdfMl9hdWRpbyIsInZpZGVvX2lkIjo3NzE4ODAyMTc4MjI5NjkwfQ%3D%3D&_nc_ohc=otMSY_jqXTsQ7kNvgGRxkmH&_nc_ht=scontent.fcgp36-1.fna&oh=00_AYBUFwpyrOemE1Z85sA7AjWklteuiLtiY4349EoZL8veIQ&oe=66C2BDAA";

    await ffmpeg.writeFile("video.mp4", await fetchFile(videoUrl));
    await ffmpeg.writeFile("audio.mp4", await fetchFile(audioUrl));
    await ffmpeg.exec([
      "-i",
      "video.mp4",
      "-i",
      "audio.mp4",
      "-c",
      "copy",
      "output.mp4",
    ]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
  };

  useEffect(() => {
    // const load = async () => {
    //   const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
    //   const ffmpeg = ffmpegRef.current;
    //   ffmpeg.on("log", ({ message }) => {
    //     messageRef.current.innerHTML = message;
    //     console.log(message);
    //   });
    //   // toBlobURL is used to bypass CORS issue, urls with the same
    //   // domain can be used directly.
    //   await ffmpeg.load({
    //     coreURL: await toBlobURL(
    //       `${baseURL}/ffmpeg-core.js`,
    //       "text/javascript"
    //     ),
    //     wasmURL: await toBlobURL(
    //       `${baseURL}/ffmpeg-core.wasm`,
    //       "application/wasm"
    //     ),
    //     workerURL: await toBlobURL(
    //       `${baseURL}/ffmpeg-core.worker.js`,
    //       "text/javascript"
    //     ),
    //   });
    //   setLoaded(true);
    // };
    // load();
  }, []);

  return loaded ? (
    <button>
      <video ref={videoRef} controls></video>
      <br />
      <button onClick={transcode}>Transcode webm to mp4</button>
      <p ref={messageRef}></p>
      <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
    </button>
  ) : (
    <button>Load ffmpeg-core (~31 MB)</button>
  );
}
