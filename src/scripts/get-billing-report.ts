import { getBillingReport } from "../services/billing-report.ts";

(async () => {
    const billingReport = await getBillingReport();
    console.log(billingReport)
})();