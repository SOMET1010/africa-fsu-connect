import { useState } from "react"
import {
    Bell,
    Check,
    X,
    AlertCircle,
    Info,
    CheckCircle,
    Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
    id: string
    type: "info" | "success" | "warning" | "urgent"
    title: string
    message: string
    timestamp: Date
    read: boolean
    actionUrl?: string
}

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "urgent",
            title: "Deadline Approche",
            message:
                "Date limite pour les soumissions de Projets 2024 dans 3 jours",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            actionUrl: "/submit",
        },
        {
            id: "2",
            type: "info",
            title: "Nouvelle Discussion Forum",
            message: "Dr. Amina Kone a commencé une discussion sur la CMDT-25",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            actionUrl: "/forum",
        },
        {
            id: "3",
            type: "success",
            title: "Document Approuvé",
            message:
                "Votre document 'Cadre Réglementaire FSU' a été approuvé et publié",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            read: true,
            actionUrl: "/resources",
        },
        {
            id: "4",
            type: "info",
            title: "Événement À Venir",
            message: "Webinaire 'Innovations FSU' demain à 14h00",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            actionUrl: "/events",
        },
    ])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "warning":
                return <AlertCircle className="h-4 w-4 text-yellow-600" />
            case "urgent":
                return <AlertCircle className="h-4 w-4 text-red-600" />
            default:
                return <Info className="h-4 w-4 text-blue-600" />
        }
    }

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date()
        const diff = now.getTime() - timestamp.getTime()
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 60) {
            return `Il y a ${minutes} min`
        } else if (hours < 24) {
            return `Il y a ${hours}h`
        } else {
            return `Il y a ${days}j`
        }
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    const unreadCount = notifications.filter(n => !n.read).length
    const unreadNotifications = notifications.filter(n => !n.read)
    const readNotifications = notifications.filter(n => n.read)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs"
                            >
                                Tout marquer comme lu
                            </Button>
                        )}
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all" className="text-xs">
                                Toutes ({notifications.length})
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="text-xs">
                                Non lues ({unreadCount})
                            </TabsTrigger>
                            <TabsTrigger value="read" className="text-xs">
                                Lues ({readNotifications.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ScrollArea className="h-80">
                                <div className="space-y-2">
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">
                                                Aucune notification
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <Card
                                                key={notification.id}
                                                className={`cursor-pointer transition-colors ${
                                                    !notification.read
                                                        ? "bg-primary/5 border-primary/20"
                                                        : ""
                                                }`}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            {getNotificationIcon(
                                                                notification.type
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <h4
                                                                    className={`text-sm font-medium ${
                                                                        !notification.read
                                                                            ? "text-foreground"
                                                                            : "text-muted-foreground"
                                                                    }`}
                                                                >
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </h4>
                                                                <div className="flex items-center gap-1">
                                                                    {!notification.read && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 w-6 p-0"
                                                                            onClick={() =>
                                                                                markAsRead(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Check className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() =>
                                                                            deleteNotification(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatTimestamp(
                                                                        notification.timestamp
                                                                    )}
                                                                </span>
                                                                {notification.actionUrl && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-xs h-6"
                                                                    >
                                                                        Voir
                                                                        détails
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="unread">
                            <ScrollArea className="h-80">
                                <div className="space-y-2">
                                    {unreadNotifications.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">
                                                Aucune notification non lue
                                            </p>
                                        </div>
                                    ) : (
                                        unreadNotifications.map(
                                            notification => (
                                                <Card
                                                    key={notification.id}
                                                    className="bg-primary/5 border-primary/20"
                                                >
                                                    <CardContent className="p-3">
                                                        {/* Same content as above but only unread */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-1">
                                                                {getNotificationIcon(
                                                                    notification.type
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-sm font-medium text-foreground">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h4>
                                                                    <div className="flex items-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 w-6 p-0"
                                                                            onClick={() =>
                                                                                markAsRead(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Check className="h-3 w-3" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 w-6 p-0"
                                                                            onClick={() =>
                                                                                deleteNotification(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {formatTimestamp(
                                                                            notification.timestamp
                                                                        )}
                                                                    </span>
                                                                    {notification.actionUrl && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-xs h-6"
                                                                        >
                                                                            Voir
                                                                            détails
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="read">
                            <ScrollArea className="h-80">
                                <div className="space-y-2">
                                    {readNotifications.map(notification => (
                                        <Card key={notification.id}>
                                            <CardContent className="p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {getNotificationIcon(
                                                            notification.type
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                                {
                                                                    notification.title
                                                                }
                                                            </h4>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification.id
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTimestamp(
                                                                    notification.timestamp
                                                                )}
                                                            </span>
                                                            {notification.actionUrl && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-xs h-6"
                                                                >
                                                                    Voir détails
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationCenter
