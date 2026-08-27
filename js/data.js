/**
 * Saigon Port Tariff Management System - Initial Data Store
 * Contains Master Data, Decision Trees, Rate Tables, Modifiers, Fuel Matrix, Packages & Audit Logs.
 */

window.TariffDB = {
  // 1. Tariff Master / Decision Tree
  decisions: [
    {
      id: "qd-1812",
      decision_no: "1812/QĐ-CSG",
      issue_date: "2025-12-23",
      effective_date: "2026-01-01",
      expiry_date: "2026-12-31",
      currency: "VND",
      parent_id: null, // Decision Gốc
      status: "Active",
      title: "Biểu giá dịch vụ Cảng biển năm 2026 (Thanh toán bằng đồng Việt Nam)",
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: "Quyết định ban hành biểu cước khung chuẩn áp dụng cho toàn hệ thống Cảng Sài Gòn năm 2026."
    },
    {
      id: "qd-209",
      decision_no: "209/QĐ-CSG",
      issue_date: "2026-02-15",
      effective_date: "2026-03-01",
      expiry_date: "2026-12-31",
      currency: "VND",
      parent_id: "qd-1812", // Nhánh điều chỉnh Phụ phí Nhiên liệu
      status: "Active",
      title: "Quyết định Điều chỉnh & Bổ sung Phụ phí Biến động Giá Dầu DO",
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: "Điều chỉnh cơ chế tính phụ phí nhiên liệu DO theo bảng 10 ngưỡng biến động thực tế thị trường."
    },
    {
      id: "qd-210",
      decision_no: "210/QĐ-CSG",
      issue_date: "2026-03-10",
      effective_date: "2026-04-01",
      expiry_date: "2026-12-31",
      currency: "VND",
      parent_id: "qd-1812", // Nhánh điều chỉnh Dịch vụ Tàu lai
      status: "Active",
      title: "Quyết định Bổ sung & Điều chỉnh Đơn giá Dịch vụ Tàu hỗ trợ (Tàu lai)",
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: "Cập nhật đơn giá tàu lai hỗ trợ lượt vào/ra cho các phân khúc công suất tàu."
    },
    {
      id: "qd-1650",
      decision_no: "1650/QĐ-CSG",
      issue_date: "2024-12-20",
      effective_date: "2025-01-01",
      expiry_date: "2025-12-31",
      currency: "VND",
      parent_id: null,
      status: "Archived",
      title: "Biểu giá dịch vụ Cảng biển năm 2025",
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: "Biểu cước lịch sử năm 2025 (Đã khóa dữ liệu - Read Only)."
    },
    {
      id: "qd-1510",
      decision_no: "1510/QĐ-CSG",
      issue_date: "2023-12-25",
      effective_date: "2024-01-01",
      expiry_date: "2024-12-31",
      currency: "VND",
      parent_id: null,
      status: "Archived",
      title: "Biểu giá dịch vụ Cảng biển năm 2024",
      signer: "Nguyễn Lê Chơn Tâm",
      position: "Tổng Giám đốc",
      description: "Biểu cước lịch sử năm 2024 (Đã khóa dữ liệu - Read Only)."
    }
  ],

  // 2. Service Catalog (Danh mục dịch vụ chuẩn & Master Data 7 nhóm hàng)
  services: [
    // Container Services
    { id: "srv-cont-20-f-gt", service_code: "XD_CONT_20_FULL_GT", service_name: "Xếp dỡ Container 20 feet (Có hàng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 20, is_full: true, method_type: "Giao thẳng (Tàu <-> Xe)", cargo_group: null },
    { id: "srv-cont-20-f-tb", service_code: "XD_CONT_20_FULL_TB", service_name: "Xếp dỡ Container 20 feet (Có hàng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 20, is_full: true, method_type: "Tàu <-> Bãi", cargo_group: null },
    { id: "srv-cont-40-f-gt", service_code: "XD_CONT_40_FULL_GT", service_name: "Xếp dỡ Container 40 feet (Có hàng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 40, is_full: true, method_type: "Giao thẳng (Tàu <-> Xe)", cargo_group: null },
    { id: "srv-cont-40-f-tb", service_code: "XD_CONT_40_FULL_TB", service_name: "Xếp dỡ Container 40 feet (Có hàng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 40, is_full: true, method_type: "Tàu <-> Bãi", cargo_group: null },
    { id: "srv-cont-45-f-gt", service_code: "XD_CONT_45_FULL_GT", service_name: "Xếp dỡ Container 45 feet (Có hàng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 45, is_full: true, method_type: "Giao thẳng (Tàu <-> Xe)", cargo_group: null },
    { id: "srv-cont-20-e-tb", service_code: "XD_CONT_20_EMPTY_TB", service_name: "Xếp dỡ Container 20 feet (Rỗng)", category: "Xếp dỡ Container", unit: "đồng/cont", size: 20, is_full: false, method_type: "Tàu <-> Bãi", cargo_group: null },

    // Non-Container Cargo (7 Master Groups)
    { id: "srv-bulk-g1", service_code: "XD_HANG_NHOM_1", service_name: "Xếp dỡ Hàng Nhóm 1: Hàng xá (rời)", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/tấn", size: null, is_full: null, method_type: "Tàu <-> Xe (Giao thẳng)", cargo_group: 1 },
    { id: "srv-bulk-g2", service_code: "XD_HANG_NHOM_2", service_name: "Xếp dỡ Hàng Nhóm 2: Hàng bao, đóng kiện, pallet", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/tấn", size: null, is_full: null, method_type: "Tàu <-> Xe (Giao thẳng)", cargo_group: 2 },
    { id: "srv-bulk-g3", service_code: "XD_HANG_NHOM_3", service_name: "Xếp dỡ Hàng Nhóm 3: Kim khí, thép cuộn, thép phôi", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/tấn", size: null, is_full: null, method_type: "Tàu <-> Xe (Giao thẳng)", cargo_group: 3 },
    { id: "srv-bulk-g4", service_code: "XD_HANG_NHOM_4", service_name: "Xếp dỡ Hàng Nhóm 4: Máy móc, thiết bị nguyên chiếc", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/tấn", size: null, is_full: null, method_type: "Tàu <-> Xe (Giao thẳng)", cargo_group: 4 },
    { id: "srv-bulk-g5", service_code: "XD_HANG_NHOM_5", service_name: "Xếp dỡ Hàng Nhóm 5: Gỗ cây, gỗ lạng, gỗ hộp", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/m3", size: null, is_full: null, method_type: "Tàu <-> Xe (Giao thẳng)", cargo_group: 5 },
    { id: "srv-bulk-g6", service_code: "XD_HANG_NHOM_6", service_name: "Xếp dỡ Hàng Nhóm 6: Phương tiện giao thông (Ô tô, xe máy)", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/chiếc", size: null, is_full: null, method_type: "Giao thẳng", cargo_group: 6 },
    { id: "srv-bulk-g7", service_code: "XD_HANG_NHOM_7", service_name: "Xếp dỡ Hàng Nhóm 7: Hàng siêu trường siêu trọng / Đặc thù", category: "Xếp dỡ hàng ngoài Container", unit: "đồng/tấn", size: null, is_full: null, method_type: "Thỏa thuận", cargo_group: 7 },

    // Tugboat Services
    { id: "srv-tug-1300-1800", service_code: "TL_TAU_1300_1800", service_name: "Tàu lai hỗ trợ từ 1.300 HP đến dưới 1.800 HP", category: "Dịch vụ Tàu lai", unit: "đồng/tàu-lần", size: null, is_full: null, method_type: "Hỗ trợ lượt vào/ra", cargo_group: null },
    { id: "srv-tug-1800-2400", service_code: "TL_TAU_1800_2400", service_name: "Tàu lai hỗ trợ từ 1.800 HP đến dưới 2.400 HP", category: "Dịch vụ Tàu lai", unit: "đồng/tàu-lần", size: null, is_full: null, method_type: "Hỗ trợ lượt vào/ra", cargo_group: null },
    { id: "srv-tug-2400-plus", service_code: "TL_TAU_2400_PLUS", service_name: "Tàu lai hỗ trợ từ 2.400 HP trở lên", category: "Dịch vụ Tàu lai", unit: "đồng/tàu-lần", size: null, is_full: null, method_type: "Hỗ trợ lượt vào/ra", cargo_group: null },

    // Berthage & Mooring Services
    { id: "srv-berth-ship", service_code: "CB_TAU_THUYEN", service_name: "Tàu thuyền cập cầu (Sử dụng cầu bến)", category: "Cầu bến, phao neo", unit: "đồng/GT/giờ", size: null, is_full: null, method_type: "Sử dụng cầu bến", cargo_group: null },
    { id: "srv-mooring-ship", service_code: "PN_PHAO_NEO", service_name: "Tàu thuyền neo buộc tại phao", category: "Cầu bến, phao neo", unit: "đồng/GT/giờ", size: null, is_full: null, method_type: "Sử dụng phao neo", cargo_group: null },
    { id: "srv-storage-reefer", service_code: "LK_CONT_REEFER", service_name: "Lưu kho bãi & Cắm điện Container lạnh", category: "Lưu kho bãi & Điện", unit: "đồng/cont/ngày", size: 20, is_full: true, method_type: "Lưu bãi cảng", cargo_group: null }
  ],

  // 3. Master Cargo Group Definition (7 Nhóm Hàng Chuẩn)
  cargoGroups: [
    { group_no: 1, title: "Nhóm 1: Hàng xá (rời)", description: "Cám các loại, quặng các loại, xi măng, clinker, thạch cao, lưu huỳnh, phân bón, lương thực, muối, đường; gỗ dăm; đá dăm, bột đá, đất, cát, than..." },
    { group_no: 2, title: "Nhóm 2: Hàng bao, kiện, pallet", description: "Đạm bao, đường bao, xi măng bao, hạt nhựa, tinh bột sắn bao đóng pallet..." },
    { group_no: 3, title: "Nhóm 3: Kim khí, sắt thép các loại", description: "Kim khí các loại đóng thành bó, kiện như: sắt xây dựng, sắt phôi, kim loại thỏi, gang, thép tấm, tôn lợp, tôn cuộn...; Ống nước đường kính < 300 mm." },
    { group_no: 4, title: "Nhóm 4: Thiết bị máy móc", description: "Thiết bị, máy móc nguyên chiếc, kết cấu thép đóng kiện, vật tư công trình." },
    { group_no: 5, title: "Nhóm 5: Gỗ các loại", description: "Gỗ cây, gỗ lạng, gỗ hộp, gỗ xẻ đóng kiện xuất nhập khẩu." },
    { group_no: 6, title: "Nhóm 6: Phương tiện giao thông", description: "Ô tô con, xe tải, xe máy, xe chuyên dụng nhập khẩu nguyên chiếc." },
    { group_no: 7, title: "Nhóm 7: Hàng đặc thù & Siêu trường siêu trọng", description: "Hàng siêu trường siêu trọng, thiết bị siêu trọng > 40 tấn/cấu kiện." }
  ],

  // 4. Tariff Rates (Bảng Đơn giá chi tiết từng Quyết định)
  rates: [
    // --- Rates for QĐ 1812 (QĐ Gốc 2026) ---
    { id: "rate-101", decision_id: "qd-1812", service_id: "srv-cont-20-f-gt", base_rate: 384000, updated_at: "2025-12-23" },
    { id: "rate-102", decision_id: "qd-1812", service_id: "srv-cont-20-f-tb", base_rate: 427000, updated_at: "2025-12-23" },
    { id: "rate-103", decision_id: "qd-1812", service_id: "srv-cont-40-f-gt", base_rate: 564000, updated_at: "2025-12-23" },
    { id: "rate-104", decision_id: "qd-1812", service_id: "srv-cont-40-f-tb", base_rate: 635000, updated_at: "2025-12-23" },
    { id: "rate-105", decision_id: "qd-1812", service_id: "srv-cont-45-f-gt", base_rate: 640000, updated_at: "2025-12-23" },
    { id: "rate-106", decision_id: "qd-1812", service_id: "srv-cont-20-e-tb", base_rate: 210000, updated_at: "2025-12-23" },
    
    { id: "rate-107", decision_id: "qd-1812", service_id: "srv-bulk-g1", base_rate: 26000, updated_at: "2025-12-23" },
    { id: "rate-108", decision_id: "qd-1812", service_id: "srv-bulk-g2", base_rate: 34000, updated_at: "2025-12-23" },
    { id: "rate-109", decision_id: "qd-1812", service_id: "srv-bulk-g3", base_rate: 42000, updated_at: "2025-12-23" },
    { id: "rate-110", decision_id: "qd-1812", service_id: "srv-bulk-g4", base_rate: 58000, updated_at: "2025-12-23" },
    { id: "rate-111", decision_id: "qd-1812", service_id: "srv-bulk-g5", base_rate: 38000, updated_at: "2025-12-23" },
    { id: "rate-112", decision_id: "qd-1812", service_id: "srv-bulk-g6", base_rate: 150000, updated_at: "2025-12-23" },
    { id: "rate-113", decision_id: "qd-1812", service_id: "srv-bulk-g7", base_rate: 120000, updated_at: "2025-12-23" },

    { id: "rate-114", decision_id: "qd-1812", service_id: "srv-tug-1300-1800", base_rate: 11000000, updated_at: "2025-12-23" },
    { id: "rate-115", decision_id: "qd-1812", service_id: "srv-tug-1800-2400", base_rate: 14500000, updated_at: "2025-12-23" },
    { id: "rate-116", decision_id: "qd-1812", service_id: "srv-tug-2400-plus", base_rate: 18500000, updated_at: "2025-12-23" },

    { id: "rate-117", decision_id: "qd-1812", service_id: "srv-berth-ship", base_rate: 15, updated_at: "2025-12-23" },
    { id: "rate-118", decision_id: "qd-1812", service_id: "srv-mooring-ship", base_rate: 10, updated_at: "2025-12-23" },
    { id: "rate-119", decision_id: "qd-1812", service_id: "srv-storage-reefer", base_rate: 180000, updated_at: "2025-12-23" },

    // --- Overridden Rate in QĐ 210 (Child of 1812 - Tàu lai điều chỉnh) ---
    { id: "rate-201", decision_id: "qd-210", service_id: "srv-tug-1300-1800", base_rate: 11500000, updated_at: "2026-03-10" },
    { id: "rate-202", decision_id: "qd-210", service_id: "srv-tug-1800-2400", base_rate: 15200000, updated_at: "2026-03-10" },

    // --- Rates for QĐ 1650 (2025 Historical) ---
    { id: "rate-2025-01", decision_id: "qd-1650", service_id: "srv-cont-20-f-gt", base_rate: 365000, updated_at: "2024-12-20" },
    { id: "rate-2025-02", decision_id: "qd-1650", service_id: "srv-cont-20-f-tb", base_rate: 405000, updated_at: "2024-12-20" },
    { id: "rate-2025-03", decision_id: "qd-1650", service_id: "srv-cont-40-f-gt", base_rate: 535000, updated_at: "2024-12-20" },
    { id: "rate-2025-04", decision_id: "qd-1650", service_id: "srv-bulk-g3", base_rate: 40000, updated_at: "2024-12-20" },

    // --- Rates for QĐ 1510 (2024 Historical) ---
    { id: "rate-2024-01", decision_id: "qd-1510", service_id: "srv-cont-20-f-gt", base_rate: 350000, updated_at: "2023-12-25" },
    { id: "rate-2024-02", decision_id: "qd-1510", service_id: "srv-cont-20-f-tb", base_rate: 390000, updated_at: "2023-12-25" },
    { id: "rate-2024-03", decision_id: "qd-1510", service_id: "srv-cont-40-f-gt", base_rate: 510000, updated_at: "2023-12-25" },
    { id: "rate-2024-04", decision_id: "qd-1510", service_id: "srv-bulk-g3", base_rate: 38000, updated_at: "2023-12-25" }
  ],

  // 5. Tariff Modifiers (Hệ số điều chỉnh)
  modifiers: [
    { id: "mod-1", decision_id: "qd-1812", modifier_type: "Reefer_Normal", title: "Hàng lạnh (15°C đến 0°C)", multiplier: 1.5, fixed_addon: 0, applies_to: "Xếp dỡ Container" },
    { id: "mod-2", decision_id: "qd-1812", modifier_type: "Reefer_Deep", title: "Hàng âm sâu (< 0°C)", multiplier: 2.0, fixed_addon: 0, applies_to: "Xếp dỡ Container" },
    { id: "mod-3", decision_id: "qd-1812", modifier_type: "IMDG", title: "Hàng nguy hiểm (IMDG)", multiplier: 1.5, fixed_addon: 50000, applies_to: "Tất cả dịch vụ" },
    { id: "mod-4", decision_id: "qd-1812", modifier_type: "OOG", title: "Hàng quá khổ/quá tải (OOG)", multiplier: 1.5, fixed_addon: 100000, applies_to: "Xếp dỡ Container" }
  ],

  // 6. Dynamic Surcharges (Bảng 10 Ngưỡng Giá Dầu DO - QĐ 209)
  fuelMatrix: [
    { id: "fuel-1", min_price: 0, max_price: 15000, surcharge_value: 0, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO dưới 15.000 đ/lít" },
    { id: "fuel-2", min_price: 15001, max_price: 17000, surcharge_value: 15000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 15.001 - 17.000 đ/lít" },
    { id: "fuel-3", min_price: 17001, max_price: 19000, surcharge_value: 30000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 17.001 - 19.000 đ/lít" },
    { id: "fuel-4", min_price: 19001, max_price: 21000, surcharge_value: 45000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 19.001 - 21.000 đ/lít (Mức tiêu chuẩn hiện tại)" },
    { id: "fuel-5", min_price: 21001, max_price: 23000, surcharge_value: 60000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 21.001 - 23.000 đ/lít" },
    { id: "fuel-6", min_price: 23001, max_price: 25000, surcharge_value: 75000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 23.001 - 25.000 đ/lít" },
    { id: "fuel-7", min_price: 25001, max_price: 27000, surcharge_value: 90000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 25.001 - 27.000 đ/lít" },
    { id: "fuel-8", min_price: 27001, max_price: 29000, surcharge_value: 105000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 27.001 - 29.000 đ/lít" },
    { id: "fuel-9", min_price: 29001, max_price: 31000, surcharge_value: 120000, apply_as: "Fixed", unit: "đồng/cont", note: "Giá dầu DO 29.001 - 31.000 đ/lít" },
    { id: "fuel-10", min_price: 31001, max_price: 999000, surcharge_value: 0.05, apply_as: "Percentage", unit: "% tổng cước", note: "Giá dầu DO trên 31.000 đ/lít (+5% tổng đơn giá cước)" }
  ],

  // 7. Tariff Interpretations (Căn cứ & Ghi chú Quyết định)
  interpretations: [
    { id: "interp-1", decision_id: "qd-1812", section_ref: "Điều 2", content_text: "Giá ban hành kèm theo Quyết định này chưa bao gồm thuế giá trị gia tăng (VAT 10%).", apply_to: "Toàn bộ biểu cước" },
    { id: "interp-2", decision_id: "qd-1812", section_ref: "Mục I.2", content_text: "Giờ làm việc ca cảng: Ca 1 từ 06h00 đến 18h00; Ca 2 từ 18h00 đến 06h00 sáng hôm sau. Làm ca 2 ngày Lễ/Tết phụ thu 30%.", apply_to: "Tác nghiệp cảng" },
    { id: "interp-3", decision_id: "qd-1812", section_ref: "Bảng 10", content_text: "Hàng lạnh (15°C đến 0°C) tăng 50% đơn giá xếp dỡ; dưới 0°C tăng 100% đơn giá xếp dỡ.", apply_to: "Xếp dỡ Container" },
    { id: "interp-4", decision_id: "qd-209", section_ref: "Điều 1 - QĐ 209", content_text: "Khi giá dầu DO biến động vượt ngưỡng +/- 5% so với mức cơ sở 20.000đ/lít, phụ phí biến động nhiên liệu sẽ tự động điều chỉnh theo bảng tra 10 mức.", apply_to: "Phụ phí Nhiên liệu" }
  ],

  // 8. Commercial Packages (Gói Dịch vụ Thương mại & Báo Giá)
  packages: [
    {
      id: "pkg-steel-2026",
      package_name: "Gói Khách hàng Thép cuộn & Thép tấm 2026",
      segment: "Hàng Thép (Nhóm 3)",
      created_by: "Phòng Kinh doanh Cảng",
      valid_until: "2026-12-31",
      discount_note: "Chiết khấu 8% đơn giá xếp dỡ + Miễn phí 3 ngày lưu kho bãi",
      items: [
        { service_id: "srv-bulk-g3", custom_rate: 386400, note: "Giảm 8% so với giá niêm yết 42.000đ/tấn" },
        { service_id: "srv-tug-1800-2400", custom_rate: 14000000, note: "Ưu đãi gói tàu lai" },
        { service_id: "srv-berth-ship", custom_rate: 14, note: "Ưu đãi phí cầu bến" }
      ]
    },
    {
      id: "pkg-cont-intl-2026",
      package_name: "Gói Tàu Container Quốc tế Trọn gói (Full Logistics)",
      segment: "Container Hàng hải",
      created_by: "Phòng Khai thác",
      valid_until: "2026-12-31",
      discount_note: "Trọn gói Xếp dỡ + Tàu lai + Buộc dây + Lưu bãi 5 ngày",
      items: [
        { service_id: "srv-cont-20-f-tb", custom_rate: 410000, note: "Đơn giá gói ưu đãi 20' Full" },
        { service_id: "srv-cont-40-f-tb", custom_rate: 610000, note: "Đơn giá gói ưu đãi 40' Full" },
        { service_id: "srv-tug-2400-plus", custom_rate: 17500000, note: "Tàu lai trọn gói" }
      ]
    }
  ],

  // 9. Audit Logs (Nhật ký Hệ thống)
  auditLogs: [
    {
      id: "audit-001",
      user_id: "Admin_Khoa",
      action: "CREATE_DECISION",
      decision_no: "1812/QĐ-CSG",
      payload: "Khởi tạo Biểu giá dịch vụ Cảng biển năm 2026 (QĐ Gốc)",
      timestamp: "2025-12-23 09:15:00"
    },
    {
      id: "audit-002",
      user_id: "KinhDoanh_Minh",
      action: "BRANCH_DECISION",
      decision_no: "209/QĐ-CSG",
      payload: "Tạo quyết định con 209/QĐ-CSG điều chỉnh Phụ phí Nhiên liệu DO",
      timestamp: "2026-02-15 14:30:22"
    },
    {
      id: "audit-003",
      user_id: "Admin_Khoa",
      action: "UPDATE_RATE",
      decision_no: "210/QĐ-CSG",
      payload: "Ghi đè đơn giá Tàu lai 1.300-1.800HP: 11.000.000đ -> 11.500.000đ",
      timestamp: "2026-03-10 16:45:10"
    }
  ]
};
