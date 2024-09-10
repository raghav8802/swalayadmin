'use client';
import React, { useState, useEffect } from "react";
import Style from "../app/styles/Notification.module.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { apiGet } from "@/helpers/axiosRequest";

// Define the props type
interface NotificationSectionProps {
  labelId: string;
}

// Define a type for notification data
interface Notification {
  category: string | null;
  message: string;
  time: string;
  toAll: string | null;
  _id: string;
}

// Map categories to icons
const categoryIcons: { [key: string]: string } = {
  Announcement: "📢",
  Promotions: "🎉",
  Updates: "🔔",
};

// Fallback icon for unknown or blank categories
const fallbackIcon = "🎸"; 

export const NotificationSection: React.FC<NotificationSectionProps> = ({ labelId }) => {
  const [notificationData, setNotificationData] = useState<Notification[]>([]);

  // Fetch notifications when the component mounts or when labelId changes
  useEffect(() => {
    const fetchNotifications = async (labelID: string) => {
      try {
        const response = await apiGet(`/api/notification/getall?labelId=${labelID}`);
        console.log("btf response.data");
        console.log(response.data);
        setNotificationData(response.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    if (labelId) {
      fetchNotifications(labelId);
    }
  }, [labelId]);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="h-[56vh] overflow-y-auto">
        <div className="grid gap-2">
          {notificationData.map((notification) => {
            // Determine the icon based on the category
            const icon = categoryIcons[notification.category || ''] || fallbackIcon;

            return (
              <div key={notification._id} className="flex items-start gap-2">
                <div className="rounded-full bg-[#55efc4] p-2 w-10 h-10 flex items-center justify-center text-xl">
                  {icon}
                </div>
                <div>
                  <div className="font-medium" dangerouslySetInnerHTML={{ __html: notification.message }} />
                  <div className="text-xs text-muted-foreground">
                    {formatDate(notification.time)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
