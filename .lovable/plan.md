
# Onboarding Tour for Institutional Users

## Overview
Create a guided onboarding tour for new institutional users on the `/dashboard` page, using `driver.js` (already installed). The tour will highlight key sections of the `NetworkDashboard`, explain user roles, the language switcher, and key resources. Full FR/EN/AR/PT translations with RTL support for Arabic -- following the exact same pattern as the existing admin tour (`useAdminOnboarding.ts`).

## Tour Steps (6 steps)

| # | Target | Topic |
|---|--------|-------|
| 1 | Welcome hero section | Welcome to the platform -- explains the network purpose |
| 2 | KPI cards | Your dashboard metrics -- projects, documents, events, submissions |
| 3 | Network map | Interactive map -- explore member countries |
| 4 | Projects section | Inspiring projects -- collaborate across borders |
| 5 | Resources and Events | Key resources and upcoming events |
| 6 | Language selector (header) | Switch language (FR/EN/AR/PT) and your role in the platform |

## Technical Details

### New file: `src/hooks/useUserOnboardingTour.ts`
- Mirrors the pattern of `useAdminOnboarding.ts`
- 6 tour steps with FR/EN/AR/PT translations for title and description
- Uses `driver.js` with `localStorage` key `user_onboarding_tour_completed`
- Auto-starts on first visit (with 1.2s delay for DOM rendering)
- Exports `startTour` and `resetTour`
- Applies RTL class when Arabic is active (reuses existing `driver-rtl.css`)

### Modified file: `src/components/dashboard/NetworkDashboard.tsx`
- Import and call `useUserOnboardingTour`
- Import `driver-rtl.css`
- Add `data-tour` attributes to key sections:
  - `data-tour="user-hero"` on the `DashboardHero` wrapper
  - `data-tour="user-kpis"` on the `UserKPICards` wrapper
  - `data-tour="user-map"` on the `DashboardMapWidget` wrapper
  - `data-tour="user-projects"` on the `InspiringProjects` wrapper
  - `data-tour="user-resources"` on the resources/events grid wrapper
- Add a `HelpCircle` replay button in the hero area

### Modified file: `src/components/layout/ModernHeader.tsx`
- Add `data-tour="user-lang-selector"` attribute on the `LanguageSelector` wrapper so the tour can highlight it

### No new dependencies required
`driver.js` and `driver-rtl.css` are already in place.
