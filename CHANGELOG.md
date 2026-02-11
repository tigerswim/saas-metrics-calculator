# Changelog

All notable changes to the SaaS Metrics Calculator will be documented in this file.

## [2.0.0] - 2026-02-11

### Mobile-First Redesign 📱

A comprehensive mobile optimization update that enhances the mobile experience while preserving full desktop functionality.

#### Added
- **Mobile-optimized header** with larger touch targets (44x44px minimum)
- **Dedicated mobile persona selector** row below header
- **Vertical Pipeline Funnel** layout for mobile devices with card-based UI
- **Scroll indicators** for horizontal scrolling sections
- **Touch-friendly focus states** with proper iOS tap highlight handling
- **Viewport meta tags** for optimal mobile rendering
- **Mobile-specific CSS optimizations** for smooth scrolling and text sizing
- **Responsive typography** that scales appropriately across devices
- **Dynamic height** for React Flow Metrics Map on mobile

#### Changed
- **Header bar**: Icon-only buttons on mobile, full labels on desktop
- **Input Panel**: Wider on tablets (max-w-md → max-w-lg), larger input fields
- **Pipeline Funnel**:
  - Mobile (< 768px): Vertical card stack with embedded costs
  - Desktop (≥ 768px): Original horizontal bars (unchanged)
- **Metrics Map v2**: Added gradient scroll indicators, improved card sizing
- **Metrics Map v3 Controls**: Responsive layout with proper touch targets
- **MetricCardV2**: Increased padding and minimum heights for better touch interaction
- **ExecutiveBrief**: Responsive grid and typography improvements
- **All spacing**: Increased on mobile (gap-2 → gap-4, mb-4 → mb-6, etc.)

#### Technical
- Updated 10 component files for mobile responsiveness
- Added mobile-specific CSS in `globals.css`
- Enhanced `layout.tsx` with mobile web app meta tags
- Zero breaking changes - fully backward compatible
- No new dependencies added
- Performance improvements on mobile devices

#### Documentation
- Added `MOBILE-IMPROVEMENTS.md` - Comprehensive mobile changes guide
- Added `PIPELINE-FUNNEL-MOBILE-REDESIGN.md` - Pipeline Funnel redesign rationale
- Updated `DEPLOYMENT.md` - Corrected port information
- Updated `README.md` - Added mobile testing instructions

### Browser Support
- ✅ iOS Safari (iPhone 12+)
- ✅ Android Chrome (last 2 versions)
- ✅ Desktop browsers (unchanged)
- ✅ Tablet devices (iPad, Android tablets)

### Testing
- Tested on mobile viewports: 375px, 390px, 414px, 768px
- Tested on desktop: 1024px, 1280px, 1920px
- Verified touch targets meet accessibility guidelines (≥44x44px)
- Confirmed zero regressions on desktop experience

---

## [1.0.0] - 2025-10-XX

### Initial Release

#### Features
- Interactive SaaS metrics calculator
- Real-time metric calculations
- Industry-specific configurations (Insurance, Banking)
- Multiple visualization views:
  - Executive Brief
  - Pipeline Funnel
  - Growth Trajectory
  - Unit Economics
  - Metrics Maps (v2 and v3)
- Exportable configurations
- Responsive design (desktop-focused)

#### Technical Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Flow
- Framer Motion

---

## Version History

- **2.0.0** (2026-02-11): Mobile-First Redesign
- **1.0.0** (2025-10-XX): Initial Release
