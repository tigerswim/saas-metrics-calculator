# Branch Status & Deployment Strategy

**Last Updated**: February 11, 2026

---

## Current Status

### ✅ Main Branch (Clean)
**Repository**: `main`
**Deployment**: https://saas-metrics-calculator.netlify.app/
**Status**: Original SaaS calculator WITHOUT Earnix branding

**What's Included**:
- Original SaaS Metrics Calculator
- NO industry/vertical selector
- NO Earnix branding (orange colors, teal headlines, etc.)
- Standard blue color scheme
- All original functionality intact

**Mobile Improvements Status**: ❌ **Not Yet Applied**
The mobile improvements need to be cherry-picked separately to avoid bringing Earnix-specific code.

---

### ✅ Earnix-Branded Branch
**Repository**: `earnix-branded`
**Deployment**: Your Earnix-specific Netlify site
**Status**: Earnix-branded version WITH mobile improvements

**What's Included**:
- Industry Context (Insurance/Banking verticals)
- Earnix branding (orange #F44D2E, teal #03505C)
- Industry-specific defaults and labels
- Space Grotesk font
- ✅ **Full mobile improvements** (v2.0.0)

---

## What Happened

### The Problem
When I merged `earnix-branded` → `main`, it brought over ALL changes including:
- ✅ Mobile improvements (wanted)
- ❌ Earnix branding (NOT wanted on main)
- ❌ Industry Context system (NOT wanted on main)
- ❌ IndustryConfig files (NOT wanted on main)

Result: saas-metrics-calculator.netlify.app showed Earnix branding 😬

### The Fix
1. **Force-pushed clean `main` branch** - Removed the merge
2. **Result**: saas-metrics-calculator.netlify.app is now back to original

---

## Next Steps: Apply Mobile Improvements to Main

To get mobile improvements on the main branch WITHOUT Earnix branding, we need to:

### Option 1: Manual Port (Recommended)
Apply mobile-specific CSS/layout changes file-by-file:

**Files to Update on Main**:
1. `app/components/PipelineFunnel.tsx` - Vertical mobile layout
2. `app/components/InputPanel.tsx` - Touch-friendly inputs
3. `app/components/ExecutiveBrief.tsx` - Responsive typography
4. `app/components/metrics-map-v2/VerticalMetricsMap.tsx` - Scroll indicators
5. `app/components/metrics-map-v3/ReactFlowMetricsMap.tsx` - Dynamic height
6. `app/components/metrics-map-v3/ControlsBar.tsx` - Responsive controls
7. `app/components/metrics-map-v2/MetricCardV2.tsx` - Touch targets
8. `app/layout.tsx` - Viewport meta tags
9. `app/globals.css` - Mobile CSS optimizations

**Color Changes Required**:
- Change `bg-earnix-orange` → `bg-blue-600`
- Change `text-earnix-orange` → `text-blue-600`
- Remove references to `theme.badgeBg`, `theme.badgeText`
- Remove `earnix-headline` class usage

**Files to Exclude**:
- ❌ `app/config/industryConfig.ts`
- ❌ `app/contexts/IndustryContext.tsx`
- ❌ `app/hooks/useIndustryTheme.ts`
- ❌ Industry-related imports in Calculator.tsx

### Option 2: Selective Cherry-Pick (Advanced)
```bash
# On main branch
git cherry-pick <commit-hash> --no-commit
# Remove unwanted files
git reset HEAD app/config/ app/contexts/ app/hooks/
git checkout -- app/config/ app/contexts/ app/hooks/
# Manually fix Calculator.tsx to remove industry imports
# Commit
```

---

## Deployment URLs

| Branch | Netlify Site | Status | Branding |
|--------|--------------|--------|----------|
| `main` | saas-metrics-calculator.netlify.app | ✅ Live | Original (Blue) |
| `earnix-branded` | [Your Earnix Netlify] | ✅ Live | Earnix (Orange/Teal) |

---

## Files That Differ Between Branches

### Earnix-Branded ONLY (Don't Port to Main)
```
app/config/industryConfig.ts
app/contexts/IndustryContext.tsx
app/hooks/useIndustryTheme.ts
```

### Modified on Both (Port Mobile Changes Only)
```
app/components/Calculator.tsx (remove industry imports)
app/components/PipelineFunnel.tsx (port mobile layout)
app/components/InputPanel.tsx (port touch improvements)
app/components/ExecutiveBrief.tsx (port responsive grid)
app/components/metrics-map-v2/VerticalMetricsMap.tsx (port scroll indicators)
app/components/metrics-map-v3/ReactFlowMetricsMap.tsx (port dynamic height)
app/components/metrics-map-v3/ControlsBar.tsx (port responsive controls)
app/components/metrics-map-v2/MetricCardV2.tsx (port touch targets)
app/layout.tsx (port viewport metas)
app/globals.css (port mobile CSS)
```

### Documentation (Can Share)
```
MOBILE-IMPROVEMENTS.md
PIPELINE-FUNNEL-MOBILE-REDESIGN.md
CHANGELOG.md
```

---

## Recommendations

### For Main Branch
1. **Keep it simple** - Original SaaS calculator only
2. **Apply mobile improvements** - But strip Earnix branding
3. **Use blue colors** - Replace earnix-orange with blue-600
4. **No industry context** - Remove vertical selector entirely

### For Earnix-Branded Branch
1. **Keep all improvements** - Already has mobile v2.0.0
2. **Continue development here** - Add new features
3. **Cherry-pick to main** - When features are non-Earnix-specific

---

## Quick Reference Commands

```bash
# Check current branch
git branch --show-current

# Switch to main (original calculator)
git checkout main

# Switch to earnix-branded
git checkout earnix-branded

# View differences
git diff main..earnix-branded -- app/components/PipelineFunnel.tsx
```

---

**Summary**: Main branch is now clean. Mobile improvements still need to be applied to main without the Earnix branding.
