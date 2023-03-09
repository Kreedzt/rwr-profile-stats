import React from "react";
import type { FC } from "react";
import { Link } from "@reach/router";

type ListItemProps = {
  username: string;
  prefix?: React.ReactNode;
  content?: React.ReactNode;
  profile_id: number;
  onClick?: () => void;
};

const ProfileListItem: FC<ListItemProps> = ({
  prefix,
  content,
  username,
  profile_id,
  onClick,
}) => {
  return (
    <div
      className="bg-blue-200 hover:bg-blue-400 cursor-pointer flex border-1 border-yellow-600 justify-between mt-1 mb-1 p-2"
      onClick={onClick}
    >
      <span>
        {prefix && <span className="mr-2">{prefix}</span>}
        <span>用户名: {username}</span>
        <span className="ml-2 mr-2">|</span>
        {content && <span>{content}</span>}
      </span>
      <Link to={`/profile/${profile_id}`}>点击跳转到详情</Link>
    </div>
  );
};

export default ProfileListItem;
