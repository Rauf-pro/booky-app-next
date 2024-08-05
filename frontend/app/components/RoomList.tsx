"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const RoomList = ({ rooms }: { rooms: any }) => {
  return (
    <div>
      {rooms.data.map((room: any) => {
        return <div key={room.id}>room</div>;
      })}
    </div>
  );
};

export default RoomList;
