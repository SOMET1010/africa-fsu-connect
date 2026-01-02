// NEXUS_COMPONENT
// Live Data Feed - Dark mode continuity with glassmorphism cards
// Connected timeline with staggered animations
// Powered by Perplexity for real-time African telecom news

import { motion } from "framer-motion";
import { FileText, FolderGit2, Calendar, Users, ArrowRight, Activity, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { useAfricaNews, type NewsItem } from "@/hooks/useAfricaNews";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

interface ActivityItem {
  id: number;
  countryKey: string;
  code: string;
  type: 'project' | 'doc' | 'event' | 'collab';
  titleKey: string;
  descKey: string;
  timeKey: string;
  timeCount?: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  isTranslationKey: boolean;
}

// Fallback data when API unavailable - using translation keys
const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    countryKey: "feed.demo.mali.country",
    code: "ML",
    type: "project",
    titleKey: "feed.demo.mali.title",
    descKey: "feed.demo.mali.desc",
    timeKey: "time.ago.hours",
    timeCount: 2,
    icon: FolderGit2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    isTranslationKey: true
  },
  {
    id: 2,
    countryKey: "feed.demo.kenya.country",
    code: "KE",
    type: "doc",
    titleKey: "feed.demo.kenya.title",
    descKey: "feed.demo.kenya.desc",
    timeKey: "time.ago.hours",
    timeCount: 5,
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    isTranslationKey: true
  },
  {
    id: 3,
    countryKey: "feed.demo.sutel.country",
    code: "NET",
    type: "event",
    titleKey: "feed.demo.sutel.title",
    descKey: "feed.demo.sutel.desc",
    timeKey: "time.future.hours",
    timeCount: 3,
    icon: Calendar,
    color: "text-[hsl(var(--nx-gold))]",
    bg: "bg-[hsl(var(--nx-gold))]/10",
    border: "border-[hsl(var(--nx-gold))]/20",
    isTranslationKey: true
  },
  {
    id: 4,
    countryKey: "feed.demo.collab.country",
    code: "SN/CI",
    type: "collab",
    titleKey: "feed.demo.collab.title",
    descKey: "feed.demo.collab.desc",
    timeKey: "time.ago.days",
    timeCount: 1,
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    isTranslationKey: true
  }
];

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  project: {
    icon: FolderGit2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  doc: {
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  event: {
    icon: Calendar,
    color: "text-[hsl(var(--nx-gold))]",
    bg: "bg-[hsl(var(--nx-gold))]/10",
    border: "border-[hsl(var(--nx-gold))]/20"
  },
  collab: {
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
};

function transformToActivityItems(news: NewsItem[]): ActivityItem[] {
  return news.map((item, index) => {
    const config = typeConfig[item.type] || typeConfig.project;
    return {
      id: index + 1,
      countryKey: item.country, // Raw text from API
      code: item.code || item.country.slice(0, 2).toUpperCase(),
      type: item.type,
      titleKey: item.title, // Raw text from API
      descKey: item.desc, // Raw text from API
      timeKey: "feed.time.recent",
      timeCount: undefined,
      isTranslationKey: false, // API data is raw text, not translation keys
      ...config
    };
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function NexusActivityFeed() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  // Temporarily disabled API to use translated demo data
  // const { data, isLoading, isError } = useAfricaNews();
  const data = null;
  const isLoading = false;
  const isError = false;
  
  // Always use FALLBACK_ACTIVITIES for now (supports i18n)
  const activities = FALLBACK_ACTIVITIES;

  // RTL-aware animation variants (defined inside component to access isRTL)
  const itemVariants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[hsl(var(--nx-night))]">
      
      {/* Background Elements - Continuité visuelle */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--nx-night))] to-[hsl(var(--nx-night))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[hsl(var(--nx-gold))]/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={cn("text-center mb-16", isRTL && "text-right")}>
          <div className={cn("flex items-center gap-3 mb-4", isRTL ? "justify-end" : "justify-center")}>
            <Badge className={cn("px-4 py-2 bg-white/10 text-white/80 border border-white/20", isRTL && "flex-row-reverse")}>
              <Activity className={cn("w-3 h-3", isRTL ? "ml-2" : "mr-2")} />
              {t('feed.badge')}
            </Badge>
            {!isLoading && !isError && data?.news && (
              <Badge className={cn("px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse", isRTL && "flex-row-reverse")}>
                <Radio className={cn("w-3 h-3", isRTL ? "ml-2" : "mr-2")} />
                LIVE
              </Badge>
            )}
          </div>
          <h2 className={cn("text-3xl md:text-4xl font-bold text-white mb-4", isRTL && "text-right")}>
            {t('feed.title')}{' '}
            <span className="text-[hsl(var(--nx-gold))]">{t('feed.title.highlight')}</span>
          </h2>
          <p className={cn("text-white/60 max-w-2xl", isRTL ? "mr-0 ml-auto" : "mx-auto")}>
            {t('feed.subtitle')}
          </p>
        </div>

        {/* Timeline Feed */}
        <div className="relative">
          
          {/* Ligne verticale de connexion (The Spine) - Desktop only, RTL-aware */}
          <div className={cn(
            "absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block",
            isRTL ? "right-8" : "left-8"
          )} />

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={cn(
                  "rounded-2xl p-5 bg-white/[0.03] animate-pulse",
                  isRTL ? "md:pr-20" : "md:pl-20"
                )}>
                  <div className={isRTL ? "mr-14 md:mr-0" : "ml-14 md:ml-0"}>
                    <div className="h-4 bg-white/10 rounded w-1/4 mb-3" />
                    <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Items */}
          {!isLoading && (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {activities.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <div
                    className={cn(
                      "group relative rounded-2xl p-5",
                      isRTL ? "md:pr-20" : "md:pl-20",
                      "bg-white/[0.03] backdrop-blur-sm",
                      "border border-white/[0.05]",
                      "hover:bg-white/[0.06] hover:border-white/10",
                      "transition-all duration-300 cursor-pointer"
                    )}
                  >
                    {/* Glowing connector dot (Desktop only) - RTL-aware */}
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 hidden md:block",
                      isRTL ? "right-8 translate-x-1/2" : "left-8 -translate-x-1/2"
                    )}>
                      <div className="w-3 h-3 rounded-full bg-white/30">
                        <div className="absolute inset-0 rounded-full bg-[hsl(var(--nx-gold))]/50 animate-ping" />
                      </div>
                    </div>

                    {/* Icon Box - RTL-aware */}
                    <div
                      className={cn(
                        "absolute top-5 w-10 h-10 rounded-xl flex items-center justify-center border",
                        isRTL ? "right-5 md:right-12" : "left-5 md:left-12",
                        item.bg,
                        item.border
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", item.color)} />
                    </div>

                    {/* Content - RTL-aware */}
                    <div className={isRTL ? "mr-14 md:mr-0" : "ml-14 md:ml-0"}>
                      <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <Badge 
                          variant="outline" 
                          className="bg-white/10 text-white/70 border-white/20 text-xs font-mono"
                        >
                          {item.code}
                        </Badge>
                        <span className="text-white/80 text-sm font-medium">
                          {item.isTranslationKey ? t(item.countryKey) : item.countryKey}
                        </span>
                        <span className={cn("text-white/40 text-xs", isRTL ? "mr-auto" : "ml-auto")}>
                          {item.timeCount !== undefined 
                            ? t(item.timeKey, { count: item.timeCount })
                            : t(item.timeKey)}
                        </span>
                      </div>

                      <h4 className={cn(
                        "text-white font-medium group-hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 mb-1",
                        isRTL && "text-right"
                      )}>
                        {item.isTranslationKey ? t(item.titleKey) : item.titleKey}
                      </h4>

                      <p className={cn("text-white/50 text-sm", isRTL && "text-right")}>
                        {item.isTranslationKey ? t(item.descKey) : item.descKey}
                      </p>
                    </div>

                    {/* Action Arrow - RTL-aware */}
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      isRTL ? "left-5" : "right-5"
                    )}>
                      <ArrowRight className={cn(
                        "w-5 h-5 text-white/50 transition-transform duration-300",
                        isRTL 
                          ? "rotate-180 group-hover:-translate-x-1" 
                          : "group-hover:translate-x-1"
                      )} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Citations / Sources */}
          {data?.citations && data.citations.length > 0 && (
            <div className={cn("mt-8 text-white/40 text-xs", isRTL ? "text-right" : "text-center")}>
              {t('feed.sources')}:{" "}
              {data.citations.slice(0, 3).map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[hsl(var(--nx-gold))] underline mx-1"
                >
                  [{i + 1}]
                </a>
              ))}
            </div>
          )}
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Button 
              asChild
              variant="outline" 
              className="border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
            >
              <Link to="/activity" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                {t('feed.viewAll')}
                <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
