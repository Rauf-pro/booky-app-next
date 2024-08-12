"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { format, isPast } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import AlertMessage from "./AlertMessage";
import { useRouter } from "next/navigation";

const postData = async (url: string, data: any) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

const Reservation = ({
  reservations,
  room,
  isUserAuthenticated,
  userData,
}: {
  reservations: any;
  room: any;
  isUserAuthenticated: boolean;
  userData: any;
}) => {
  const [checkInDate, setCheckinDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success" | null;
  } | null>(null);

  const router = useRouter();

  const formatDateForStrapi = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
     return setAlertMessage(null);
    }, 3000);
    // clear timer
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const saveReservation = () => {
    if (!checkInDate || !checkOutDate) {
     return setAlertMessage({
        message: "Please select check in and check out dates",
        type: "error",
      });
    }
    if (checkInDate.getTime() === checkOutDate.getTime()) {
      return setAlertMessage({
        message: "Check in and check out dates cannot be the same",
        type: "error",
      });
    }

    // check if the room is already booked
    const isReserved = reservations.data
      .filter(
        (item: any) => item.attributes.room.data.id === room.data.id // filter reservations for the current room
      )
      .some((item: any) => {
        // check if any reservation overlops with the selected dates
        const existingCheckIn = new Date(item.attributes.checkIn).setHours(
          0,
          0,
          0,
          0
        ); // convert existing check-in date to midnight
        const existingCheckOut = new Date(item.attributes.checkOut).setHours(
          0,
          0,
          0,
          0
        );

        // convert selected check-in and check-out dates to midnight
        const checkInTime = checkInDate.setHours(0, 0, 0, 0);
        const checkOutTime = checkOutDate.setHours(0, 0, 0, 0);

        // check if the rooms are already booked
        const isReservedBetweenDates =
          (checkInTime >= existingCheckIn && checkInTime < existingCheckOut) ||
          (checkOutTime > existingCheckIn &&
            checkOutTime <= existingCheckOut) ||
          (existingCheckIn >= checkInTime && existingCheckIn < checkOutTime) ||
          (existingCheckOut > checkInTime && existingCheckOut <= checkOutTime);

        return isReservedBetweenDates;
      });

    if (isReserved) {
      setAlertMessage({
        message:
          "Room is already booked for the selected dates. Please select different dates",
        type: "error",
      });
    } else {
      // real data
      const data = {
        data: {
          firstname: userData.given_name,
          lastname: userData.family_name,
          email: userData.email,
          checkIn: checkInDate ? formatDateForStrapi(checkInDate) : null, // format check in date for strapi
          checkOut: checkOutDate ? formatDateForStrapi(checkOutDate) : null, // format check out date for strapi
          room: room.data.id,
        },
      };
      // post data to the server
      postData("http://127.0.0.1:1337/api/reservations", data);

      setAlertMessage({
        message: "Room booked successfully",
        type: "success",
      });
      // refresh the page
      router.refresh()
    }
  };

  return (
    <div>
      <div className="bg-tertiary h-[320px] mb-4">
        {/* top */}
        <div className="bg-accent py-4 text-center relative mb-2">
          <h4 className="text-xl text-white">Book your room</h4>
          {/* triangle */}
          <div
            className="absolute -bottom-[8px] left-[calc(50%-10px)] w-0 h-0 
          border-l-[10px] border-l-transparent border-t-[8px] border-t-accent 
          border-r-[10px] border-r-transparent"
          ></div>
        </div>
        <div className="flex flex-col gap-4 w-full py-6 px-8">
          {/* check in  */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"default"}
                size={"md"}
                className={cn(
                  "w-full flex justify-start text-left font-semibold",
                  !checkInDate && "text-secondary"
                )}
              >
                {checkInDate ? (
                  format(checkInDate, "PPP")
                ) : (
                  <span>Check in</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckinDate}
                initialFocus
                disabled={isPast}
              />
            </PopoverContent>
          </Popover>

          {/* check out  */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"default"}
                size={"md"}
                className={cn(
                  "w-full flex justify-start text-left font-semibold",
                  !checkOutDate && "text-secondary"
                )}
              >
                {checkOutDate ? (
                  format(checkOutDate, "PPP")
                ) : (
                  <span>Check out</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                initialFocus
                disabled={isPast}
              />
            </PopoverContent>
          </Popover>

          {/* conditional rendering of the booking button based on an user
            authentication status if the user is authenticated, display a "Book now"
            button with an onClick event handler to save the booking.
            If the user is not authenticated, display a "Sign in to book" button.
             */}
          {isUserAuthenticated ? (
            <Button onClick={() => saveReservation()} size={"md"}>
              Book now
            </Button>
          ) : (
            <LoginLink>
              <Button className="w-full" size={"md"}>
                Book now
              </Button>
            </LoginLink>
          )}
        </div>
      </div>
      {alertMessage && (
        <AlertMessage message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
};

export default Reservation;
