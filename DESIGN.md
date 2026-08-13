# DESIGN.md - Glow Threads Background Effect Specification

This design specification document defines the visual layout, interaction principles, component structure, and implementation guidelines for integrating the **Glow Threads** WebGL background effect into a modern web design system.

---

## 1. Overview & Aesthetic Intent

**Glow Threads** is an animated, high-performance WebGL background effect designed for dark-mode, tech-forward, and modern SaaS / AI application interfaces.

* **Visual Style:** Fluid, organic, neon-luminous line bundles drifting across a dark canvas.
* **Atmosphere:** Dynamic, subtle, atmospheric depth without distracting from foreground content or hero call-to-actions.
* **Best Suited For:** Hero sections, pricing tiers, feature highlights, footer callouts, and landing page backdrops.

---

## 2. Design System Tokens & Parameters

### 2.1 Component Props Matrix

| Parameter | Type | Default Value | Recommended Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `colors` | `string[]` | `['#767676', '#f2f4f8', '#a6abb4']` | 3 Hex codes or `var(--token)` | Three-stop gradient palette used across thread bundles. |
| `background` | `string` | `var(--color-fx-canvas)` / `#0f1013` | Dark Hex / CSS Variable | Solid background canvas color behind WebGL rendering. |
| `speed` | `number` | `1` | `0.2` to `2.0` | Animation time multiplier controls movement velocity. |
| `count` | `number` | `9` | `3` to `14` | Total density of individual luminous threads per bundle. |

### 2.2 Color Palettes Examples

#### 現代科技 Electric Blue / Cyan Accent (Default Preset)
* **Background:** `#0a0e17`
* **Thread Stop 1:** `#38bdf8` (Sky Blue / Cyan)
* **Thread Stop 2:** `#eef4ff` (Soft Off-White Highlight)
* **Thread Stop 3:** `#2563eb` (Electric Blue)

#### Monochromatic Dark Metallic
* **Background:** `#0a0b0d`
* **Thread Stop 1:** `#767676`
* **Thread Stop 2:** `#f2f4f8`
* **Thread Stop 3:** `#a6abb4`

---

## 3. Structural Rules & DOM Layout Pattern

To ensure optimal accessibility, layer ordering, and zero visual layout shifts, the section hierarchy must strictly follow this structure:

```html
<section className="relative overflow-hidden">
  <!-- Background Layer -->
  <div className="absolute inset-0 z-0 pointer-events-none">
    <GlowThreads 
      colors={['#e86bd8', '#f5f0fa', '#8b5bd6']} 
      background="#0f1013" 
      speed={1} 
      count={9} 
    />
  </div>

  <!-- Content Layer (Lifted above WebGL canvas) -->
  <div className="relative z-10">
    <!-- Hero / Section Content -->
  </div>
</section>
```

### Layout Rules:
1. **Container Styling:** The parent `<section>` must have `position: relative` and `overflow: hidden` to clamp WebGL canvas borders.
2. **Layer Separation:** The background wrapper must be `absolute inset-0` with `pointer-events: none` to prevent interfering with button or form interactions.
3. **Z-Index Stack:** Background layer at `z-0`, content layer explicitly set to `z-10` (or higher).

---

## 4. Implementation Code Snippet

```tsx
import React from 'react';
import { GlowThreads } from '~/components/backgrounds/effects';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] overflow-hidden flex items-center justify-center bg-[#0f1013] text-white">
      {/* Glow Threads WebGL Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GlowThreads 
          colors={['#e86bd8', '#f5f0fa', '#8b5bd6']} 
          background="#0f1013" 
          speed={1} 
          count={9} 
        />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur-md">
          Agent-Ready Starter Kit
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight">
          Build modern Web Apps with AI
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          A production-ready background component designed for smooth WebGL performance and elegant visual appeal.
        </p>
      </div>
    </section>
  );
};
```

---

## 5. AI Agent Prompt Templates

When directing an AI coding assistant (Cursor, Claude Code, Copilot, etc.) to apply this design, use the following standardized prompts:

### Hero Integration Prompt:
> "Put Glow Threads (`app/components/backgrounds/effects/glow-threads.tsx`) behind the landing page hero section. Set the palette to `['#e86bd8', '#f5f0fa', '#8b5bd6']`, background color to `#0f1013`, speed to `1`, and count to `9`."

### Slower Section / Pricing Background Prompt:
> "Add Glow Threads background to the pricing section. Keep the movement subtle and slow (`speed={0.4}`, `count={6}`), using brand theme variables for colors."
