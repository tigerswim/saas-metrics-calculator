# Branch Strategy

This document explains the branch structure for the SaaS Metrics Calculator repository.

## Overview

This repository maintains **two separate production deployments** from different branches:

| Branch | Deployment | Purpose | Branding |
|--------|-----------|---------|----------|
| `main` | [saas-metrics-calculator.netlify.app](https://saas-metrics-calculator.netlify.app) | Generic SaaS calculator | Blue (#3b82f6) |
| `earnix-branded` | [earnix-metrics-calculator.netlify.app](https://earnix-metrics-calculator.netlify.app) | Insurance/Banking vertical | Orange (earnix-orange) |

## Branch Differences

### Main Branch (`main`)

**What it includes:**
- ✅ All core calculator functionality
- ✅ Generic SaaS terminology ("Customers", "Leads", "ARR")
- ✅ Blue color scheme (#3b82f6)
- ✅ Standard field labels
- ✅ Mobile-responsive UI (added Feb 2026)

**What it does NOT include:**
- ❌ IndustryContext (`app/contexts/IndustryContext.tsx`)
- ❌ useIndustryTheme hook (`app/hooks/useIndustryTheme.ts`)
- ❌ Industry selector UI
- ❌ Dynamic field labels via `getFieldLabel()`
- ❌ Orange/Earnix branding

### Earnix-Branded Branch (`earnix-branded`)

**What it includes (everything from main PLUS):**
- ✅ All features from `main` branch
- ✅ IndustryContext for industry-specific terminology
- ✅ useIndustryTheme hook for orange branding
- ✅ Industry selector (Insurance vs Banking)
- ✅ Dynamic labels ("Customers" → "Policyholders" for insurance)
- ✅ Orange color scheme (earnix-orange: #f97316)
- ✅ Mobile-responsive UI (added Feb 2026)

**Unique files:**
- `app/contexts/IndustryContext.tsx` - Industry-specific label mapping
- `app/hooks/useIndustryTheme.ts` - Theme color customization
- `tailwind.config.js` - Extended with earnix-orange color

**Modified files (vs main):**
- `app/components/Calculator.tsx` - Imports IndustryContext
- `app/components/InputPanel.tsx` - Uses `getFieldLabel()` instead of hardcoded labels
- `app/components/metrics-map-v2/VerticalMetricsMap.tsx` - Uses `useIndustryTheme()`
- `app/layout.tsx` - Uses orange themeColor

## Development Workflow

### Adding New Features

**For generic features (benefits all users):**

1. Work on `main` branch:
   ```bash
   git checkout main
   # Make changes
   git add .
   git commit -m "Add feature X"
   git push origin main
   ```

2. If Earnix should have this feature too, port to `earnix-branded`:
   ```bash
   git checkout earnix-branded
   git cherry-pick <commit-hash>
   # OR manually apply changes if conflicts
   git push origin earnix-branded
   ```

**For Earnix-specific features:**

1. Work directly on `earnix-branded`:
   ```bash
   git checkout earnix-branded
   # Make changes to IndustryContext, labels, etc.
   git add .
   git commit -m "Add Earnix-specific feature Y"
   git push origin earnix-branded
   ```

### Bug Fixes

**If bug exists in both branches:**

1. Fix on `main` first:
   ```bash
   git checkout main
   # Fix bug
   git commit -m "Fix bug Z"
   git push origin main
   ```

2. Apply same fix to `earnix-branded`:
   ```bash
   git checkout earnix-branded
   git cherry-pick <commit-hash>
   # Resolve conflicts if any
   git push origin earnix-branded
   ```

**If bug only exists in one branch:**
- Fix it directly on that branch only

### Mobile/UI Improvements

**These affect both branches equally:**

1. Implement on `main` (using blue-600):
   ```bash
   git checkout main
   # Make responsive changes
   git push origin main
   ```

2. Port to `earnix-branded` (replace blue-600 with earnix-orange):
   ```bash
   git checkout earnix-branded
   # Apply same changes, swap colors
   git push origin earnix-branded
   ```

## Common Pitfalls & How to Avoid

### ❌ PITFALL 1: Merging earnix-branded into main

**Problem:** Brings IndustryContext and orange branding to the generic calculator.

**Result:** Main deployment breaks (build errors) or looks like Earnix site.

**Solution:** NEVER merge `earnix-branded` → `main`. Use cherry-pick for specific commits only.

```bash
# ❌ NEVER DO THIS:
git checkout main
git merge earnix-branded

# ✅ Instead, cherry-pick specific commits:
git checkout main
git cherry-pick <specific-commit-hash>
```

### ❌ PITFALL 2: Importing IndustryContext on main

**Problem:** `import { useIndustry } from '../contexts/IndustryContext'` on main branch.

**Result:** Build fails - module doesn't exist.

**Symptoms:**
- Netlify build error: "Module not found: Can't resolve '../contexts/IndustryContext'"
- TypeScript error about missing module

**Solution:**
- On `main`: Use hardcoded labels, NO IndustryContext imports
- On `earnix-branded`: Use `getFieldLabel()` and IndustryContext

**Example:**

```typescript
// ✅ CORRECT on main branch:
<InputField label="Beginning ARR" ... />

// ❌ WRONG on main branch (will break build):
const { getFieldLabel } = useIndustry();
<InputField label={getFieldLabel('beginningARR')} ... />

// ✅ CORRECT on earnix-branded:
const { getFieldLabel } = useIndustry();
<InputField label={getFieldLabel('beginningARR')} ... />
```

### ❌ PITFALL 3: Wrong color scheme on wrong branch

**Problem:** Using blue-600 on earnix-branded or earnix-orange on main.

**Result:** Inconsistent branding.

**Solution:**
- `main`: Use `blue-600`, `bg-blue-600`, etc.
- `earnix-branded`: Use `earnix-orange`, `bg-earnix-orange`, etc.

### ❌ PITFALL 4: Forgetting to test both deployments

**Problem:** Only testing main after making changes to both branches.

**Result:** Earnix deployment may be broken or missing features.

**Solution:** After pushing to both branches, verify BOTH URLs:
1. https://saas-metrics-calculator.netlify.app (main)
2. https://earnix-metrics-calculator.netlify.app (earnix-branded)

## Netlify Configuration

Both branches auto-deploy via Netlify:

### Main Branch
- **Site Name**: saas-metrics-calculator
- **Branch**: main
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Domain**: saas-metrics-calculator.netlify.app

### Earnix Branch
- **Site Name**: earnix-metrics-calculator
- **Branch**: earnix-branded
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Domain**: earnix-metrics-calculator.netlify.app

## File Comparison Checklist

When working across branches, use this checklist to ensure compatibility:

### Files that MUST differ:

| File | Main Branch | Earnix Branch |
|------|------------|---------------|
| `tailwind.config.js` | Standard colors | + earnix-orange |
| `app/layout.tsx` | themeColor: '#3b82f6' | themeColor: '#f97316' |
| `app/components/Calculator.tsx` | No IndustryContext | Imports IndustryContext |
| `app/components/InputPanel.tsx` | Hardcoded labels | Uses getFieldLabel() |
| `app/components/metrics-map-v2/VerticalMetricsMap.tsx` | No theme hook | Uses useIndustryTheme() |

### Files unique to earnix-branded:

- `app/contexts/IndustryContext.tsx`
- `app/hooks/useIndustryTheme.ts`
- `EARNIX-CUSTOMIZATION.md` (if exists)

### Files that should be identical:

- `app/utils/calculator.ts` - Core calculation logic
- `app/utils/metricFormulas.ts` - Metric formulas
- `app/utils/metricTargets.ts` - Performance targets
- `app/utils/metricsGraph.ts` - Relationship definitions
- `app/types.ts` - TypeScript interfaces
- Most component files (except those listed above)

## Quick Reference Commands

```bash
# Check current branch
git branch --show-current

# Switch to main (generic calculator)
git checkout main

# Switch to earnix-branded
git checkout earnix-branded

# See differences between branches for a specific file
git diff main earnix-branded -- app/components/Calculator.tsx

# List files that differ between branches
git diff --name-only main earnix-branded

# Cherry-pick a commit from main to earnix-branded
git checkout earnix-branded
git cherry-pick <commit-hash-from-main>

# See commit history differences
git log main..earnix-branded --oneline
```

## History

**February 2026:**
- Mobile improvements applied to BOTH branches
- Build error fix: Removed IndustryContext imports from main branch
- Created this documentation to prevent future confusion

**January 2026:**
- Created earnix-branded branch for Earnix customization
- Added IndustryContext for insurance/banking terminology
- Implemented orange theme and industry selector

**Before January 2026:**
- Single main branch with generic SaaS calculator

---

**Last Updated**: February 2026
**Maintainer**: Kinetic Brand Partners
