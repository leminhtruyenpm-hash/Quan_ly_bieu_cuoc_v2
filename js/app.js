/**
 * Saigon Port Tariff Management System - Main Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global Application State
  const state = {
    currentView: "dashboard", // 'dashboard' | 'decision-tree' | 'simulator' | 'package-builder'
    selectedDecisionId: "qd-1812",
    selectedCategoryFilter: "All",
    searchQuery: "",
    currency: "VND",
    exchangeRate: 25400,
    priceTrendChart: null,
    // Builder draft items
    packageDraft: {
      packageName: "",
      segment: "Hàng Thép (Nhóm 3)",
      items: []
    }
  };

  // --- 1. INITIALIZATION ---
  initApp();

  function initApp() {
    setupNavigation();
    renderDecisionTreeSidebar();
    renderCurrentView();
    setupEventListeners();
  }

  // --- 2. NAVIGATION & VIEW SWITCHING ---
  function setupNavigation() {
    const navBtns = document.querySelectorAll(".nav-btn[data-view]");
    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        navBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentView = btn.getAttribute("data-view");
        renderCurrentView();
      });
    });

    // Global Currency Switcher
    const currSelect = document.getElementById("currencySelector");
    if (currSelect) {
      currSelect.value = state.currency;
      currSelect.addEventListener("change", (e) => {
        state.currency = e.target.value;
        renderCurrentView();
      });
    }
  }

  function renderCurrentView() {
    const mainContent = document.getElementById("mainContent");
    if (!mainContent) return;

    mainContent.innerHTML = "";

    switch (state.currentView) {
      case "dashboard":
        renderDashboard(mainContent);
        break;
      case "decision-tree":
        renderDecisionGrid(mainContent);
        break;
      case "simulator":
        renderSimulator(mainContent);
        break;
      case "package-builder":
        renderPackageBuilder(mainContent);
        break;
      default:
        renderDashboard(mainContent);
    }
  }

  // --- 3. SIDEBAR DECISION TREE ---
  function renderDecisionTreeSidebar() {
    const sidebar = document.getElementById("decisionTreeNav");
    if (!sidebar) return;

    sidebar.innerHTML = "";
    const decisions = window.TariffDB.decisions;

    // Separate root and child decisions
    const rootDecisions = decisions.filter(d => !d.parent_id);

    rootDecisions.forEach(root => {
      const itemEl = createDecisionItemEl(root, false);
      sidebar.appendChild(itemEl);

      // Find children
      const children = decisions.filter(d => d.parent_id === root.id);
      children.forEach(child => {
        const childEl = createDecisionItemEl(child, true);
        sidebar.appendChild(childEl);
      });
    });
  }

  function createDecisionItemEl(decision, isChild) {
    const div = document.createElement("div");
    div.className = `decision-tree-item ${isChild ? "child" : ""} ${decision.id === state.selectedDecisionId ? "active" : ""}`;
    
    let badgeClass = "badge-active";
    if (decision.status === "Draft") badgeClass = "badge-draft";
    if (decision.status === "Archived") badgeClass = "badge-archived";

    div.innerHTML = `
      <div class="flex-between" style="margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 0.9rem; color: #38bdf8;">${decision.decision_no}</span>
        <span class="badge ${badgeClass}">${decision.status}</span>
      </div>
      <div style="font-size: 0.78rem; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${decision.title}
      </div>
      <div class="flex-between" style="margin-top: 6px; font-size: 0.72rem; color: #94a3b8;">
        <span>Hiệu lực: ${decision.effective_date}</span>
        <span>${decision.currency}</span>
      </div>
    `;

    div.addEventListener("click", () => {
      state.selectedDecisionId = decision.id;
      renderDecisionTreeSidebar();
      if (state.currentView !== "decision-tree") {
        state.currentView = "decision-tree";
        document.querySelectorAll(".nav-btn[data-view]").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-view") === "decision-tree");
        });
      }
      renderCurrentView();
    });

    return div;
  }

  // --- 4. DASHBOARD VIEW ---
  function renderDashboard(container) {
    const activeDecisions = window.TariffDB.decisions.filter(d => d.status === "Active").length;
    const totalServices = window.TariffDB.services.length;
    const totalPackages = window.TariffDB.packages.length;
    const fuelTiers = window.TariffDB.fuelMatrix.length;

    container.innerHTML = `
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8;">📜</div>
          <div class="metric-info">
            <h3>${activeDecisions} / ${window.TariffDB.decisions.length}</h3>
            <p>Quyết định Hiệu lực / Tổng số</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">⚓</div>
          <div class="metric-info">
            <h3>${totalServices}</h3>
            <p>Hạng mục Dịch vụ Chuẩn</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(139, 92, 246, 0.2); color: #c084fc;">📦</div>
          <div class="metric-info">
            <h3>${totalPackages}</h3>
            <p>Gói Dịch vụ Thương mại</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">⛽</div>
          <div class="metric-info">
            <h3>${fuelTiers} Tiers</h3>
            <p>Bảng Phụ phí Dầu DO (QĐ 209)</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar & Master Data Search -->
      <div class="card flex-between">
        <div>
          <h3 style="font-size: 1rem; font-weight: 600;">Tra cứu Nhanh & Công cụ Biểu cước</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Gợi ý tự động 7 nhóm hàng ngoài Container & thao tác quy đổi năm mới</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary" id="btnSmartSearch">
            🔍 Smart Search 7 Nhóm Hàng
          </button>
          <button class="btn btn-success" id="btnOpenCloneWizard">
            ⚡ Clone & Dự phóng 2027
          </button>
          <button class="btn" id="btnOpenPdfModal">
            🖨️ Xuất PDF Trình ký
          </button>
        </div>
      </div>

      <!-- Trend Chart & Active Alerts -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
        <!-- Price Index Chart -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 Phân tích Biến động Chỉ số Đơn giá (Price Index 2024 - 2027)</div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Đơn vị: VNĐ/Đơn vị tính</span>
          </div>
          <div style="height: 280px; position: relative;">
            <canvas id="priceTrendChartCanvas"></canvas>
          </div>
        </div>

        <!-- System Alerts & Interpretations -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">⚠️ Cảnh báo & Căn cứ Pháp lý</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.82rem;">
            <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 0.6rem; border-radius: 4px;">
              <strong>QĐ 1812/QĐ-CSG:</strong> Biểu cước chuẩn 2026 đang áp dụng chính thức cho toàn cảng.
            </div>
            <div style="background: rgba(2, 132, 199, 0.1); border-left: 3px solid #0284c7; padding: 0.6rem; border-radius: 4px;">
              <strong>QĐ 209 (Nhiên liệu):</strong> Tự động tra 10 ngưỡng giá dầu DO khi lập báo giá.
            </div>
            <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 0.6rem; border-radius: 4px;">
              <strong>QĐ 210 (Tàu lai):</strong> Đơn giá Tàu lai 1.300-1.800HP đã điều chỉnh lên 11.500.000đ.
            </div>
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.6rem; border-radius: 4px;">
              <strong>Bảo toàn Lịch sử:</strong> Dữ liệu 2024 & 2025 đã khóa chỉnh sửa (Read-Only).
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Audit Trail -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📜 Lịch sử Thao tác & Audit Log Chi tiết</div>
          <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;" id="btnRefreshAudit">Làm mới</button>
        </div>
        <div class="data-table-wrapper">
          <table class="smart-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Quyết định</th>
                <th>Hành động</th>
                <th>Chi tiết thay đổi</th>
              </tr>
            </thead>
            <tbody>
              ${window.TariffDB.auditLogs.map(log => `
                <tr>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">${log.timestamp}</td>
                  <td><strong style="color: #38bdf8;">${log.user_id}</strong></td>
                  <td><span class="badge badge-active">${log.decision_no}</span></td>
                  <td><span class="badge badge-draft">${log.action}</span></td>
                  <td style="font-size: 0.82rem;">${log.payload}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Initialize Chart
    setTimeout(initPriceTrendChart, 50);

    // Bind Quick Action Listeners
    document.getElementById("btnSmartSearch")?.addEventListener("click", openSmartSearchModal);
    document.getElementById("btnOpenCloneWizard")?.addEventListener("click", openCloneWizardModal);
    document.getElementById("btnOpenPdfModal")?.addEventListener("click", openPdfModal);
    document.getElementById("btnRefreshAudit")?.addEventListener("click", () => renderDashboard(container));
  }

  function initPriceTrendChart() {
    const ctx = document.getElementById("priceTrendChartCanvas")?.getContext("2d");
    if (!ctx) return;

    if (state.priceTrendChart) {
      state.priceTrendChart.destroy();
    }

    state.priceTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Năm 2024 (QĐ 1510)', 'Năm 2025 (QĐ 1650)', 'Năm 2026 (QĐ 1812/210)', 'Dự phóng 2027 (+5%)'],
        datasets: [
          {
            label: "Xếp dỡ Cont 20' Full Giao thẳng (VNĐ)",
            data: [350000, 365000, 384000, 403200],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          },
          {
            label: "Xếp dỡ Cont 40' Full Giao thẳng (VNĐ)",
            data: [510000, 535000, 564000, 592200],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          },
          {
            label: "Tàu lai 1.300-1.800 HP (VNĐ x 10)",
            data: [1000000, 1050000, 1150000, 1207500],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } }
        },
        scales: {
          x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  // --- 5. SMART DATA GRID (DECISION TREE VIEW) ---
  function renderDecisionGrid(container) {
    const currentDecision = window.TariffDB.decisions.find(d => d.id === state.selectedDecisionId) || window.TariffDB.decisions[0];
    const isReadOnly = currentDecision.status === "Archived";

    // Categories filter
    const categories = ["All", ...new Set(window.TariffDB.services.map(s => s.category))];

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h2 style="font-size: 1.2rem; font-weight: 700; color: #38bdf8;">${currentDecision.decision_no}</h2>
              <span class="badge ${currentDecision.status === 'Active' ? 'badge-active' : (currentDecision.status === 'Draft' ? 'badge-draft' : 'badge-archived')}">${currentDecision.status}</span>
              ${currentDecision.parent_id ? `<span class="badge badge-draft">Kế thừa từ ${getDecisionNo(currentDecision.parent_id)}</span>` : `<span class="badge badge-active">Quyết định Gốc</span>`}
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${currentDecision.title}</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <label class="form-label" style="margin: 0;">Lọc nhóm:</label>
            <select class="form-select" id="gridCategoryFilter" style="width: auto;">
              ${categories.map(c => `<option value="${c}" ${c === state.selectedCategoryFilter ? 'selected' : ''}>${c}</option>`).join("")}
            </select>
            <button class="btn btn-secondary" id="btnExportGridExcel">📥 Export Excel</button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.8rem; color: var(--text-muted);">
          <span>💡 Ghi chú: Các dòng có đơn giá tô viền xanh ngọc là đơn giá **trực tiếp**. Các dòng nhạt là đơn giá **kế thừa** từ quyết định cha.</span>
          <span>Tiền tệ: <strong style="color: #38bdf8;">${state.currency}</strong> (Tỷ giá USD: ${state.exchangeRate.toLocaleString()} đ)</span>
        </div>

        <!-- Smart Grid Table -->
        <div class="data-table-wrapper">
          <table class="smart-table" id="decisionGridTable">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Dịch vụ</th>
                <th>Tên Dịch vụ / Mặt hàng</th>
                <th>Phân loại / Nhóm</th>
                <th>Phương án Tác nghiệp</th>
                <th>Đơn vị tính</th>
                <th>Nguồn đơn giá (Inheritance)</th>
                <th style="text-align: right;">Đơn giá Cơ sở (${state.currency})</th>
                <th style="text-align: center;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              ${renderGridRows(currentDecision, isReadOnly)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind event handlers
    document.getElementById("gridCategoryFilter")?.addEventListener("change", (e) => {
      state.selectedCategoryFilter = e.target.value;
      renderDecisionGrid(container);
    });

    document.getElementById("btnExportGridExcel")?.addEventListener("click", () => {
      exportGridToExcel(currentDecision);
    });

    // Inline edit handlers
    if (!isReadOnly) {
      container.querySelectorAll(".rate-input-inline").forEach(input => {
        input.addEventListener("change", (e) => {
          const serviceId = e.target.getAttribute("data-service-id");
          const newVal = parseFloat(e.target.value) || 0;
          updateInlineRate(currentDecision.id, serviceId, newVal);
        });
      });
    }
  }

  function getDecisionNo(id) {
    const d = window.TariffDB.decisions.find(item => item.id === id);
    return d ? d.decision_no : id;
  }

  function renderGridRows(currentDecision, isReadOnly) {
    let services = window.TariffDB.services;
    if (state.selectedCategoryFilter !== "All") {
      services = services.filter(s => s.category === state.selectedCategoryFilter);
    }

    return services.map((srv, idx) => {
      const rateObj = window.PricingEngine.findRateWithInheritance(currentDecision.id, srv.id);
      let displayRate = rateObj ? rateObj.rate : 0;
      if (state.currency === "USD") {
        displayRate = Math.round((displayRate / state.exchangeRate) * 100) / 100;
      }

      const isDirect = rateObj && rateObj.decision_id === currentDecision.id;

      return `
        <tr>
          <td style="color: var(--text-muted); text-align: center;">${idx + 1}</td>
          <td><code style="color: #c084fc; font-weight: 600;">${srv.service_code}</code></td>
          <td>
            <strong>${srv.service_name}</strong>
            ${srv.cargo_group ? `<span style="font-size: 0.72rem; color: #fbbf24; margin-left: 6px;">(Nhóm ${srv.cargo_group})</span>` : ''}
          </td>
          <td><span class="badge badge-active" style="font-size: 0.7rem;">${srv.category}</span></td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">${srv.method_type || 'N/A'}</td>
          <td style="text-align: center; color: #94a3b8;">${srv.unit}</td>
          <td>
            ${isDirect 
              ? `<span style="color: #34d399; font-weight: 600; font-size: 0.8rem;">📌 Bản gốc ${currentDecision.decision_no}</span>`
              : `<span style="color: #94a3b8; font-size: 0.8rem;">🌿 Kế thừa từ ${rateObj ? rateObj.decision_no : 'N/A'}</span>`}
          </td>
          <td style="text-align: right;">
            ${isReadOnly 
              ? `<strong style="color: #38bdf8;">${displayRate.toLocaleString()}</strong>`
              : `<input type="number" class="editable-cell rate-input-inline" data-service-id="${srv.id}" value="${displayRate}" style="width: 130px; text-align: right;">`}
          </td>
          <td style="text-align: center;">
            <button class="btn btn-secondary btn-test-calc" data-service-id="${srv.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
              ⚡ Thử tính giá
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function updateInlineRate(decisionId, serviceId, newRateVND) {
    const db = window.TariffDB;
    let rateEntry = db.rates.find(r => r.decision_id === decisionId && r.service_id === serviceId);

    const oldRate = rateEntry ? rateEntry.base_rate : 0;

    if (rateEntry) {
      rateEntry.base_rate = newRateVND;
      rateEntry.updated_at = new Date().toISOString().split('T')[0];
    } else {
      rateEntry = {
        id: "rate-" + Date.now(),
        decision_id: decisionId,
        service_id: serviceId,
        base_rate: newRateVND,
        updated_at: new Date().toISOString().split('T')[0]
      };
      db.rates.push(rateEntry);
    }

    // Record Audit Log
    const srv = db.services.find(s => s.id === serviceId);
    const dec = db.decisions.find(d => d.id === decisionId);
    db.auditLogs.unshift({
      id: "audit-" + Date.now(),
      user_id: "Chuyengia_Bieucuoc",
      action: "UPDATE_RATE",
      decision_no: dec ? dec.decision_no : decisionId,
      payload: `Cập nhật đơn giá ${srv ? srv.service_name : serviceId}: ${oldRate.toLocaleString()} -> ${newRateVND.toLocaleString()} đ`,
      timestamp: new Date().toLocaleString()
    });

    renderCurrentView();
  }

  // --- 6. PRICING SIMULATOR ENGINE VIEW ---
  function renderSimulator(container) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚡ Bộ máy Tính toán Báo giá Cơ sở (Pricing Engine Simulator)</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Tự động đệ quy truy vấn cây quyết định & áp dụng phụ phí biến động</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
          <!-- Simulator Inputs -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Chọn Dịch vụ / Mặt hàng:</label>
              <select class="form-select" id="simServiceSelect">
                ${window.TariffDB.services.map(s => `
                  <option value="${s.id}">${s.category} - ${s.service_name} (${s.unit})</option>
                `).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quyết định Biểu cước áp dụng:</label>
              <select class="form-select" id="simDecisionSelect">
                ${window.TariffDB.decisions.map(d => `
                  <option value="${d.id}" ${d.id === state.selectedDecisionId ? 'selected' : ''}>${d.decision_no} - ${d.title} (${d.status})</option>
                `).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Ngày Tàu cập bến dự kiến (Vessel Arrival Date):</label>
              <input type="date" class="form-input" id="simTargetDate" value="${new Date().toISOString().split('T')[0]}">
            </div>

            <div class="form-group">
              <label class="form-label">Giá dầu DO thị trường (đ/lít) - Tra QĐ 209:</label>
              <input type="number" class="form-input" id="simDoFuelPrice" value="20000" step="500">
            </div>

            <div class="form-group">
              <label class="form-label">Tính chất hàng hóa & Phụ phí (Modifiers):</label>
              <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 4px;">
                <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="simReeferNormal"> ❄️ Container Lạnh (15° đến 0°C) (+50%)
                </label>
                <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="simReeferDeep"> 🥶 Container Âm sâu (< 0°C) (+100%)
                </label>
                <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="simIMDG"> ☣️ Hàng nguy hiểm (IMDG) (+50% + 50k)
                </label>
                <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="simOOG"> 🏗️ Hàng Quá khổ/Quá tải (OOG) (+50% + 100k)
                </label>
              </div>
            </div>

            <button class="btn btn-success" id="btnRunCalculation" style="margin-top: 0.5rem; justify-content: center;">
              🧮 MÔ PHỎNG TÍNH TOÁN BÁO GIÁ
            </button>
          </div>

          <!-- Simulator Calculation Result Output -->
          <div class="card" style="background: rgba(15, 23, 42, 0.9); border-color: #0284c7;" id="simResultBox">
            <h3 style="font-size: 1rem; font-weight: 700; color: #38bdf8; margin-bottom: 1rem;">📊 KẾT QUẢ BÁO GIÁ CHI TIẾT</h3>
            <div id="simResultBody">
              <p style="color: var(--text-muted); font-size: 0.85rem;">Nhấn nút <strong>"Mô phỏng tính toán"</strong> để xem kết quả chi tiết.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById("btnRunCalculation")?.addEventListener("click", runPricingSimulation);
    // Initial run
    runPricingSimulation();
  }

  function runPricingSimulation() {
    const serviceId = document.getElementById("simServiceSelect").value;
    const decisionId = document.getElementById("simDecisionSelect").value;
    const targetDate = document.getElementById("simTargetDate").value;
    const doFuelPrice = parseFloat(document.getElementById("simDoFuelPrice").value) || 20000;
    const isReeferNormal = document.getElementById("simReeferNormal").checked;
    const isReeferDeep = document.getElementById("simReeferDeep").checked;
    const isIMDG = document.getElementById("simIMDG").checked;
    const isOOG = document.getElementById("simOOG").checked;

    const result = window.PricingEngine.calculateFinalRate(serviceId, {
      decisionId,
      targetDate,
      doFuelPrice,
      isReeferNormal,
      isReeferDeep,
      isIMDG,
      isOOG,
      targetCurrency: state.currency,
      exchangeRate: state.exchangeRate
    });

    const resultBody = document.getElementById("simResultBody");
    if (!resultBody) return;

    if (result.error) {
      resultBody.innerHTML = `<div style="color: #ef4444;">⚠️ ${result.error}</div>`;
      return;
    }

    resultBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.85rem;">
        <div style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px;">
          <div style="color: var(--text-muted);">Tên dịch vụ:</div>
          <strong style="color: #f8fafc; font-size: 0.95rem;">${result.service.service_name}</strong>
          <div style="font-size: 0.78rem; color: #94a3b8;">Đơn vị tính: ${result.service.unit} | Phương án: ${result.service.method_type || 'Tiêu chuẩn'}</div>
        </div>

        <div class="flex-between">
          <span>Quyết định truy vấn:</span>
          <span class="badge badge-active">${result.decision.decision_no}</span>
        </div>

        <div class="flex-between">
          <span>Nguồn gốc đơn giá gốc:</span>
          <span style="color: ${result.rateProvenance.is_inherited ? '#fbbf24' : '#34d399'}; font-weight: 600;">
            ${result.rateProvenance.is_inherited ? `🌿 Kế thừa từ ${result.rateProvenance.decision_no}` : `📌 Trực tiếp từ ${result.rateProvenance.decision_no}`}
          </span>
        </div>

        <div class="flex-between">
          <span>Đơn giá gốc chưa phụ phí:</span>
          <strong>${result.baseRate.toLocaleString()} VNĐ</strong>
        </div>

        ${result.appliedModifiers.length > 0 ? `
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 0.5rem; border-radius: 6px;">
            <div style="color: #c084fc; font-weight: 600; margin-bottom: 2px;">Phụ phí Modifiers áp dụng:</div>
            ${result.appliedModifiers.map(m => `<div>• ${m}</div>`).join("")}
            <div style="text-align: right; font-weight: bold; margin-top: 4px; color: #e9d5ff;">=> Đơn giá sau Modifiers: ${result.modifiedRate.toLocaleString()} VNĐ</div>
          </div>
        ` : ''}

        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.5rem; border-radius: 6px;">
          <div class="flex-between" style="color: #fbbf24; font-weight: 600;">
            <span>Phụ phí Dầu DO (Ngưỡng giá ${doFuelPrice.toLocaleString()} đ/lít):</span>
            <span>+ ${result.fuelSurchargeAmount.toLocaleString()} VNĐ</span>
          </div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Ghi chú: ${result.fuelTier.note}</div>
        </div>

        <div style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 2px dashed #0284c7; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">ĐƠN GIÁ BÁO GIÁ CUỐI CÙNG (${state.currency})</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8;">
            ${result.finalDisplayRate.toLocaleString()} ${state.currency}
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">(Chưa bao gồm thuế VAT 10% theo Điều 2 QĐ 1812)</div>
        </div>
      </div>
    `;
  }

  // --- 7. SERVICE PACKAGE BUILDER VIEW ---
  function renderPackageBuilder(container) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📦 Thiết lập Gói Dịch vụ Thương mại & Báo giá Logistics</div>
          <button class="btn btn-success" id="btnSavePackage">💾 Lưu Gói Báo Giá Mới</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; margin-top: 1rem;">
          <!-- Left: Catalog Services Picker -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <h3 style="font-size: 0.95rem; font-weight: 600; color: #38bdf8;">1. Chọn Dịch vụ Thành phần (Catalog)</h3>
            <div style="max-height: 450px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
              ${window.TariffDB.services.map(s => {
                const rateObj = window.PricingEngine.findRateWithInheritance(state.selectedDecisionId, s.id);
                const rate = rateObj ? rateObj.rate : 0;
                return `
                  <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-weight: 600; font-size: 0.85rem;">${s.service_name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${s.category} | ${rate.toLocaleString()} VNĐ/${s.unit}</div>
                    </div>
                    <button class="btn btn-secondary btn-add-pkg-item" data-service-id="${s.id}" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">+ Thêm vào Gói</button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Right: Package Configurator Zone -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 style="font-size: 0.95rem; font-weight: 600; color: #38bdf8;">2. Vùng Cấu hình Gói Báo Giá</h3>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Tên Gói Dịch vụ / Báo giá Khách hàng:</label>
                <input type="text" class="form-input" id="pkgNameInput" placeholder="Ví dụ: Gói Thép cuộn Tập đoàn Hoa Sen 2026" value="${state.packageDraft.packageName}">
              </div>
              <div class="form-group">
                <label class="form-label">Phân khúc Hàng hóa:</label>
                <select class="form-select" id="pkgSegmentSelect">
                  <option value="Hàng Thép (Nhóm 3)">Hàng Thép (Nhóm 3)</option>
                  <option value="Container Hàng hải">Container Hàng hải</option>
                  <option value="Hàng Rời & Xá (Nhóm 1)">Hàng Rời & Xá (Nhóm 1)</option>
                </select>
              </div>
            </div>

            <div class="data-table-wrapper">
              <table class="smart-table">
                <thead>
                  <tr>
                    <th>Tên Hạng mục</th>
                    <th>Giá Niêm yết (QĐ)</th>
                    <th>Đơn giá Thỏa thuận (Gói)</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody id="pkgDraftTableBody">
                  ${state.packageDraft.items.length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Chưa có hạng mục nào trong gói. Hãy chọn từ danh mục bên trái.</td></tr>
                  ` : state.packageDraft.items.map((item, idx) => `
                    <tr>
                      <td><strong>${item.service_name}</strong></td>
                      <td>${item.list_rate.toLocaleString()} VNĐ</td>
                      <td>
                        <input type="number" class="editable-cell pkg-rate-input" data-index="${idx}" value="${item.custom_rate}" style="width: 120px; text-align: right;">
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-remove-pkg-item" data-index="${idx}" style="color: #ef4444; padding: 0.2rem 0.5rem; font-size: 0.75rem;">Xóa</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <!-- Total Calculation Summary -->
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">TỔNG GIÁ GÓI THỎA THUẬN UY TÍN</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #34d399;" id="pkgTotalValue">
                  ${calculateDraftPkgTotal().toLocaleString()} VNĐ
                </div>
              </div>
              <span style="font-size: 0.78rem; color: #94a3b8;">Báo giá có hiệu lực đến: 31/12/2026</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll(".btn-add-pkg-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const srvId = e.target.getAttribute("data-service-id");
        addServiceToPkgDraft(srvId);
        renderPackageBuilder(container);
      });
    });

    container.querySelectorAll(".btn-remove-pkg-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        state.packageDraft.items.splice(idx, 1);
        renderPackageBuilder(container);
      });
    });

    container.querySelectorAll(".pkg-rate-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        state.packageDraft.items[idx].custom_rate = parseFloat(e.target.value) || 0;
        document.getElementById("pkgTotalValue").innerText = calculateDraftPkgTotal().toLocaleString() + " VNĐ";
      });
    });

    document.getElementById("pkgNameInput")?.addEventListener("input", (e) => {
      state.packageDraft.packageName = e.target.value;
    });

    document.getElementById("btnSavePackage")?.addEventListener("click", saveCurrentPackage);
  }

  function addServiceToPkgDraft(srvId) {
    const srv = window.TariffDB.services.find(s => s.id === srvId);
    if (!srv) return;

    const rateObj = window.PricingEngine.findRateWithInheritance(state.selectedDecisionId, srvId);
    const listRate = rateObj ? rateObj.rate : 0;

    state.packageDraft.items.push({
      service_id: srv.id,
      service_name: srv.service_name,
      list_rate: listRate,
      custom_rate: Math.round(listRate * 0.95) // Default 5% package discount
    });
  }

  function calculateDraftPkgTotal() {
    return state.packageDraft.items.reduce((sum, item) => sum + (parseFloat(item.custom_rate) || 0), 0);
  }

  function saveCurrentPackage() {
    if (!state.packageDraft.packageName) {
      alert("Vui lòng nhập tên gói dịch vụ!");
      return;
    }
    if (state.packageDraft.items.length === 0) {
      alert("Gói dịch vụ phải có ít nhất 1 hạng mục!");
      return;
    }

    const newPkg = {
      id: "pkg-" + Date.now(),
      package_name: state.packageDraft.packageName,
      segment: document.getElementById("pkgSegmentSelect").value,
      created_by: "Phòng Kinh doanh",
      valid_until: "2026-12-31",
      discount_note: "Gói tùy chỉnh ưu đãi thương mại",
      items: [...state.packageDraft.items]
    };

    window.TariffDB.packages.push(newPkg);
    alert("✅ Đã lưu gói dịch vụ " + newPkg.package_name + " thành công!");
    state.packageDraft = { packageName: "", segment: "Hàng Thép (Nhóm 3)", items: [] };
    renderCurrentView();
  }

  // --- 8. CLONE & FORECAST WIZARD (DỰ PHÓNG 2027) ---
  function openCloneWizardModal() {
    const modal = document.getElementById("modalCloneWizard");
    if (modal) modal.classList.add("open");
  }

  function closeCloneWizardModal() {
    const modal = document.getElementById("modalCloneWizard");
    if (modal) modal.classList.remove("open");
  }

  function executeCloneAndForecast() {
    const sourceDecId = document.getElementById("cloneSourceDecision").value;
    const factorPercent = parseFloat(document.getElementById("cloneRateFactor").value) || 5;
    const newDecNo = document.getElementById("cloneNewDecNo").value || "1888/QĐ-CSG-2027";

    const db = window.TariffDB;
    const newDecId = "qd-2027-draft";

    // 1. Create New Draft Decision
    const newDec = {
      id: newDecId,
      decision_no: newDecNo,
      issue_date: "2026-12-25",
      effective_date: "2027-01-01",
      expiry_date: "2027-12-31",
      currency: "VND",
      parent_id: sourceDecId,
      status: "Draft",
      title: `Biểu giá dịch vụ Cảng biển năm 2027 (Dự phóng tăng ${factorPercent}%)`,
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: `Quyết định biểu cước dự phóng năm 2027 quy đổi từ ${sourceDecNo} với hệ số ${factorPercent}%.`
    };

    db.decisions.push(newDec);

    // 2. Clone and Convert Rates
    db.services.forEach(srv => {
      const parentRateObj = window.PricingEngine.findRateWithInheritance(sourceDecId, srv.id);
      const oldRate = parentRateObj ? parentRateObj.rate : 0;
      const newRate = Math.round(oldRate * (1 + factorPercent / 100));

      db.rates.push({
        id: "rate-2027-" + srv.id,
        decision_id: newDecId,
        service_id: srv.id,
        base_rate: newRate,
        updated_at: "2026-12-25"
      });
    });

    // Record Audit
    db.auditLogs.unshift({
      id: "audit-" + Date.now(),
      user_id: "System_Forecast",
      action: "CLONE_TARIFF",
      decision_no: newDecNo,
      payload: `Tạo bản nháp biểu cước 2027 từ ${sourceDecNo} với tỷ lệ tăng ${factorPercent}%`,
      timestamp: new Date().toLocaleString()
    });

    closeCloneWizardModal();
    renderDecisionTreeSidebar();
    state.selectedDecisionId = newDecId;
    state.currentView = "decision-tree";
    renderCurrentView();
    alert("⚡ Đã khởi tạo thành công Bản nháp Biểu cước 2027! Bạn có thể chỉnh sửa trực tiếp (Override) đơn giá từng dòng trên bảng Smart Grid.");
  }

  // --- 9. ADMINISTRATIVE PDF RENDERER MODAL ---
  function openPdfModal() {
    const currentDecision = window.TariffDB.decisions.find(d => d.id === state.selectedDecisionId) || window.TariffDB.decisions[0];
    const pdfBody = document.getElementById("pdfDocumentContainer");
    if (!pdfBody) return;

    pdfBody.innerHTML = `
      <div class="pdf-document-preview">
        <!-- Official Administrative Header -->
        <table class="pdf-header-table">
          <tr>
            <td style="width: 45%; text-align: center;">
              <strong>CÔNG TY CP CẢNG SÀI GÒN</strong><br>
              <span style="font-size: 11px;">Số: ${currentDecision.decision_no}</span><br>
              -----------------------
            </td>
            <td style="width: 55%; text-align: center;">
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
              <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
              ---------------------------------------
            </td>
          </tr>
        </table>

        <!-- Document Title -->
        <div class="pdf-title-block">
          <h2>${currentDecision.title.toUpperCase()}</h2>
          <div style="font-size: 12px; font-style: italic;">(Ban hành kèm theo Quyết định số ${currentDecision.decision_no} ngày ${currentDecision.issue_date})</div>
        </div>

        <!-- Interpretations & Legal Bases -->
        <div class="pdf-section">
          <strong>I. CĂN CỨ VÀ QUY ĐỊNH CHUNG:</strong>
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            ${window.TariffDB.interpretations.map(interp => `
              <li style="margin-bottom: 4px;"><strong>${interp.section_ref}:</strong> ${interp.content_text}</li>
            `).join("")}
          </ul>
        </div>

        <!-- Rate Annex Table -->
        <div class="pdf-section">
          <strong>II. BẢNG ĐƠN GIÁ DỊCH VỤ CHI TIẾT (ÁP DỤNG TỪ ${currentDecision.effective_date}):</strong>
          <table class="pdf-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Dịch vụ / Mặt hàng</th>
                <th>Phương án tác nghiệp</th>
                <th>Đơn vị tính</th>
                <th>Đơn giá (${currentDecision.currency})</th>
              </tr>
            </thead>
            <tbody>
              ${window.TariffDB.services.map((srv, idx) => {
                const rateObj = window.PricingEngine.findRateWithInheritance(currentDecision.id, srv.id);
                const rate = rateObj ? rateObj.rate : 0;
                return `
                  <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td>${srv.service_name}</td>
                    <td>${srv.method_type || 'Tiêu chuẩn'}</td>
                    <td style="text-align: center;">${srv.unit}</td>
                    <td style="text-align: right; font-weight: bold;">${rate.toLocaleString()}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <!-- Official Signer Footer -->
        <table class="pdf-footer-table">
          <tr>
            <td style="width: 50%;">
              <strong>Nơi nhận:</strong><br>
              - Cục Hàng hải Việt Nam;<br>
              - Các Hãng tàu, Khách hàng;<br>
              - Luân VP, Kế toán, Khai thác.
            </td>
            <td style="width: 50%; text-align: center;">
              <em>Thành phố Hồ Chí Minh, ngày ${currentDecision.issue_date.split('-')[2]} tháng ${currentDecision.issue_date.split('-')[1]} năm ${currentDecision.issue_date.split('-')[0]}</em><br>
              <strong>KT. TỔNG GIÁM ĐỐC</strong><br>
              <strong style="color: #0284c7;">TỔNG GIÁM ĐỐC</strong><br><br><br><br>
              <strong>${currentDecision.signer}</strong>
            </td>
          </tr>
        </table>
      </div>
    `;

    const modal = document.getElementById("modalPdfPreview");
    if (modal) modal.classList.add("open");
  }

  function closePdfModal() {
    const modal = document.getElementById("modalPdfPreview");
    if (modal) modal.classList.remove("open");
  }

  // --- 10. SMART SEARCH 7 NHÓM HÀNG MODAL ---
  function openSmartSearchModal() {
    const modal = document.getElementById("modalSmartSearch");
    if (modal) modal.classList.add("open");
  }

  function closeSmartSearchModal() {
    const modal = document.getElementById("modalSmartSearch");
    if (modal) modal.classList.remove("open");
  }

  function handleCargoFuzzySearch(query) {
    const container = document.getElementById("smartSearchResult");
    if (!container) return;

    if (!query.trim()) {
      container.innerHTML = `<p style="color: var(--text-muted);">Nhập tên hàng hóa vào ô tìm kiếm ở trên để nhận gợi ý nhóm chuẩn.</p>`;
      return;
    }

    const q = query.toLowerCase();
    const matchedGroups = window.TariffDB.cargoGroups.filter(g => 
      g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    );

    if (matchedGroups.length === 0) {
      container.innerHTML = `<p style="color: #ef4444;">Không tìm thấy nhóm phù hợp với từ khóa "${query}".</p>`;
      return;
    }

    container.innerHTML = matchedGroups.map(g => {
      const srv = window.TariffDB.services.find(s => s.cargo_group === g.group_no);
      const rateObj = srv ? window.PricingEngine.findRateWithInheritance(state.selectedDecisionId, srv.id) : null;
      const rate = rateObj ? rateObj.rate : 0;

      return `
        <div style="background: var(--bg-card); border: 1px solid var(--primary); padding: 1rem; border-radius: 10px; margin-bottom: 0.75rem;">
          <div class="flex-between">
            <h4 style="color: #38bdf8; font-size: 1rem;">GỢI Ý: ${g.title}</h4>
            <span class="badge badge-active">Đơn giá chuẩn: ${rate.toLocaleString()} VNĐ/tấn</span>
          </div>
          <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 6px;">${g.description}</p>
        </div>
      `;
    }).join("");
  }

  // --- 11. EXCEL EXPORT FUNCTIONALITY ---
  function exportGridToExcel(decision) {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += `Decision No,Service Code,Service Name,Category,Method,Unit,Base Rate (${state.currency}),Source Decision\n`;

    window.TariffDB.services.forEach(srv => {
      const rateObj = window.PricingEngine.findRateWithInheritance(decision.id, srv.id);
      let rate = rateObj ? rateObj.rate : 0;
      if (state.currency === "USD") rate = Math.round((rate / state.exchangeRate) * 100) / 100;

      const source = rateObj ? rateObj.decision_no : 'N/A';
      csvContent += `"${decision.decision_no}","${srv.service_code}","${srv.service_name}","${srv.category}","${srv.method_type || ''}","${srv.unit}",${rate},"${source}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tariff_${decision.decision_no.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- 12. GENERAL EVENT LISTENERS ---
  function setupEventListeners() {
    // Clone wizard modal bindings
    document.getElementById("btnCloseCloneWizard")?.addEventListener("click", closeCloneWizardModal);
    document.getElementById("btnConfirmClone")?.addEventListener("click", executeCloneAndForecast);

    // PDF modal bindings
    document.getElementById("btnClosePdfModal")?.addEventListener("click", closePdfModal);
    document.getElementById("btnPrintPdfDoc")?.addEventListener("click", () => {
      window.print();
    });

    // Smart search modal bindings
    document.getElementById("btnCloseSmartSearch")?.addEventListener("click", closeSmartSearchModal);
    document.getElementById("cargoSearchInput")?.addEventListener("input", (e) => {
      handleCargoFuzzySearch(e.target.value);
    });
  }
});
