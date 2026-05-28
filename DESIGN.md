# Lanka360 Design System

## Overview

Lanka360 uses a restrained logistics-style web surface: white canvas, black ink, and the existing Lanka360 green as the only brand accent. The goal is to feel direct, local, and utility-first. The interface should avoid blue accents, decorative gradients, heavy shadows, and mixed accent palettes.

The system is inspired by Uber's restraint, but not copied directly. Lanka360 keeps its green primary color for conversion actions, active states, and selected navigation. Black is used for deep contrast bands, headings, and high-emphasis surfaces. White carries the main page structure.

## Colors

- **Brand Green** `#1dcb79`: primary action color, active states, selected category rings, key highlights.
- **Brand Green Dark** `#108653`: hover state and darker supporting text when green is needed.
- **Ink** `#000000`: headings, primary text, dark bands, strong icons.
- **Canvas** `#ffffff`: page background and main surfaces.
- **Canvas Soft** `#efefef`: input rows, chips, subtle controls.
- **Canvas Softer** `#f3f3f3`: nested controls and quiet panels.
- **Body Text** `#5e5e5e`: secondary copy and metadata.
- **Muted Text** `#8a8a8a`: low-priority helper text.

Do not introduce blue, orange, purple, or red as brand accents. Use semantic colors only when needed for true statuses.

## Typography

Use the existing sans-serif stack as the product voice. The visual target is geometric, plain, and utilitarian.

- Headlines: sentence-case, weight 700, no letter spacing.
- Body: weight 400, 16px default, 24px line-height.
- Buttons and labels: weight 500, sentence-case.
- Avoid all-caps except short utility labels where already established.

## Shapes

- **Pills**: use `999px` radius for CTAs, search controls, chips, and small commands.
- **Cards**: use `16px` radius for main cards and content surfaces.
- **Inputs**: use `8px` radius, soft gray fill, no heavy border.
- **Icon badges**: prefer circular badges over clipped or decorative shapes.

## Components

### Primary Buttons

Use green pill buttons for the main action in a viewport.

- Background: Brand Green
- Text: Ink Black
- Radius: pill
- Weight: 500

### Secondary Buttons

Use soft gray or white pills.

- Background: Canvas Soft or Canvas
- Text: Ink Black
- Radius: pill
- Border only when necessary

### Cards

Cards are white with a 16px radius. Default cards should be flat or lightly bordered. Avoid stacking shadows across the page.

### Navigation

The header is white, sticky, and flat. Search uses a soft gray pill. The sidebar uses white and soft gray blocks with green active states.

### Category Cards

The five main category cards should appear consistently where category switching is important:

- Local Store Discovery
- Local Service Providers
- Sri Lankan Startups
- Tools and Product Hub
- Local Events

Use white card surfaces, circular soft icon badges, and green selected states.

## Layout

- Keep the page max width at the current large container size.
- Prefer clean two-column layouts on desktop.
- Keep spacing compact in operational pages.
- Use black bands for high-emphasis promotional areas, not gradients.
- Avoid decorative blobs, multicolor illustrations, and unnecessary visual effects.

## Do

- Keep green as the only accent color.
- Use white canvas and black text as the base.
- Use pill controls for actions.
- Use 16px rounded cards.
- Keep copy sentence-case and direct.

## Don't

- Do not use blue UI accents.
- Do not use multiple competing color themes.
- Do not use gradient or atmospheric backgrounds.
- Do not use heavy shadows on every card.
- Do not make operational screens feel like marketing landing pages.
