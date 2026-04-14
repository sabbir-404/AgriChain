/**
 * AgriChain — Full Screenshot Capture Script
 * Usage: node capture.js
 * Prerequisites: Vite dev server on :5173, backend on :3001, DB seeded
 *
 * Strategy: Real login via the API so JWT tokens and role-based routing work correctly.
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const BASE_URL  = 'http://localhost:5173';
const API_URL   = 'http://localhost:3001/api';

// ── Credentials for each role (from seed.js) ──────────────────────────────
const CREDS = {
  admin:      { email: 'admin@agrichain.com',     password: 'admin123' },
  farmer:     { email: 'rahim@agrichain.com',      password: 'agrichain123' },
  supplier:   { email: 'bashir@agrichain.com',     password: 'agrichain123' },
  warehouse:  { email: 'nasreen@agrichain.com',    password: 'agrichain123' },
  processing: { email: 'rafique@agrichain.com',    password: 'agrichain123' },
  quality:    { email: 'salma@agrichain.com',      password: 'agrichain123' },
  logistics:  { email: 'mosharraf@agrichain.com',  password: 'agrichain123' },
  market:     { email: 'jahangir@agrichain.com',   password: 'agrichain123' },
};

// ── All pages to capture, grouped by role ─────────────────────────────────
const PAGES = {

  // ── Public ────────────────────────────────────────────────────────────
  public: [
    { name: '01_Login',    url: '/login'    },
    { name: '02_Register', url: '/register' },
  ],

  // ── Admin ─────────────────────────────────────────────────────────────
  admin: [
    { name: '03_Admin_SystemOverview',     url: '/admin'                  },
    { name: '04_Admin_PredictiveAnalytics',url: '/admin/analytics'        },
    { name: '05_Admin_FarmerData',         url: '/admin/farmer-data'      },
    { name: '06_Admin_WarehouseData',      url: '/admin/warehouse-data'   },
    { name: '07_Admin_ProcessingData',     url: '/admin/processing-data'  },
    { name: '08_Admin_SupplierData',       url: '/admin/supplier-data'    },
    { name: '09_Admin_QualityData',        url: '/admin/quality-data'     },
    { name: '10_Admin_DeliveryData',       url: '/admin/delivery-data'    },
    { name: '11_Admin_MarketSales',        url: '/admin/market-data'      },
    { name: '12_Admin_BatchTraceability',  url: '/admin/batch-trace'      },
    { name: '13_Admin_UserManagement',     url: '/admin/users'            },
    { name: '14_Admin_SystemAlerts',       url: '/admin/alerts'           },
  ],

  // ── Farmer ────────────────────────────────────────────────────────────
  farmer: [
    { name: '15_Farmer_Dashboard',    url: '/farmer'          },
    { name: '16_Farmer_SowingLogs',   url: '/farmer/sowing'   },
    { name: '17_Farmer_Harvest',      url: '/farmer/harvest'  },
    { name: '18_Farmer_InputSupply',  url: '/farmer/inputs'   },
  ],

  // ── Supplier ──────────────────────────────────────────────────────────
  supplier: [
    { name: '19_Supplier_Dashboard',    url: '/supplier'        },
    { name: '20_Supplier_InputRecords', url: '/supplier/inputs' },
  ],

  // ── Warehouse Manager ─────────────────────────────────────────────────
  warehouse: [
    { name: '21_Warehouse_Overview',      url: '/warehouse'                 },
    { name: '22_Warehouse_Warehouses',    url: '/warehouse/warehouses'      },
    { name: '23_Warehouse_Inventory',     url: '/warehouse/inventory'       },
    { name: '24_Warehouse_StockMovement', url: '/warehouse/stock-movement'  },
    { name: '25_Warehouse_SensorMonitor', url: '/warehouse/sensors'         },
  ],

  // ── Processing Manager ────────────────────────────────────────────────
  processing: [
    { name: '26_Processing_Status',  url: '/processing'          },
    { name: '27_Processing_Plants',  url: '/processing/plants'   },
    { name: '28_Processing_Batches', url: '/processing/batches'  },
  ],

  // ── Quality Inspector ─────────────────────────────────────────────────
  quality: [
    { name: '29_Quality_Dashboard', url: '/quality'          },
    { name: '30_Quality_Reports',   url: '/quality/reports'  },
  ],

  // ── Logistics Manager ─────────────────────────────────────────────────
  logistics: [
    { name: '31_Logistics_Dashboard', url: '/logistics'           },
    { name: '32_Logistics_Delivery',  url: '/logistics/delivery'  },
  ],

  // ── Market Operator ───────────────────────────────────────────────────
  market: [
    { name: '33_Market_Dashboard', url: '/market'          },
    { name: '34_Market_Markets',   url: '/market/markets'  },
    { name: '35_Market_Sales',     url: '/market/sales'    },
  ],
};

const delay = ms => new Promise(r => setTimeout(r, ms));

// ── Real login via API, then inject token into localStorage ───────────────
async function loginAs(page, role) {
  const creds = CREDS[role];
  console.log(`  🔑 Logging in as ${role} (${creds.email})...`);
  try {
    const res = await axios.post(`${API_URL}/auth/login`, creds);
    const { token, user } = res.data;

    // Inject into the browser's localStorage
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((t, u) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, token, user);

    console.log(`  ✓ Logged in as ${user.first_name} ${user.last_name} [${user.role_type}]`);
  } catch (err) {
    console.error(`  ✗ Login failed for ${role}:`, err.message);
    throw err;
  }
}

async function clearSession(page) {
  await page.evaluate(() => localStorage.clear());
}

(async () => {
  const outDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Remove old screenshots so ordering is clean
  fs.readdirSync(outDir).filter(f => f.endsWith('.png')).forEach(f => {
    fs.unlinkSync(path.join(outDir, f));
  });
  console.log('🗑️  Cleared old screenshots.\n');

  console.log('🚀 Launching browser...');

  // Try Puppeteer's downloaded Chrome first; fall back to system Chrome on macOS
  const MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const launchOpts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  if (fs.existsSync(MAC_CHROME)) {
    launchOpts.executablePath = MAC_CHROME;
    console.log('  Using system Chrome →', MAC_CHROME);
  }

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ── 1. Public pages (no auth needed) ──────────────────────────────────
  console.log('\n📸 Capturing public pages...');
  for (const item of PAGES.public) {
    await page.goto(`${BASE_URL}${item.url}`, { waitUntil: 'networkidle0' });
    await delay(1200);
    await page.screenshot({ path: path.join(outDir, `${item.name}.png`), fullPage: true });
    console.log(`  ✓ ${item.name}`);
  }

  // ── 2. Role-gated pages ───────────────────────────────────────────────
  const ROLE_ORDER = ['admin', 'farmer', 'supplier', 'warehouse', 'processing', 'quality', 'logistics', 'market'];

  for (const role of ROLE_ORDER) {
    const pages = PAGES[role];
    if (!pages || pages.length === 0) continue;

    console.log(`\n📸 Capturing ${role} pages (${pages.length} screens)...`);
    await loginAs(page, role);

    for (const item of pages) {
      await page.goto(`${BASE_URL}${item.url}`, { waitUntil: 'networkidle0' });
      await delay(1800); // Allow charts (recharts) and animations to render
      await page.screenshot({ path: path.join(outDir, `${item.name}.png`), fullPage: true });
      console.log(`  ✓ ${item.name}`);
    }

    await clearSession(page);
  }

  await browser.close();

  const total = fs.readdirSync(outDir).filter(f => f.endsWith('.png')).length;
  console.log(`\n🎉 Done! ${total} screenshots saved to /screenshots`);
  console.log('   Run: node create-pdf.js  to compile into a PDF.\n');
})();
