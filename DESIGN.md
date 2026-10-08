# Web App Design Rules

## 1. Core Principle

Design every screen for modern, responsive web applications (desktop-first with fully responsive breakpoints for tablet and mobile).

Prioritize:

- Usability and intuitive navigation across large display spaces
- Clarity and visual hierarchy
- Consistency across all viewports
- Real product functionality
- Efficient use of desktop screen real estate without feeling sparse or bloated

Avoid decorative elements without clear purpose.

Existing design system always takes priority over visual trends.

---

# 2. Color System

## Available Color Variables

Only use existing project color variables:

- `neutral`
- `primary`
- `secondary`
- `accent`

These are the only approved color groups.

Every visible color must come from one of these variables.

Do not introduce:

- New color variables
- Custom HEX values
- RGB or HSL values
- Inline hardcoded colors
- Arbitrary Tailwind colors
- Additional semantic colors

If required color does not exist, reuse closest approved variable.

Never invent a new color.

---

## Neutral

Use `neutral` for:

- Web application backgrounds
- Surface backgrounds (panels, sidebars, header bars)
- Cards and content containers
- Primary text
- Secondary text
- Disabled states
- Non-emphasized elements

Never use pure white unless already provided through an approved `neutral` variable.

---

## Primary

Use `primary` for main actions and main emphasis.

Examples:

- Primary call-to-action (CTA) buttons
- Active navigation items/tabs
- Selected states in tables or lists
- Main interactive elements
- Important indicators

Do not use `primary` only for decoration.

---

## Secondary

Use `secondary` for supporting actions and secondary emphasis.

Examples:

- Secondary buttons
- Alternative actions
- Supporting interactive elements
- Secondary selected states

Do not use it randomly for visual variety.

---

## Accent

Use `accent` sparingly.

Examples:

- Important highlights
- Key information and badges
- Important data points or analytics highlights
- Limited visual emphasis

Accent should not dominate entire interface.

---

## Forbidden Color Usage

Never use:

- Hardcoded HEX colors
- `#FFFFFF` outside approved variables
- `rgb()`
- `rgba()`
- `hsl()`
- `hsla()`
- Arbitrary Tailwind colors
- `red-*`
- `blue-*`
- `green-*`
- `purple-*`
- `yellow-*`
- `orange-*`
- `pink-*`
- `violet-*`
- `indigo-*`

Do not create:

- `success`
- `warning`
- `error`
- `danger`
- `info`

unless existing values already map to `neutral`, `primary`, `secondary`, or `accent`.

---

# 3. Background Rules

Never use pure white backgrounds.

Use existing `neutral`, `primary`, `secondary`, or `accent` variables only.

Avoid:

- Harsh gradients
- Rainbow coloring
- Purple and black schemes
- Neon colors
- Generic pastel palettes
- Radial gradients
- Radial orbs
- Dot grids
- Liquid glass
- Glassmorphism
- Decorative visual effects

Backgrounds should remain clean and functional.

---

# 4. Typography Rules

Do not use:

- Inter
- Geist
- Space Grotesk

Use only fonts already defined in project.

Typography should prioritize:

- Readability on desktop and high-DPI displays
- Clear hierarchy across complex dashboards/pages
- Consistent sizing
- Appropriate spacing

Use only font sizes already defined in the project design system.

Use only font weights already defined in the project design system.

Do not create, invent, or approximate typography values.

Do not use:

- Arbitrary font sizes
- Custom `px`, `rem`, or `em` font sizes
- Arbitrary Tailwind text sizes
- Inline hardcoded font sizes
- Custom font weights
- Arbitrary Tailwind font weights
- Inline hardcoded font weights

Always use existing font-size variables, typography tokens, utilities, or design system values.

Always use existing font-weight variables, typography tokens, utilities, or design system values.

If a required font size or font weight does not exist, reuse the closest existing approved value.

Never create a new font-size or font-weight variable without a real design system requirement.

Do not use em dashes.

Use:

- Commas
- Colons
- Parentheses
- Separate sentences

---

# 5. Icon Rules

Do not use Lucide icons.

Do not use:

- Sparkle icons
- Emojis
- Decorative icons without functional purpose
- Animated arrows

Use only approved icon libraries already available in project.

Every icon must communicate clear meaning or action.

---

# 6. Layout Rules

Design desktop-first and scale down responsively for tablet and mobile viewports.

Prioritize:

- Clear structural layout (e.g., top navigation or sidebar layout)
- Content container max-widths to prevent awkward ultra-wide line lengths
- Predictable multi-column layouts for dashboards and tables
- Efficient utilization of wide screen real estate
- Structured, content-driven layouts

Avoid:

- Colored left stripes
- Terminal window aesthetics
- Decorative grids
- Excessive card layouts
- Artificial marketing sections

Ensure layouts gracefully collapse into single-column structures on smaller viewports.

---

# 7. Cards and Containers

Use cards/containers only when they create meaningful content grouping (e.g., dashboard widgets, data summaries).

Avoid cards used only for decoration.

Do not use overly soft corner radius.

Use radius values already defined in design system.

Avoid:

- Excessively rounded corners
- Pill-shaped containers for regular content
- Floating decorative containers
- Drop shadows

Create hierarchy using:

- Spacing
- Background contrast / Existing surface colors
- Typography
- Layout structure

---

# 8. Shadows and Depth

Do not use drop shadows.

Create visual hierarchy through:

- Background contrast
- Spacing
- Surface separation using approved `neutral` surface tones
- Typography hierarchy

Do not use large blur effects to simulate elevation.

---

# 9. Interaction Rules

Web interaction states must support desktop inputs (mouse, keyboard) and touch devices:

- Default
- Hover (subtle color shift using approved variables only—no animated motion or decorative scaling)
- Active / Pressed
- Focused (clear accessibility focus states without decorative outlines)
- Disabled
- Loading
- Success
- Error

Do not use:

- Decorative hover animations (e.g., card lifting, scale transitions, bounce effects)
- Animated arrows
- Decorative motion
- Unnecessary looping animations

Motion must strictly communicate state change, filtering updates, or contextual loading.

---

# 10. Loading States

Do not use skeleton loaders.

Use meaningful loading states instead.

Examples:

- Spinner
- Progress indicator
- Loading text
- Context-specific loading message

Loading feedback must clearly communicate current process.

---

# 11. Product Content Rules

Do not use fake testimonials.

Do not create fake:

- Reviews
- Ratings
- Customer quotes
- Usage statistics
- User avatars
- Social proof

Use real product content whenever available.

Do not create product showcase sections without real product demonstrations.

Product demos must show:

- Real screens
- Realistic application states
- Actual workflows
- Meaningful interactions

---

# 12. Pricing Rules

Do not automatically create three pricing tiers.

Avoid default structures such as:

- Basic
- Pro
- Enterprise

Only create pricing screens when required by actual product requirements.

Pricing structure must reflect real product offerings.

---

# 13. Legal Requirements

Do not omit:

- Terms of Service
- Privacy Policy

Provide access where applicable in web interface.

Possible locations:

- Desktop Footer
- User Account / Profile dropdown
- Settings panel
- Registration / Login pages

---

# 14. Content and Copy Rules

Do not use:

> "It's not X, it's Y."

Avoid artificial marketing language.

Use direct and specific copy.

Prefer:

- Clear labels
- Concrete actions
- Short descriptions
- Product-specific language

Do not use exaggerated claims.

Do not use checkmark bullets.

Use standard bullets, numbered lists, labels, or structured layouts instead.

---

# 15. UI Quality Standard

Every web page/screen should feel:

- Intentional
- Structured
- Consistent
- Product-focused
- Web-native and desktop-optimized

Avoid trendy UI elements without functional value.

Before adding any element, verify:

1. Does it use existing design variables?
2. Does it improve usability on web displays?
3. Does it communicate useful information?
4. Does it serve a real product purpose?

If not, do not add it.

---

# 16. Strict Prohibited List

Never use:

1. Colors outside `neutral`, `primary`, `secondary`, or `accent`
2. Harsh gradients
3. Lucide icons
4. Pure white backgrounds
5. Rainbow coloring
6. Drop shadows
7. Emojis
8. Liquid glass
9. Em dashes
10. Inter
11. Geist
12. Space Grotesk
13. Colored left stripes
14. Fake testimonials
15. Terminal window visuals
16. "It's not X, it's Y" copywriting
17. Checkmark bullets
18. Default three-tier pricing
19. Fake or missing product demos
20. Excessively soft corner radius
21. Purple and black color schemes
22. Skeleton loaders
23. Radial orbs
24. Dot grids
25. Sparkle icons
26. Animated arrows
27. Missing Terms of Service
28. Missing Privacy Policy
29. Decorative hover scale/lift animations
30. Neon colors
31. Generic pastel color palettes
32. Hardcoded or arbitrary colors
33. New semantic color variables outside approved color groups
34. Hardcoded or arbitrary spacing, margin, padding, or gap values outside defined design system tokens
35. Non-multiple-of-4 values for height, width, padding, or margin

---

# 17. Border and Hairline Rules

Never use borders or hairline borders.

Do not use:

- `border`
- `border-*`
- `border-[...]`
- `divide-*`
- 1px outlines
- Hairline separators
- Hairline rules
- Decorative lines
- Card outlines
- Input outlines used only for decoration
- Table cell borders

Do not use borders to create visual hierarchy or separate web layout panels.

Create hierarchy through:

- Spacing
- Typography
- Existing surface colors
- Background contrast
- Layout structure
- Component grouping

For interactive controls, use approved state styling without borders.

If an existing web component or library automatically adds a border (e.g., standard browser input borders, table borders, header borders), remove or override it.

Never introduce a new border variable or token.

This rule applies to every page, component, state, modal, form, navigation bar, sidebar, table, and panel.

---

# 18. Borderless UI Standard

All UI components must remain visually borderless unless a border is explicitly required by an existing product requirement.

Preferred structure:

- Borderless surfaces
- Clear spacing
- Strong typography hierarchy
- Approved color variables
- Surface contrast between panels (e.g., sidebar background vs. main content surface)
- Functional state indicators

Avoid using thin lines as a substitute for spacing or panel separation.

When separating content, prefer:

- Spacing
- Surface changes using approved variables
- Typography
- Section grouping

Do not add borders merely because a web component feels visually incomplete.

The absence of borders must remain consistent across the entire application.

---

# 19. Spacing and Gap Rules

Use only spacing, padding, margin, and gap values already defined in the project design system.

Do not create, invent, or approximate spacing values.

Do not use:

- Arbitrary spacing, padding, margin, or gap values
- Custom `px`, `rem`, or `em` spacing sizes
- Arbitrary Tailwind spacing utilities (e.g., `p-[...]`, `m-[...]`, `gap-[...]`)
- Inline hardcoded spacing or gap values
- Unstandardized spacing intervals

Always use existing spacing tokens, spacing variables, utilities, or design system scale.

If a required spacing or gap does not exist, reuse the closest existing approved value.

Never create a new spacing variable or token without an explicit design system update.

Maintain consistent vertical and horizontal rhythm across all desktop screens using defined spacing intervals.

---

# 20. 4-Point Grid and Sizing Rules

Always use multiples of 4 for all dimensions and spacing.

Mandatory 4-point grid rules apply strictly to:

- `height`
- `width`
- `padding`
- `margin`

All values for height, width, padding, and margin must be strict multiples of 4 (e.g., 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, etc.).

Do not use:

- Non-multiple-of-4 values (e.g., 2px, 6px, 10px, 14px, 18px, 22px)
- Odd-numbered values (e.g., 1px, 3px, 5px, 7px, 9px, 11px, 13px, 15px)
- Arbitrary hardcoded heights or widths (e.g., `h-[22px]`, `w-[35px]`)
- Arbitrary hardcoded padding or margins (e.g., `p-[10px]`, `m-[6px]`)
- Fractional or decimal values

If a specific dimension, padding, or margin is required, round to the nearest approved multiple of 4 defined in the project design system.

Interactive web targets must also follow the 4-point grid (minimum height/width aligned with design system tokens, e.g., 32px, 40px, or 48px).

---

# Final Rule

Use existing design system only.

Every color must come from:

`neutral` → structure, backgrounds, sidebars, panels, and default UI

`primary` → main actions and emphasis

`secondary` → supporting actions and emphasis

`accent` → limited highlights

Do not introduce new colors, fonts, visual effects, components, or design patterns without a real functional reason.

Do not introduce borders or hairlines.

Do not introduce custom or arbitrary spacing and gap values outside defined design system tokens.

Always use strict multiples of 4 for height, width, padding, and margin.

Consistency and usability take priority over decoration, trends, and visual novelty.