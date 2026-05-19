"use client";

import React from "react";
import GoogleCalendarEventList from "@/src/components/google/GoogleCalendarEventList";
import { useParams } from "next/navigation";

const CalendarEventsPage = () => {
  const params = useParams();
  const calendarId = params.calendar_id as string;

  return (
    <div className="sm:p-8 p-4">
      <GoogleCalendarEventList calendarId={calendarId} />
    </div>
  );
};

export default CalendarEventsPage;
