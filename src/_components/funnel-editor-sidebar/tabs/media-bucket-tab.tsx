// "use client";
import MediaComponent from "../../../components/media";
// import { getMedia } from "@/lib/queries";
// import { GetMediaFiles } from "@/lib/types";
import React, { useEffect, useState } from "react";

type Props = {
  subaccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<any>(null);

  // useEffect(() => {
  //   // const fetchData = async () => {
  //   //   const response = await getMedia(props.subaccountId);
  //   //   setdata(response);
  //   // };
  //   fetchData();
  // }, [props.subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <></>
    </div>
  );
};

export default MediaBucketTab;
