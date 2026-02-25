"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/store/use-notification-store";
import { getNotifications, markAsRead, markAllAsRead } from "@/action/notification";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const NotificationBell = () => {
    const router = useRouter();
    const { notifications, unreadCount, setNotifications, markRead, markAllRead } = useNotificationStore();
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        const result = await getNotifications();
        if (result.data) {
            setNotifications(result.data.map(n => ({
                ...n,
                createdAt: new Date(n.createdAt)
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: string, link?: string | null) => {
        await markAsRead(id);
        markRead(id);
        if (link) {
            router.push(link);
        }
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        markAllRead();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] border-2 border-background animate-in zoom-in duration-300"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-white/10">
                <DropdownMenuLabel className="p-4 flex items-center justify-between">
                    <span className="font-bold text-base">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 h-auto p-1"
                            onClick={handleMarkAllRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start p-4 cursor-pointer transition-colors focus:bg-accent/50",
                                    !notification.isRead && "bg-blue-500/5 border-l-2 border-blue-500"
                                )}
                                onClick={() => handleMarkRead(notification.id, notification.link)}
                            >
                                <div className="flex w-full justify-between items-start gap-2">
                                    <span className={cn(
                                        "font-semibold text-sm line-clamp-1",
                                        !notification.isRead ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {notification.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-1">
                                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-xs line-clamp-2 mt-1",
                                    !notification.isRead ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                        View all activity
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
