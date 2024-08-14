import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Merge Video with Audio Online | Free Video Merger Tool by Friyad",
  description:
    "Easily merge video and audio from URLs online. Combine video and audio into a single file and download the result instantly. No software required. - by Friyad",
  keywords:
    "merge video with audio, online video merger, video audio combiner, free video merger tool, merge video from URL, combine video and audio online",
  author: "https://www.friyad.site",
  robots: "index, follow",
  canonical: "https://yourwebsite.com/merge-video-audio",
  openGraph: {
    title: "Merge Video with Audio Online | Free Video Merger Tool",
    description:
      "Combine video and audio from URLs into a single downloadable file. Use our free online tool for instant results.",
    url: "https://yourwebsite.com/merge-video-audio",
    images: [
      {
        url: "https://i.ibb.co/D8QBqNj/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Merge Video with Audio Online",
      },
    ],
    site_name: "Merge Video with Audio Online",
  },
  twitter: {
    card: "summary_large_image",
    site: "@_friyad",
    title: "Merge Video with Audio Online | Free Video Merger Tool",
    description:
      "Easily combine video and audio from URLs and download the result instantly. No software required.",
    image: "https://i.ibb.co/D8QBqNj/thumbnail.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
