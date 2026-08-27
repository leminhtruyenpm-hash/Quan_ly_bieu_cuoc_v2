/**
 * Saigon Port Pricing Engine
 * Implements recursive tree inheritance lookup, modifier application, 
 * dynamic fuel matrix lookup, and multi-currency conversion.
 */

window.PricingEngine = {
  // Exchange rate USD/VND standard default
  DEFAULT_EXCHANGE_RATE: 25400,

  /**
   * Find active decision at a given target date (e.g. vessel arrival date)
   */
  findActiveDecision: function(targetDateStr) {
    const db = window.TariffDB;
    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

    // Filter active decisions whose effective date <= target date
    const eligible = db.decisions.filter(d => {
      if (d.status !== "Active") return false;
      const eff = new Date(d.effective_date);
      return eff <= targetDate;
    });

    if (eligible.length === 0) {
      // Fallback to primary 1812
      return db.decisions.find(d => d.id === "qd-1812") || db.decisions[0];
    }

    // Sort by effective date descending to get the newest active decision
    eligible.sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date));
    return eligible[0];
  },

  /**
   * Recursive rate lookup supporting Decision Tree Inheritance
   */
  findRateWithInheritance: function(decisionId, serviceId) {
    const db = window.TariffDB;
    
    // Look for direct rate match in current decision
    const rateEntry = db.rates.find(r => r.decision_id === decisionId && r.service_id === serviceId);
    if (rateEntry) {
      const decision = db.decisions.find(d => d.id === decisionId);
      return {
        rate: rateEntry.base_rate,
        decision_no: decision ? decision.decision_no : decisionId,
        decision_id: decisionId,
        is_inherited: false
      };
    }

    // If not found in current decision, check parent decision recursively
    const currentDecision = db.decisions.find(d => d.id === decisionId);
    if (currentDecision && currentDecision.parent_id) {
      const parentResult = this.findRateWithInheritance(currentDecision.parent_id, serviceId);
      if (parentResult) {
        parentResult.is_inherited = true;
        parentResult.inherited_via = currentDecision.decision_no;
        return parentResult;
      }
    }

    return null;
  },

  /**
   * Look up Fuel Matrix DO Surcharge
   */
  getFuelSurcharge: function(doFuelPrice) {
    const db = window.TariffDB;
    const price = parseFloat(doFuelPrice) || 0;
    
    const matchedTier = db.fuelMatrix.find(tier => price >= tier.min_price && price <= tier.max_price);
    if (matchedTier) {
      return matchedTier;
    }
    // Default tier 4 (standard ~20,000 VND)
    return db.fuelMatrix[3];
  },

  /**
   * Calculate final rate for a given service and vessel operation context
   */
  calculateFinalRate: function(serviceId, options = {}) {
    const db = window.TariffDB;
    const {
      decisionId = null,
      targetDate = new Date().toISOString().split('T')[0],
      doFuelPrice = 20000,
      isReeferNormal = false,
      isReeferDeep = false,
      isIMDG = false,
      isOOG = false,
      targetCurrency = "VND",
      exchangeRate = this.DEFAULT_EXCHANGE_RATE
    } = options;

    // 1. Determine decision context
    let selectedDecision = decisionId ? db.decisions.find(d => d.id === decisionId) : this.findActiveDecision(targetDate);
    if (!selectedDecision) selectedDecision = db.decisions[0];

    // 2. Fetch base service metadata
    const service = db.services.find(s => s.id === serviceId);
    if (!service) return { error: "Service not found" };

    // 3. Recursive rate lookup
    const inheritedRateObj = this.findRateWithInheritance(selectedDecision.id, serviceId);
    if (!inheritedRateObj) {
      return {
        error: "Không tìm thấy đơn giá cho dịch vụ này trong cây quyết định",
        service,
        decision: selectedDecision
      };
    }

    const baseRate = inheritedRateObj.rate;
    let currentRate = baseRate;
    let appliedModifiers = [];

    // 4. Apply Modifiers
    if (isReeferNormal) {
      const mod = db.modifiers.find(m => m.modifier_type === "Reefer_Normal");
      if (mod) {
        currentRate = currentRate * mod.multiplier + mod.fixed_addon;
        appliedModifiers.push(mod.title + " (+50%)");
      }
    } else if (isReeferDeep) {
      const mod = db.modifiers.find(m => m.modifier_type === "Reefer_Deep");
      if (mod) {
        currentRate = currentRate * mod.multiplier + mod.fixed_addon;
        appliedModifiers.push(mod.title + " (+100%)");
      }
    }

    if (isIMDG) {
      const mod = db.modifiers.find(m => m.modifier_type === "IMDG");
      if (mod) {
        currentRate = currentRate * mod.multiplier + mod.fixed_addon;
        appliedModifiers.push(mod.title + " (+50% + 50.000đ)");
      }
    }

    if (isOOG) {
      const mod = db.modifiers.find(m => m.modifier_type === "OOG");
      if (mod) {
        currentRate = currentRate * mod.multiplier + mod.fixed_addon;
        appliedModifiers.push(mod.title + " (+50% + 100.000đ)");
      }
    }

    // 5. Dynamic Fuel Surcharge (Applies primarily to Container & Stevedoring services)
    let fuelSurchargeAmount = 0;
    const fuelTier = this.getFuelSurcharge(doFuelPrice);
    
    if (service.category === "Xếp dỡ Container" || service.category === "Xếp dỡ hàng ngoài Container") {
      if (fuelTier.apply_as === "Fixed") {
        fuelSurchargeAmount = fuelTier.surcharge_value;
      } else {
        fuelSurchargeAmount = currentRate * fuelTier.surcharge_value;
      }
    }

    const totalVND = currentRate + fuelSurchargeAmount;

    // 6. Currency Conversion
    let finalDisplayRate = totalVND;
    if (targetCurrency === "USD") {
      finalDisplayRate = totalVND / (parseFloat(exchangeRate) || this.DEFAULT_EXCHANGE_RATE);
    }

    return {
      service,
      decision: selectedDecision,
      rateProvenance: inheritedRateObj,
      baseRate,
      modifiedRate: currentRate,
      appliedModifiers,
      fuelTier,
      fuelSurchargeAmount,
      totalVND,
      targetCurrency,
      finalDisplayRate: Math.round(finalDisplayRate * 100) / 100
    };
  }
};
