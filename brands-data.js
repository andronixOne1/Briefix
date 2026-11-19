/**
 * Briefix - Shared Brand Data & Storage Layer
 * Manages brands and their individual file dimensions in LocalStorage.
 */

const DEFAULT_BRANDS = [
    {
        id: "upgaming",
        name: "Upgaming",
        slug: "upgaming",
        category: "iGaming Platform & Casino",
        market: "Curacao (Global)",
        tone: "Modern, dynamic, high-tech cyberpunk with high roller appeal",
        logo: null,
        guidelines: "High-contrast dark mode designs. Prominent jackpot meters, vivid particle effects, and clear 18+ compliance badges in footer.",
        languages: ["EN", "DE", "FI", "PT", "ES"],
        dimensions: [
            { id: "dim_1", name: "Desktop Hero Banner", width: 1920, height: 1080, ratio: "16:9", safeZone: "Keep CTA and main slot art in central 80%; leave 120px footer for license.", defaultSelected: true },
            { id: "dim_2", name: "Square Feed Banner", width: 1080, height: 1080, ratio: "1:1", safeZone: "Center focal subject, 10% padding on all edges for social feeds.", defaultSelected: true },
            { id: "dim_3", name: "Mobile Story / TikTok", width: 1080, height: 1920, ratio: "9:16", safeZone: "Top 250px and bottom 300px clear of vital copy for native UI overlays.", defaultSelected: true },
            { id: "dim_4", name: "Leaderboard Banner", width: 728, height: 90, ratio: "8:1", safeZone: "Horizontal layout: Logo on left, headline center, CTA on far right.", defaultSelected: true },
            { id: "dim_5", name: "Affiliate Skyscraper", width: 160, height: 600, ratio: "1:3.75", safeZone: "Vertical stack: Brand header, offer details, pulse CTA button at bottom.", defaultSelected: false },
            { id: "dim_6", name: "CRM Email Header", width: 600, height: 300, ratio: "2:1", safeZone: "Optimized for mobile email clients, bold typography under 40 characters.", defaultSelected: false }
        ]
    },
    {
        id: "mystake",
        name: "MyStake",
        slug: "mystake",
        category: "Sportsbook & Online Casino",
        market: "Tier-1 International",
        tone: "Bold, adrenaline-fueled, energetic red & gold sports casino vibe",
        logo: null,
        guidelines: "Action-oriented imagery, live odds ticker badges, high saturation visuals, bold condensed typography.",
        languages: ["EN", "DE", "FR", "ES", "IT"],
        dimensions: [
            { id: "dim_1", name: "Homepage Promo Slider", width: 1920, height: 600, ratio: "3.2:1", safeZone: "Left 60% for copy & CTA, right 40% for character/game artwork.", defaultSelected: true },
            { id: "dim_2", name: "Game Card Thumbnail", width: 400, height: 300, ratio: "4:3", safeZone: "Clear badge space in top-left for 'NEW' or 'EXCLUSIVE' tag.", defaultSelected: true },
            { id: "dim_3", name: "Mobile App Push Rich Media", width: 1024, height: 512, ratio: "2:1", safeZone: "High readability at small sizes, maximum 6 words on headline.", defaultSelected: true },
            { id: "dim_4", name: "Instagram Story Reel", width: 1080, height: 1920, ratio: "9:16", safeZone: "Keep offer text centered, swipe-up clearance at bottom 15%.", defaultSelected: true },
            { id: "dim_5", name: "Sticky Mobile Footer", width: 320, height: 50, ratio: "6.4:1", safeZone: "Compact 1-line text with prominent high-contrast 'Claim' button.", defaultSelected: false }
        ]
    },
    {
        id: "casinok",
        name: "CasinoK",
        slug: "casinok",
        category: "VIP & Live Dealer Casino",
        market: "MGA (Malta)",
        tone: "Premium, sophisticated, luxury emerald and champagne aesthetics",
        logo: null,
        guidelines: "Minimalist elegance with VIP undertones. Restrained neon, golden bokeh light trails, and subtle textures.",
        languages: ["EN", "DE", "NO", "SV", "FI"],
        dimensions: [
            { id: "dim_1", name: "VIP Lobby Hero", width: 1600, height: 650, ratio: "2.46:1", safeZone: "Focus on live dealer realism, generous breathing room around typography.", defaultSelected: true },
            { id: "dim_2", name: "Square Social Ad", width: 1080, height: 1080, ratio: "1:1", safeZone: "Gold border framing, central 75% focus area.", defaultSelected: true },
            { id: "dim_3", name: "Mobile Story / Reel", width: 1080, height: 1920, ratio: "9:16", safeZone: "Full-bleed background, central message with VIP badge.", defaultSelected: true },
            { id: "dim_4", name: "Affiliate Billboard", width: 970, height: 250, ratio: "3.88:1", safeZone: "Premium gold gradients, high contrast text for partner placements.", defaultSelected: true },
            { id: "dim_5", name: "Live Casino Table Card", width: 640, height: 480, ratio: "4:3", safeZone: "Dealer photo framing, bet limit badge top right.", defaultSelected: false }
        ]
    },
    {
        id: "goldendice",
        name: "GoldenDice",
        slug: "goldendice",
        category: "Crypto Casino & Arcade",
        market: "Web3 / Global",
        tone: "Playful, cutting-edge crypto gaming with purple neon and electric amber",
        logo: null,
        guidelines: "Futuristic crypto gamification style with coin explosions, dice isometric visuals, and glowing typography.",
        languages: ["EN", "JA", "KO", "ES", "PT"],
        dimensions: [
            { id: "dim_1", name: "Desktop Hero (1920x1080)", width: 1920, height: 1080, ratio: "16:9", safeZone: "Keep dynamic crypto coins within safe center zone.", defaultSelected: true },
            { id: "dim_2", name: "Telegram Community Promo", width: 1280, height: 720, ratio: "16:9", safeZone: "Clear bold title readable at mobile Telegram preview sizes.", defaultSelected: true },
            { id: "dim_3", name: "Square NFT / Promo Banner", width: 1080, height: 1080, ratio: "1:1", safeZone: "Vibrant neon borders, coin token graphics.", defaultSelected: true },
            { id: "dim_4", name: "Mobile Story (1080x1920)", width: 1080, height: 1920, ratio: "9:16", safeZone: "Engaging vertical motion layout with countdown timer zone.", defaultSelected: true }
        ]
    }
];

const STORAGE_KEY = 'briefix_brands_v1';
const SELECTED_BRAND_KEY = 'briefix_selected_brand_id';

const BrandStorage = {
    // Get all brands
    getAll() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            this.saveAll(DEFAULT_BRANDS);
            return DEFAULT_BRANDS;
        }
        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                this.saveAll(DEFAULT_BRANDS);
                return DEFAULT_BRANDS;
            }
            return parsed;
        } catch (e) {
            console.error("Failed to parse stored brands, resetting to default:", e);
            this.saveAll(DEFAULT_BRANDS);
            return DEFAULT_BRANDS;
        }
    },

    // Save all brands
    saveAll(brands) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    },

    // Get single brand by id
    getById(id) {
        const brands = this.getAll();
        return brands.find(b => b.id === id) || brands[0] || null;
    },

    // Save or update brand
    saveBrand(brand) {
        const brands = this.getAll();
        const index = brands.findIndex(b => b.id === brand.id);
        if (index >= 0) {
            brands[index] = brand;
        } else {
            brands.push(brand);
        }
        this.saveAll(brands);
        return brand;
    },

    // Delete brand
    deleteBrand(id) {
        let brands = this.getAll();
        brands = brands.filter(b => b.id !== id);
        if (brands.length === 0) {
            brands = JSON.parse(JSON.stringify(DEFAULT_BRANDS));
        }
        this.saveAll(brands);
        // Clear selected brand if it was the deleted one
        if (this.getSelectedBrandId() === id) {
            this.setSelectedBrandId(brands[0].id);
        }
        return brands;
    },

    // Reset to defaults
    resetToDefaults() {
        this.saveAll(DEFAULT_BRANDS);
        return DEFAULT_BRANDS;
    },

    // Get selected brand ID
    getSelectedBrandId() {
        return localStorage.getItem(SELECTED_BRAND_KEY) || (this.getAll()[0]?.id || "upgaming");
    },

    // Set selected brand ID
    setSelectedBrandId(id) {
        localStorage.setItem(SELECTED_BRAND_KEY, id);
    },

    // Export brands to JSON string
    exportJSON() {
        const brands = this.getAll();
        return JSON.stringify(brands, null, 2);
    },

    // Import brands from JSON string
    importJSON(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Imported data must be an array of brands with at least 1 brand.");
            }
            // Basic validation
            for (const b of data) {
                if (!b.id || !b.name) {
                    throw new Error("Invalid brand entry: Missing id or name.");
                }
                if (!Array.isArray(b.dimensions)) {
                    b.dimensions = [];
                }
            }
            this.saveAll(data);
            return { success: true, count: data.length };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
};

// ==========================================
// DEFAULT TASK TYPES & DELIVERY TIME STORAGE
// ==========================================

const DEFAULT_TASK_TYPES = [
    { id: "type_banner", name: "Banner", days: 1 },
    { id: "type_webpage", name: "Web Page", days: 3 },
    { id: "type_2d_motion", name: "2D Motion", days: 2 },
    { id: "type_3d_motion", name: "3D Motion", days: 4 },
    { id: "type_thumbnail", name: "Thumbnail", days: 0.5 },
    { id: "type_anim_thumbnail", name: "Animated Thumbnail", days: 1.5 }
];

const TASK_TYPES_STORAGE_KEY = 'briefix_task_types_v1';

const TaskTypeStorage = {
    getAll() {
        const stored = localStorage.getItem(TASK_TYPES_STORAGE_KEY);
        if (!stored) {
            this.saveAll(DEFAULT_TASK_TYPES);
            return JSON.parse(JSON.stringify(DEFAULT_TASK_TYPES));
        }
        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                this.saveAll(DEFAULT_TASK_TYPES);
                return JSON.parse(JSON.stringify(DEFAULT_TASK_TYPES));
            }
            return parsed;
        } catch (e) {
            console.error("Failed to parse task types, resetting to default:", e);
            this.saveAll(DEFAULT_TASK_TYPES);
            return JSON.parse(JSON.stringify(DEFAULT_TASK_TYPES));
        }
    },

    saveAll(types) {
        localStorage.setItem(TASK_TYPES_STORAGE_KEY, JSON.stringify(types));
    },

    addType(name, days) {
        const types = this.getAll();
        const newType = {
            id: 'type_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: name.trim(),
            days: Math.max(0, parseFloat(days) || 0)
        };
        types.push(newType);
        this.saveAll(types);
        return newType;
    },

    updateType(id, name, days) {
        const types = this.getAll();
        const idx = types.findIndex(t => t.id === id);
        if (idx >= 0) {
            types[idx].name = name.trim() || types[idx].name;
            types[idx].days = Math.max(0, parseFloat(days) || 0);
            this.saveAll(types);
        }
        return types;
    },

    deleteType(id) {
        const types = this.getAll().filter(t => t.id !== id);
        this.saveAll(types);
        return types;
    },

    resetToDefaults() {
        const defaults = JSON.parse(JSON.stringify(DEFAULT_TASK_TYPES));
        this.saveAll(defaults);
        return defaults;
    },

    formatDays(days) {
        const rounded = Math.round((parseFloat(days) || 0) * 100) / 100;
        return rounded === 1 ? '1 day' : `${rounded} days`;
    }
};

// Export to global window scope for ease of use in static HTML
window.BrandStorage = BrandStorage;
window.DEFAULT_BRANDS = DEFAULT_BRANDS;
window.TaskTypeStorage = TaskTypeStorage;
window.DEFAULT_TASK_TYPES = DEFAULT_TASK_TYPES;
