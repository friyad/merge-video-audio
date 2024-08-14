"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const MergeVideo = () => {
  const [message, setMessage] = useState(null);
  const [isSuccess, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  const handleMerge = async (values) => {
    values.preventDefault();
    const form = document.getElementById("urls-form");
    const formData = new FormData(form);
    const videoUrl = formData.get("videoUrl");
    const audioUrl = formData.get("audioUrl");

    if (videoUrl.length < 2 || audioUrl.length < 2) {
      toast({
        description: "Please provide correct url",
        variant: "destructive",
      });
      return;
    }

    setSuccess(false);
    const ffmpeg = ffmpegRef.current;
    setMessage("Downloading video & audio...");
    await ffmpeg.writeFile("video.mp4", await fetchFile(videoUrl));
    await ffmpeg.writeFile("audio.mp4", await fetchFile(audioUrl));
    setMessage("Merging video with audio...");
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
    setMessage("Merging completed!");
    setSuccess(true);
    setMessage(null);

    setTimeout(() => {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      form.reset();
    }, 200);
  };

  useEffect(() => {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("log", ({ message }) => {
        // messageRef.current.innerHTML = message;
        console.log(message);
      });
      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl f">Loading...</h2>
        </div>
      ) : (
        <div className="max-w-xl mx-auto mt-14">
          <form onSubmit={handleMerge} id="urls-form">
            <Input name="videoUrl" placeholder="Video Url" />
            <Input name="audioUrl" placeholder="Audio Url" className="mt-3" />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full mt-4"
            >
              {message ? message : "Button"}
            </Button>
          </form>

          {isSuccess && (
            <div className="mt-6 rounded-md overflow-hidden">
              <video
                ref={videoRef}
                controls
                className="aspect-video w-full"
              ></video>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MergeVideo;
