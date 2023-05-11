import React from "react";

function head({ params }: { params: { postUrl: string } }) {
  return (
    <>
      <title>{params.postUrl}</title>
    </>
  );
}

export default head;
