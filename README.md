# Briefix 🎲

> **Bridging the gap between stakeholders and designers.**  
> Transform campaign briefs into production-ready multilingual copywriting and automate Photoshop & Figma design task setups.

---

## 🌟 Workflow Overview

Briefix provides a streamlined 3-step studio to eliminate back-and-forth between marketing stakeholders and design teams:

1. **Step 1: Choose Brand**  
   - Distraction-free, minimal brand selection with instant real-time search.
   - Brand profiles and custom dimensions are managed exclusively inside `editor.html`.

2. **Step 2: Campaign Brief & Dimensions (Screen-Fitted UX)**  
   - High-density, single-screen layout with no vertical scrolling needed.
   - Campaign Title, CTA, and Subcopy / Terms.
   - Target Languages with optional **Headline** and **Sub-heading** lines.
   - Checked deliverable dimensions specific to the selected brand.
   - Click **Next: Campaign Preview & Export** to proceed.

3. **Step 3: Campaign Preview & Task Automation**  
   - Dedicated review page showing all regional copies, brand color swatches, and dimension safe zones.
   - **Generate Task**: Produces two automation scripts for designers:
     - 🎨 **Photoshop ExtendScript (`.jsx`)**: Prompts user to choose between **Artboards** or **Separate .PSB files** for each checked dimension, and asks to select the local project folder.
     - ❖ **Figma Script (`.js`)**: Automatically creates all checked dimension frames in Figma organized with spacing, dark fills, and safe-zone data.

---

## 📐 Brand & Dimension Studio (`editor.html`)

- Brand creation and file dimension customization are contained exclusively in `editor.html`.
- Add, edit, or duplicate brands with bespoke width & height asset dimensions, safe-zone guidelines, and custom color tokens.
- Export and import brand libraries via JSON.

---

## 🚀 Live Demo

- 🌐 **Briefix Studio:** [https://andronixOne1.github.io/Briefix/](https://andronixOne1.github.io/Briefix/)
- 📐 **Brand & Dimension Editor:** [https://andronixOne1.github.io/Briefix/editor.html](https://andronixOne1.github.io/Briefix/editor.html)

---

## 📄 License
MIT License.
