"use client";

import { ReverseToggle } from "@/components/ControlPanel";
import ErrorPage from "@/components/ErrorPage";
import { useEffect, useState } from "react";
import ScrollMap from "../../components/ScrollMap";

export default function Page({ params }: any) {
  const [track, setTrack] = useState();
  const [error, setError] = useState(false);
  const [info, setInfo] = useState({ reverseAble: false });
  const [toggleReverse, setToggleReverse] = useState(false);
  const { walk } = params;

  const fetchWalk = async () => {
    const response = await fetch(`/api/walks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walk: walk,
        reverse: toggleReverse,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const { track, info } = data;
      setTrack(track);
      setInfo(info);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    fetchWalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleReverse]);

  if (!track) {
    return <p>Loading...</p>;
  }

  if (!track || error) {
    return <ErrorPage />;
  }

  return (
    <>
      <ScrollMap route={track} info={info} />
      {info.reverseAble && (
        <ReverseToggle
          toggleReverse={toggleReverse}
          setToggleReverse={setToggleReverse}
        />
      )}
    </>
  );
}
