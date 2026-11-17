# Briefix 🎲

> **Bridging the gap between stakeholders and designers.**  
> Transform unstructured marketing briefs into production-ready copywriting, localized variants, brand color tokens, and pixel-precise asset dimensions.

---

## 🌟 Overview

In fast-paced marketing and design workflows (such as iGaming, sportsbooks, and high-frequency campaign studios), briefs written by marketing, CRM, or VIP teams often lack strict technical specifications. Meanwhile, designers need exact dimensions, aspect ratios, safe zones, compliant legal copy, and localized translations.

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
  - **Localization Engine**: Generates headline and CTA variants across German (DE), Finnish (FI), Portuguese (PT), Spanish (ES), Norwegian (NO), French (FR), Italian (IT), etc.
  - **Prompt Engineering**: Generates production-ready Midjourney / Magnific / Gemini 3D visual render prompts tuned to the brand's aesthetics.
  - **Designer Handover**:
    - One-click **Slack Markdown handover**.
    - Full **JSON Asset Package export** for Figma and Adobe Photoshop scripting pipelines.
    - Visual **Designer Spec Sheet** with aspect ratio wireframe simulations and safe-zone rules.
  - **AI Generation Engine**: Works right out of the box with built-in contextual heuristics, or optionally with a user's Google Gemini API key.

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
- Ships with 4 pre-configured iGaming brands:
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
   git clone https://github.com/YOUR_USERNAME/Briefix.git
   cd Briefix
   ```
2. Open `index.html` directly in your browser:
   - On Windows: double-click `index.html` or run:
     ```powershell
     Start-Process index.html
     ```
   - Or using any local static server:
     ```bash
     npx serve .
     # or
     python -m http.server 8000
     ```

### Deploying to GitHub Pages
1. Push this repository to your GitHub account.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live within minutes!

---

## 🛠️ Usage Workflow

1. **Open `index.html`**:
   - In **Step 1**, click on the brand you want to create assets for (e.g. *Upgaming*).
2. **Review Brand Formats & Brief**:
   - In **Step 2**, pick quick sample briefs or paste raw stakeholder copy.
   - Verify the required banner dimensions (dynamically populated from that brand's profile).
3. **Generate Structured Assets**:
   - Click **Generate Structured Assets**.
   - Review localized copy, color tokens, Midjourney prompts, and asset specs.
   - Click **Slack Markdown** to paste into your design channel, or **Export JSON** for automated asset templating.
4. **Need a New Brand or New Dimensions?**
   - Click **Brand & Dimension Editor** in the top navigation or go to `editor.html`.
   - Add a new brand or edit existing dimensions at any time!

---

## 📄 License
MIT License. Feel free to customize and expand for your team's workflow!
