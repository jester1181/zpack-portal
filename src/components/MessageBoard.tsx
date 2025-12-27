"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api-client";

type Announcement = {
  id: number;
  content: string; // Stored as HTML
  created_at: string;
};

const MessageBoard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/api/announcements");
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        console.error("Failed to load announcements", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="text-lightGray space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <p>No recent announcements.</p>
      ) : (
        announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-darkGray p-3 rounded"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        ))
      )}
    </div>
  );
};

export default MessageBoard;
