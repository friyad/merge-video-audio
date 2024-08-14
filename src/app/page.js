import dynamic from "next/dynamic";

const MergeVideo = dynamic(() => import("../components/MargeVideo.jsx"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      <MergeVideo />
    </div>
  );
}
