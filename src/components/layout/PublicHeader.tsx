import React, { ElementType, Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    Home,
    Map,
    BookOpen,
    MessageSquare,
    GraduationCap,
    Calendar,
    Rss,
    FileText,
    Video,
    Users,
} from "lucide-react";
import atuLogo from "@/assets/atu-logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

export const PublicHeader = () => {
    const { t } = useTranslation();
    const { isRTL } = useDirection();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { getNavItems, getNavLabel } = useSiteConfig();
    const { user, profile, signOut, hasPermission } = useAuth();
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const itemsNavAdminMenuStock = getNavItems("admin", null);
    const itemsNavPublicMenuStock = getNavItems("header", null);
    const isActivePath = (path?: string) =>
        path ? location.pathname === path : false;


    return (
        <header
            className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border shadow-sm"
            role="banner"
            aria-label={t("accessibility.publicHeader") || "En-tête du site public"}
        >
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "flex items-center justify-between h-16",
                        isRTL && "flex-row-reverse",
                    )}
                >
                    {/* Logo */}
                    <Link to="/"
                        className={cn(
                            "flex items-center gap-3 shrink-0",
                            isRTL && "flex-row-reverse",
                        )}
                    >
                        <img src={atuLogo} alt="ATU - African Telecommunications Union" className="h-9 w-auto" />
                        <div className="border-l border-border h-7" />
                        <div className={cn("flex flex-col", isRTL && "items-end")}>
                            <span className="text-base font-bold tracking-tight text-[hsl(222_47%_11%)] dark:text-foreground leading-tight">
                                USF Digital Connect
                            </span>
                            <span className="text-[10px] font-medium text-[hsl(215_20%_40%)] dark:text-muted-foreground uppercase tracking-widest leading-tight">
                                Africa
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav
                        aria-label={t("accessibility.mainNav") || "Navigation principale"}
                        className={cn(
                            "hidden xl:flex items-center gap-0.5 relative",
                            isRTL && "flex-row-reverse",
                        )}
                    >
                        {itemsNavPublicMenuStock?.map((item) => {
                            const isActive = location.pathname === item.href;
                            const itemsNavSubMenuStock = getNavItems(
                                "header",
                                item.reference,
                            );
                            const hasSubmenu: Boolean = Boolean(itemsNavSubMenuStock?.length);

                            return (
                                hasPermission(item) ? (
                                    <div key={item.id} className="relative group">
                                        {hasSubmenu ? (
                                            <button
                                                className={cn(
                                                    "flex items-center gap-1.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "text-primary bg-primary/10 font-semibold"
                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                                                )}
                                            >
                                                {getNavLabel(item)}
                                                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                                            </button>
                                        ) : (
                                            <Link
                                                to={item.href}
                                                target={item.is_external ? "_blank" : undefined}
                                                rel={item.is_external ? "noopener noreferrer" : undefined}
                                                className={cn(
                                                    "block px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                                    isActive
                                                        ? "text-primary bg-primary/10 font-semibold"
                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                                                )}
                                            >
                                                {getNavLabel(item)}
                                            </Link>
                                        )}

                                        {/* Submenu Dropdown */}
                                        {hasSubmenu && (
                                            <div className="absolute left-0 top-full mt-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] min-w-[320px]">
                                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-1 overflow-hidden">
                                                    {itemsNavSubMenuStock?.map((subItem, index) => {
                                                        const SubIcon = subItem.icon as React.ElementType | undefined;
                                                        const subActive = isActivePath(subItem.href);
                                                        return (
                                                            hasPermission(subItem) ? (
                                                                <Link
                                                                    key={subItem.id}
                                                                    to={subItem.href}
                                                                    className={cn(
                                                                        "flex items-center gap-4 px-4 py-3.5 text-sm transition-all duration-150",
                                                                        subActive
                                                                            ? "bg-primary text-white"
                                                                            : "text-slate-700 hover:bg-primary/10 dark:text-slate-200 dark:hover:bg-primary/10",
                                                                        index > 0 &&
                                                                        "border-t border-slate-100 dark:border-slate-800",
                                                                    )}
                                                                >
                                                                    <div className="flex flex-col leading-tight flex-1 min-w-0">
                                                                        <span
                                                                            className={cn(
                                                                                "font-semibold transition-colors",
                                                                                subActive
                                                                                    ? "text-white"
                                                                                    : "text-slate-900 dark:text-slate-100",
                                                                            )}
                                                                        >
                                                                            {getNavLabel(subItem)}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            ) : null
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div
                        className={cn(
                            "flex items-center gap-2",
                            isRTL && "flex-row-reverse",
                        )}
                    >
                        <ThemeSwitch />
                        <LanguageSelector variant="ghost" size="sm" showLabel={true} />
                        {!user ? (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted text-sm"
                                >
                                    <Link to="/auth">
                                        {t("common.login") || t("home.hero.cta.login")}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                                >
                                    <Link to="/auth?tab=signup">
                                        {t("common.register") || t("home.hero.cta.signup")}
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative h-10 w-10 rounded-full border border-border bg-white shadow-sm flex items-center justify-center transition hover:border-primary/50">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={profile?.avatar_url || ""}
                                                alt={profile?.first_name || "User avatar"}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                                {profile?.first_name && profile?.last_name
                                                    ? `${profile.first_name[0]}${profile.last_name[0]}`
                                                    : user.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-white border border-border shadow-lg p-0 overflow-hidden w-80 md:w-[300px]"
                                >
                                    <div className="px-5 py-4">
                                        <p className="text-sm font-semibold text-foreground">
                                            {profile?.first_name && profile?.last_name
                                                ? `${profile.first_name} ${profile.last_name}`
                                                : user.email?.split("@")[0]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator className="mx-4" />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-slate-50"
                                        >
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{t("nav.profile")}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="mx-4" />



                                    <div className="px-5 pb-4 pt-2">
                                        <p className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-slate-400 mb-2">
                                            Explorer
                                        </p>
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="space-y-2"
                                            value={expandedGroup ?? undefined}
                                            onValueChange={(value) => setExpandedGroup(value ?? null)}
                                        >
                                            {itemsNavAdminMenuStock.map((item) => {
                                                const Icon = item.icon as ElementType | undefined;
                                                const itemsNavAdminSubMenuStock = getNavItems("admin", item.reference);
                                                const hasSubmenu: Boolean = Boolean(itemsNavAdminSubMenuStock?.length);
                                                const active = isActivePath(item.href);

                                                return (
                                                    hasPermission(item) ? (
                                                        <Fragment key={item?.id}>
                                                            {hasSubmenu ? (
                                                                <AccordionItem
                                                                    value={item.id}
                                                                    className="rounded-2xl border border-slate-200 bg-slate-50"
                                                                >

                                                                    {/*cn(
                                                                    "flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm",
                                                                    active
                                                                        ? "border-primary/60 bg-white text-primary"
                                                                        : "text-slate-600 hover:border-slate-300 hover:bg-white hover:text-foreground",
                                                                )*/}

                                                                    <AccordionTrigger
                                                                        className={cn(
                                                                            "flex items-center justify-between gap-3 px-4 py-3 text-sm bg-slate-50",
                                                                            "hover:bg-slate-50 hover:text-inherit",
                                                                            "no-underline hover:no-underline",
                                                                            active ? "text-primary" : "text-slate-600 hover:border-slate-300 hover:bg-white hover:text-inherit",
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            {Icon ? (
                                                                                <Icon
                                                                                    className={cn(
                                                                                        "h-4 w-4",
                                                                                        active ? "text-primary" : "text-slate-500"
                                                                                    )}
                                                                                />
                                                                            ) : null}
                                                                            <span>{getNavLabel(item)}</span>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="px-2 pb-3 pt-0">
                                                                        <div className="space-y-2">
                                                                            {itemsNavAdminSubMenuStock?.map((subItem) => {
                                                                                const subActive = isActivePath(subItem.href);
                                                                                const SubIcon = subItem.icon as React.ElementType | undefined;
                                                                                return (
                                                                                    hasPermission(subItem) ? (
                                                                                        <Link
                                                                                            key={subItem.id}
                                                                                            to={subItem.href}
                                                                                            className={cn(
                                                                                                "flex items-center gap-3 rounded-xl px-3 py-2 transition text-sm",
                                                                                                subActive
                                                                                                    ? "bg-primary text-white"
                                                                                                    : "text-slate-600 hover:bg-white hover:text-foreground",
                                                                                                isRTL && "flex-row-reverse",
                                                                                            )}
                                                                                        >
                                                                                            {SubIcon ? (
                                                                                                <SubIcon
                                                                                                    className={cn(
                                                                                                        "h-4 w-4",
                                                                                                        subActive ? "text-white" : "text-slate-500"
                                                                                                    )}
                                                                                                />
                                                                                            ) : null}
                                                                                            <div className="flex flex-col leading-tight">
                                                                                                <span className={cn(
                                                                                                    "",
                                                                                                    subActive ? "text-white" : "text-slate-900"
                                                                                                )}>
                                                                                                    {getNavLabel(subItem)}
                                                                                                </span>
                                                                                                <span className="text-[0.65rem] text-slate-500">
                                                                                                    {subItem.description}
                                                                                                </span>
                                                                                            </div>
                                                                                        </Link>
                                                                                    ) : null
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ) : (
                                                                <Link
                                                                    key={item.id}
                                                                    to={item.href ?? "/"}
                                                                    className={cn(
                                                                        "flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm",
                                                                        active
                                                                            ? "border-primary/60 bg-white text-primary"
                                                                            : "text-slate-600 hover:border-slate-300 hover:bg-white hover:text-foreground",
                                                                    )}
                                                                >
                                                                    {Icon ? (
                                                                        <Icon
                                                                            className={cn(
                                                                                "h-4 w-4",
                                                                                active ? "text-primary" : "text-slate-500"
                                                                            )}
                                                                        />
                                                                    ) : null}
                                                                    <span>{getNavLabel(item)}</span>
                                                                </Link>
                                                            )}
                                                        </Fragment>
                                                    ) : null
                                                );
                                            })}
                                        </Accordion>
                                    </div>



                                    <DropdownMenuSeparator className="mx-4" />
                                    <DropdownMenuItem
                                        onClick={async () => {
                                            await signOut();
                                            navigate("/");
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-slate-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>{t("nav.logout")}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Mobile toggle */}
                        {/* Mobile nav */}
                        <AnimatePresence>
                            <Drawer
                                direction="right"
                                open={mobileOpen}
                                onOpenChange={setMobileOpen}
                            >
                                <DrawerTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="xl:hidden text-muted-foreground hover:text-foreground"
                                        aria-label={
                                            mobileOpen
                                                ? t("accessibility.closeMenu") || "Fermer le menu"
                                                : t("accessibility.openMenu") || "Ouvrir le menu"
                                        }
                                        aria-expanded={mobileOpen}
                                        aria-controls="public-mobile-nav"
                                    >
                                        {mobileOpen ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Menu className="h-5 w-5" />
                                        )}
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader className="flex flex-col items-center justify-center gap-4 mt-4 text-center">
                                        {/* Logo */}
                                        <Link
                                            to="/"
                                            className={cn(
                                                "flex items-center gap-3 shrink-0",
                                                isRTL && "flex-row-reverse",
                                            )}
                                        >
                                            <img
                                                src={atuLogo}
                                                alt="ATU - African Telecommunications Union"
                                                className="h-20 w-auto"
                                            />
                                        </Link>
                                        <div className="w-16 h-px bg-border" />

                                        <div className="flex flex-col items-center">
                                            <span className="text-base font-bold tracking-tight text-[hsl(222_47%_11%)] dark:text-foreground leading-tight">
                                                USF Digital Connect
                                            </span>
                                            <span className="text-[10px] font-medium text-[hsl(215_20%_40%)] dark:text-muted-foreground uppercase tracking-widest leading-tight">
                                                Africa
                                            </span>
                                        </div>
                                    </DrawerHeader>

                                    <div className="no-scrollbar overflow-y-auto px-4 h-full pt-5">
                                        {itemsNavPublicMenuStock?.map((item) => {
                                            const isActive = location.pathname === item.href;
                                            const itemsNavSubMenuStock = getNavItems(
                                                "header",
                                                item.reference,
                                            );
                                            return (
                                                hasPermission(item) ? (
                                                    <div key={item.id} className="relative group">
                                                        {itemsNavPublicMenuStock ? (
                                                            <button
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full",
                                                                    isActive
                                                                        ? "text-primary bg-primary/10 font-semibold"
                                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                                                                )}
                                                            >
                                                                {getNavLabel(item)}
                                                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-hover:rotate-180 " />
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                to={item.href}
                                                                target={item.is_external ? "_blank" : undefined}
                                                                rel={
                                                                    item.is_external
                                                                        ? "noopener noreferrer"
                                                                        : undefined
                                                                }
                                                                className={cn(
                                                                    "block px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                                                    isActive
                                                                        ? "text-primary bg-primary/10 font-semibold"
                                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                                                                )}
                                                            >
                                                                {getNavLabel(item)}
                                                            </Link>
                                                        )}

                                                        {/* Submenu Dropdown */}
                                                        {itemsNavPublicMenuStock && (
                                                            <div className="absolute left-0 top-full mt-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] w-full">
                                                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-1 overflow-hidden">
                                                                    {itemsNavSubMenuStock?.map((subItem, index) => {
                                                                        const SubIcon = subItem.icon as React.ElementType | undefined;
                                                                        const subActive = isActivePath(subItem.href);
                                                                        return (
                                                                            hasPermission(subItem) ? (
                                                                                <Link
                                                                                    key={subItem.id}
                                                                                    to={subItem.href}
                                                                                    className={cn(
                                                                                        "flex items-center gap-4 px-4 py-3.5 text-sm transition-all duration-150",
                                                                                        subActive
                                                                                            ? "bg-primary text-white"
                                                                                            : "text-slate-700 hover:bg-primary/10 dark:text-slate-200 dark:hover:bg-primary/10",
                                                                                        index > 0 &&
                                                                                        "border-t border-slate-100 dark:border-slate-800",
                                                                                    )}
                                                                                >
                                                                                    <div className="flex flex-col leading-tight flex-1 min-w-0">
                                                                                        <span
                                                                                            className={cn(
                                                                                                "font-semibold transition-colors",
                                                                                                subActive
                                                                                                    ? "text-white"
                                                                                                    : "text-slate-900 dark:text-slate-100",
                                                                                            )}
                                                                                        >
                                                                                            {getNavLabel(subItem)}
                                                                                        </span>
                                                                                    </div>
                                                                                </Link>
                                                                            ) : null
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null
                                            );
                                        })}
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};
