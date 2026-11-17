# Briefix 🎲

> **Bridging the gap between stakeholders and designers.**  
> Transform campaign briefs into production-ready copywriting, multilingual headline and sub-heading variants, brand color tokens, and pixel-precise asset dimensions.

---

## 🌟 Overview

In fast-paced marketing and design workflows (such as iGaming, sportsbooks, and digital marketing studios), briefs written by marketing, CRM, or VIP teams often lack strict technical specifications. Meanwhile, designers need exact dimensions, aspect ratios, safe zones, compliant legal copy, and targeted regional copy.

**Briefix** bridges this gap in two seamless steps, backed by an individual brand and file dimension manager.

---

## 🚀 Key Features

### 1. Two-Step Studio (`index.html`)
- **Step 1: Choose Your Brand**
  - Interactive brand catalog showing brand identities, market jurisdictions (Curacao, MGA, UKGC, etc.), tone of voice, palette chips, and configured dimension counts.
  - Search and filter across brands.
  - Direct link to add or configure new brands.
- **Step 2: Brief-to-Asset Studio**
  - **Context-Aware Inheritance**: Automatically loads the brand's tone, color tokens, and regulatory guidelines.
  - **Dynamic Brand Dimensions**: Renders checkboxes for the selected brand's *individual file dimensions* (e.g. Desktop Hero, Square Feed, Mobile Story, Leaderboard, CRM Email Header, etc.).
  - **Multilingual Content Manager (No AI Translator Needed!)**:
    - Add any target language (e.g., English, German, Finnish, Portuguese, Spanish, French, Norwegian, etc.) using the **Add Language** button.
    - Each language has dedicated **Headline** and **Sub-heading** fields.
    - Both headline and sub-heading fields are **completely optional and can stay empty**.
  - **Instant Client-Side Compilation**:
    - Zero latency, pure client-side processing, no external API keys required.
    - Generates a structured campaign package instantly.
  - **Designer Handover**:
    - One-click **Slack Markdown handover** containing all language headlines & sub-headings.
    - Full **JSON Asset Package export** for Figma and Adobe Photoshop scripting pipelines.
    - Visual **Designer Spec Sheet** with aspect ratio wireframe simulations and safe-zone rules.

---

### 2. Brand & Dimension Studio (`editor.html`)
- **Individual File Dimensions Builder**:
  - Add, edit, and manage custom formats for every brand independently (e.g. `1920×1080`, `1080×1920`, `1080×1080`, `728×90`, `300×250`, etc.).
  - Auto-calculates aspect ratios (`16:9`, `1:1`, `9:16`, `8:1`).
  - Configure per-format safe zone notes (e.g., *"Keep CTA in center 80%, leave 120px for regulatory license"*).
  - Toggle formats enabled by default in the studio.
  - Quick-preset buttons for popular advertising sizes.
- **Brand Identity Management**:
  - Customize Brand Name, Category, Market/Jurisdiction, and Tone of Voice.
  - Set custom color tokens with color picker and HEX/RGB syncing.
  - Duplicate existing brands with 1 click.
  - Backup & restore brand libraries via JSON import/export.

---

### 3. Data & Storage Architecture (`brands-data.js`)
- Standardized data layer persisted in browser `localStorage`.
- Ships with 4 pre-configured brands:
  1. **Upgaming** (Cyberpunk Neon Cyan & Magenta, 6 custom formats)
  2. **MyStake** (Sports & Casino Blaze Red & Gold, 5 custom formats)
  3. **CasinoK** (VIP Emerald & Champagne Gold, 5 custom formats)
  4. **GoldenDice** (Crypto Arcade Purple & Electric Amber, 4 custom formats)

---

## 📂 Project Structure

```
Briefix/
├── index.html        # Main two-step studio (Brand selection -> Asset generation)
├── editor.html       # Brand manager & individual file dimensions editor
├── brands-data.js    # Data storage, schema defaults, and persistence layer
├── README.md         # Documentation & guide
└── .gitignore        # Git ignore rules
```

---

## 💻 Getting Started

No build step or Node.js environment is required. Briefix is built as a pure modern static web application using Tailwind CSS CDN, Inter font, and FontAwesome.

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/andronixOne1/Briefix.git
   cd Briefix
   ```
2. Open `index.html` directly in your browser:
   - On Windows: double-click `index.html` or run:
     ```powershell
     Start-Process index.html
     ```

---

## 📄 License
MIT License. Feel free to customize and expand for your team's workflow!
