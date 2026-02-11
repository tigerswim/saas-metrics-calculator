# Deployment Guide

This repository contains **two versions** of the SaaS Metrics Calculator:

## Branch Structure

### `main` Branch - Original Calculator
- **Purpose**: Production version of the original SaaS Metrics Calculator
- **Deployment URL**: https://saas-metrics-calculator.netlify.app
- **Features**: Standard SaaS metrics calculator with fixed bidirectional connections

### `earnix-branded` Branch - Earnix Portfolio Version
- **Purpose**: Customized version demonstrating industry segmentation (Insurance/Banking)
- **Deployment URL**: (To be configured - see setup below)
- **Features**:
  - Earnix brand identity (orange #F44D2E, teal #03505C, Space Grotesk font)
  - Industry vertical selector (Insurance/Banking)
  - Query parameter routing (`?vertical=insurance` or `?vertical=banking`)
  - Industry-specific default values and business dynamics
  - Subtle visual differentiation (badges, theme colors)
  - All standard SaaS terminology maintained

## Netlify Setup

### Site 1: Original Calculator (Already Configured)
- **Site**: Current saas-metrics-calculator.netlify.app
- **Branch**: `main`
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: 20

### Site 2: Earnix Version (New Site Needed)
To deploy the Earnix version:

1. **Create New Netlify Site**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub: `tigerswim/saas-metrics-calculator`

2. **Configure Build Settings**:
   - **Branch to deploy**: `earnix-branded`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20 (set in Environment Variables: `NODE_VERSION=20`)

3. **Suggested Site Name**: `earnix-metrics-calculator` or similar

4. **Deploy**: Netlify will automatically deploy on push to `earnix-branded` branch

## Making Updates

### Updates to Both Versions
For bug fixes or feature enhancements that apply to both:

```bash
# Make changes on main branch
git checkout main
# ... make changes ...
git add .
git commit -m "Fix: description"
git push origin main

# Cherry-pick to earnix-branded
git checkout earnix-branded
git cherry-pick <commit-hash>
# Resolve any conflicts if needed
git push origin earnix-branded
```

### Earnix-Specific Updates
For changes only to the Earnix version:

```bash
git checkout earnix-branded
# ... make changes ...
git add .
git commit -m "Earnix: description"
git push origin earnix-branded
```

## Key Differences Between Branches

| Feature | main | earnix-branded |
|---------|------|----------------|
| Branding | Generic SaaS | Earnix (orange/teal) |
| Font | Default | Space Grotesk |
| Industry Selector | No | Yes (Insurance/Banking) |
| Configuration System | No | Yes (`industryConfig.ts`) |
| Visual Differentiation | No | Subtle (badges, colors) |
| Default Values | Standard | Industry-specific |
| New Files | None | `app/config/`, `app/contexts/`, `app/hooks/` |

## Portfolio Use

The Earnix version demonstrates:
- **Strategic thinking**: Understanding how SaaS vendors model different customer verticals
- **Technical execution**: Configuration-based architecture
- **Design application**: Real brand identity implementation
- **Business knowledge**: Industry-specific business dynamics

Both versions share the same core calculation engine and metric relationships, with only presentation and defaults differing.

---

**Last Updated**: February 10, 2026
