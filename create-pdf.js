/**
 * AgriChain — PDF Compiler
 * Usage: node create-pdf.js
 * Prerequisite: run  node capture.js  first to populate /screenshots
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// ── Page descriptions (shown below each screenshot in the PDF) ────────────
const DESCRIPTIONS = {
  // Public
  '01_Login':    'Secure authentication portal. Users sign in with their email and password; JWT tokens are issued per session and control role-based routing.',
  '02_Register': 'New user onboarding form. Supports all 8 roles: Farmer, Supplier, Warehouse Manager, Processing Manager, Quality Inspector, Logistics Manager, Market Operator, and Admin.',

  // Admin
  '03_Admin_SystemOverview':      'Admin System Overview dashboard — live statistics across all modules: total users, harvest batches, inventory volume, revenue, deliveries, and sales, with dynamic bar and pie charts.',
  '04_Admin_PredictiveAnalytics': 'Predictive analytics page showcasing AI-driven forecasting for harvest yields, inventory trends, and market price projections using live database data.',
  '05_Admin_FarmerData':          'Admin Farmer Data management — full CRUD for Harvest Batches and Sowing Logs with farmer/product dropdowns, dynamic bar charts for yield and sowing activity analysis.',
  '06_Admin_WarehouseData':       'Admin Warehouse Data management — full CRUD for Inventory Records, Stock Movements and Warehouses with batch/warehouse dropdowns and capacity visualisation charts.',
  '07_Admin_ProcessingData':      'Admin Processing Data management — full CRUD for Processing Batches and Processing Plants with harvest batch, plant and manager dropdowns, plus processing volume charts.',
  '08_Admin_SupplierData':        'Admin Supplier Data management — full CRUD for Input Supply Records with farmer & supplier dropdowns; cost-by-type and type-distribution pie charts.',
  '09_Admin_QualityData':         'Admin Quality Data management — full CRUD for Quality Inspection Reports with processing batch & inspector dropdowns; grading status and defect-level pie charts.',
  '10_Admin_DeliveryData':        'Admin Delivery Data management — full CRUD for Delivery Records with batch, market and logistics manager dropdowns; status distribution and deliveries-by-city charts.',
  '11_Admin_MarketSales':         'Admin Market & Sales management — dual-tab CRUD for Sales Records and Markets; revenue-by-market, revenue-by-product, market-type breakdown, and revenue-over-time line chart.',
  '12_Admin_BatchTraceability':   'Batch Traceability module — traces a harvest batch end-to-end: sowing → harvest → processing → quality → delivery → sale, displayed as a visual timeline.',
  '13_Admin_UserManagement':      'User Management — full CRUD for all system users across all 8 role types, with role badges and searchable table.',
  '14_Admin_SystemAlerts':        'System Alerts centre — global monitoring view showing inventory warnings, quality failures and delivery status issues.',

  // Farmer
  '15_Farmer_Dashboard':   'Farmer Hub dashboard — overview of active sowing logs, upcoming harvests, recent input supplies received, and production KPI cards.',
  '16_Farmer_SowingLogs':  'Sowing Logs page — records seed type, sowing date, expected harvest date and seed quantities used per plot; table with search.',
  '17_Farmer_Harvest':     'Harvest Batch page — tracks harvested quantity, product type, quality grade and harvest date for each batch submitted to the warehouse.',
  '18_Farmer_InputSupply': 'Input Supplies Received page — lists all fertilizer, seed and pesticide deliveries received from suppliers with cost and date.',

  // Supplier
  '19_Supplier_Dashboard':    'Supplier Portal dashboard — summary of all input supply records dispatched, total procurement cost and active farmer relationships.',
  '20_Supplier_InputRecords': 'Input Supply Records page — full list of supply deliveries made to farmers with input type, quantity, cost and delivery date.',

  // Warehouse
  '21_Warehouse_Overview':      'Warehouse Central Overview — live sensor readings, capacity utilisation bars, and inventory stock-status breakdown across all warehouses.',
  '22_Warehouse_Warehouses':    'Warehouses page — lists all registered warehouses with location (area/district), total capacity and current manager assignment.',
  '23_Warehouse_Inventory':     'Inventory management page — detailed stock table showing product, batch, quantity, shelf life, reorder level and stock-status badge per warehouse.',
  '24_Warehouse_StockMovement': 'Stock Movement log — records every inbound and outbound movement with from/to location, quantity removed, movement type and date.',
  '25_Warehouse_SensorMonitor': 'Sensor Monitor page — live temperature and humidity readings per warehouse sensor with time-series trend chart and alert thresholds.',

  // Processing
  '26_Processing_Status':  'Processing Manager status overview — batch pipeline with in-progress counts, plant utilisation and processing completion rate.',
  '27_Processing_Plants':  'Processing Plants page — lists milling/sorting plants with district, area, type and assigned manager.',
  '28_Processing_Batches': 'Batch Management page — tracks processing batches linking harvest batches to plants, with processing date and linked quality report status.',

  // Quality
  '29_Quality_Dashboard': 'Quality Control dashboard — pass/fail ratio donut chart, average moisture and purity metrics, and recent inspections summary.',
  '30_Quality_Reports':   'Quality Reports page — inspection records with moisture %, purity %, defect level and grading status badge per processed batch.',

  // Logistics
  '31_Logistics_Dashboard': 'Logistics overview — fleet summary, delivery status distribution (Pending / In Transit / Delivered), and route map.',
  '32_Logistics_Delivery':  'Delivery Management page — full delivery table with source/destination districts, transport date, assigned market and real-time status badge.',

  // Market
  '33_Market_Dashboard': 'Market Operator dashboard — total revenue KPIs, revenue-by-product bar chart, and recent sales activity feed.',
  '34_Market_Markets':   'Markets page — registered market locations with city, zone and market type (Wholesale / Retail / Export).',
  '35_Market_Sales':     'Sales Records page — all completed sales with product, market, date and sale price; running total shown at bottom of table.',
};

// ── Role section labels for the PDF table of contents heading ─────────────
const SECTION_LABELS = {
  '01': '🌐 PUBLIC PAGES',
  '03': '🛡️  ADMIN MODULE',
  '15': '🌾 FARMER MODULE',
  '19': '🚚 SUPPLIER MODULE',
  '21': '🏭 WAREHOUSE MODULE',
  '26': '⚙️  PROCESSING MODULE',
  '29': '🔬 QUALITY MODULE',
  '31': '🚛 LOGISTICS MODULE',
  '33': '🏪 MARKET MODULE',
};

async function generatePDF() {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    console.error('❌ /screenshots directory not found. Run  node capture.js  first.');
    process.exit(1);
  }

  const files = fs.readdirSync(screenshotsDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]));

  if (files.length === 0) {
    console.error('❌ No PNG files found in /screenshots. Run  node capture.js  first.');
    process.exit(1);
  }

  console.log(`📚 Building PDF from ${files.length} screenshots...`);

  // ── Build HTML ──────────────────────────────────────────────────────────
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; }

  /* ── Cover ── */
  .cover {
    height: 100vh;
    background: linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 60%, #1a3a2a 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 60px;
    page-break-after: always;
  }
  .cover-logo { font-size: 72px; font-weight: 800; color: #fff; letter-spacing: -2px; margin-bottom: 8px; }
  .cover-logo span { color: #f4a261; }
  .cover-sub { font-size: 22px; color: rgba(255,255,255,0.7); margin-bottom: 48px; }
  .cover-divider { width: 80px; height: 3px; background: #f4a261; border-radius: 2px; margin: 0 auto 36px; }
  .cover-meta { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 2; }
  .cover-badge {
    display: inline-block; margin-top: 32px;
    background: rgba(244,162,97,0.2); border: 1px solid rgba(244,162,97,0.5);
    border-radius: 24px; padding: 8px 24px;
    font-size: 13px; color: #f4a261; font-weight: 600; letter-spacing: 1px;
  }

  /* ── Section divider page ── */
  .section-page {
    height: 100vh;
    background: #f8f5ef;
    display: flex; align-items: center; justify-content: center;
    page-break-after: always; page-break-before: always;
    text-align: center; padding: 48px;
  }
  .section-page h2 { font-size: 42px; font-weight: 800; color: #1a3a2a; margin-bottom: 12px; }
  .section-page p  { font-size: 16px; color: #6b7280; }
  .section-stripe  { width: 60px; height: 4px; background: #f4a261; border-radius: 2px; margin: 20px auto; }

  /* ── Screenshot page ── */
  .screen-page {
    padding: 40px 36px 48px;
    page-break-after: always;
  }
  .screen-number { font-size: 11px; font-weight: 700; color: #f4a261; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .screen-title  { font-size: 26px; font-weight: 800; color: #1a3a2a; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
  .screen-desc   { font-size: 13px; line-height: 1.7; color: #4b5563; background: #f9fafb; border-left: 3px solid #2d6a4f; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
  .screen-img    { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .screen-img img { width: 100%; height: auto; display: block; }

  /* ── Back cover ── */
  .back-cover {
    height: 100vh;
    background: linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 60px;
  }
  .back-cover h2 { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 12px; }
  .back-cover p  { font-size: 15px; color: rgba(255,255,255,0.6); }
</style>
</head>
<body>

<!-- ── COVER PAGE ── -->
<div class="cover">
  <div class="cover-logo">Agri<span>Chain</span></div>
  <div class="cover-sub">Agricultural Inventory Management System</div>
  <div class="cover-divider"></div>
  <div class="cover-meta">
    Full Platform Interface Documentation<br>
    Generated: ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}<br>
    Total Screens: ${files.length}<br>
    System Version: v2.0
  </div>
  <div class="cover-badge">AGRICHAIN — FULL INTERFACE GUIDE</div>
</div>
`;

  let lastSection = null;

  for (const file of files) {
    const key  = file.replace('.png', '');           // e.g. "05_Admin_FarmerData"
    const num  = key.split('_')[0];                  // "05"
    const parts = key.split('_').slice(1);           // ["Admin","FarmerData"]
    const title = parts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2'); // "Admin Farmer Data"
    const desc  = DESCRIPTIONS[key] || `Detailed interface view for the ${title} page.`;

    // Inject section divider page when role changes
    if (SECTION_LABELS[num] && SECTION_LABELS[num] !== lastSection) {
      lastSection = SECTION_LABELS[num];
      html += `
<div class="section-page">
  <div>
    <h2>${SECTION_LABELS[num]}</h2>
    <div class="section-stripe"></div>
    <p>The following pages document all screens within this module.</p>
  </div>
</div>`;
    }

    const imgBase64 = fs.readFileSync(path.join(screenshotsDir, file)).toString('base64');
    const imgSrc    = `data:image/png;base64,${imgBase64}`;

    html += `
<div class="screen-page">
  <div class="screen-number">Screen ${num}</div>
  <div class="screen-title">${title}</div>
  <div class="screen-desc">${desc}</div>
  <div class="screen-img"><img src="${imgSrc}" alt="${title}" /></div>
</div>`;
  }

  // ── Back cover ─────────────────────────────────────────────────────────
  html += `
<div class="back-cover">
  <h2>AgriChain v2.0</h2>
  <p>Farm-to-Market Inventory Management Platform<br>Built with React · Node.js · Express · MySQL</p>
</div>

</body></html>`;

  // ── Render to PDF ───────────────────────────────────────────────────────
  console.log('🖨️  Rendering PDF (this may take ~30s for large image sets)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const pdfPage = await browser.newPage();
  await pdfPage.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });

  const pdfPath = path.join(process.cwd(), 'AgriChain_Platform_Guide.pdf');
  await pdfPage.pdf({
    path:            pdfPath,
    format:          'A4',
    printBackground: true,
    margin:          { top: '0', bottom: '0', left: '0', right: '0' },
  });

  await browser.close();
  console.log(`\n✅ PDF generated → ${pdfPath}`);
  console.log(`   ${files.length} pages + cover + section dividers + back cover`);
}

generatePDF().catch(err => {
  console.error('❌ PDF generation failed:', err.message);
  process.exit(1);
});
