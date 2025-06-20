Container Queries bring component‑first responsive design to CSS.

## Basic Syntax

```css
@container sidebar (min-width: 400px) {
  .card { grid-template-columns: 1fr 3fr; }
}
```

### Steps to Use

1. Define a **container context**
   ```css
   .sidebar { container-type: inline-size; }
   ```
2. Write queries relative to the container, not the viewport.

#### Patterns

- **Card grids** that adapt within sidebars.
- **Search bars** that reveal advanced filters when wide enough.

---

_Last updated: 2025‑06‑19_
