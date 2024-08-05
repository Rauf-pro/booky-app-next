"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {FaStar} from "react-icons/fa";

const RoomList = ({ rooms }: { rooms: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.data.map((room: any) => {
        const imgUrl = `http://127.0.0.1:1337${room.attributes.image.data?.attributes.url}`;
        return (
          <div key={room.id}>
            <Link href={`/room/${room.id}`}>
              <div className="relative w-full h-[300px] overflow-hidden mb-6">
                <Image
                  src={imgUrl}
                  fill
                  priority
                  alt=""
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="h-[130px] bg-pink-200">
              <div className="flex items-center justify-between mb-6">
                <div>Capacity - {room.attributes.capacity} person</div>
                <div>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
