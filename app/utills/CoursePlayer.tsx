"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl?: string;
  title?: string;
};

const CoursePlayer = ({ videoUrl, title }: Props) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });

  const isYouTube =
    videoUrl &&
    (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  let youtubeId = "";

  if (isYouTube) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  useEffect(() => {
    if (videoUrl && !isYouTube && !videoUrl.startsWith("http")) {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";
      const endpoint = serverUrl.endsWith("/")
        ? `${serverUrl}getVdoCipherOPT`
        : `${serverUrl}/getVdoCipherOPT`;

      axios
        .post(endpoint, {
          videoId: videoUrl,
        })
        .then(({ data }) => {
          setVideoData(data);
        })
        .catch((error) => {
          console.error("VdoCipher OTP fetch error:", error);
        });
    }
  }, [videoUrl, isYouTube]);

  return (
    <div style={{ paddingTop: "41%", position: "relative" }}>
      {isYouTube && youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      ) : videoData.otp && videoData.playbackInfo !== "" ? (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player_id=rUcEsueLsMDGKrJs`}
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      ) : null}
    </div>
  );
};

export default CoursePlayer;
