import React, { FC, useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { ProfileService } from "../../services/profile";
import { message } from "antd";
import { getViewList, ProfileViewListItem } from "./utils";

const Profile: FC<
  RouteComponentProps & {
    id?: string;
  }
> = (props) => {
  const profileId = props.id;

  const [viewList, setViewList] = useState<ProfileViewListItem[]>([]);

  const refreshProfile = useCallback(async () => {
    if (!profileId) {
      message.warn("未找到信息");
      return;
    }
    try {
      const profile = await ProfileService.query(profileId);

      setViewList(getViewList(profile));
      console.log("res profile", profile);
    } catch (e) {
      console.log("err", e);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <div>
      <p>Profile: {profileId}</p>
      {viewList.map((v) => (
        <p key={v.label}>
          {v.label}: {v.value}
        </p>
      ))}
    </div>
  );
};

export default Profile;
