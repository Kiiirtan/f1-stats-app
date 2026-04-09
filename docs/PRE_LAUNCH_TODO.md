# PRE-LAUNCH DATA AUTHENTICITY CHECKS

As per the "100% Rule", this application is transitioning from a development environment to a market-ready production product. 

**ACTION REQUIRED:** A Lead QA Architect or content manager MUST manually verify the following UI files to ensure all hard-coded text, names, biographies, and historical statistics are 100% authentic and factual.

### 📝 Files Requiring Manual Verification:
- `src/pages/Dashboard.tsx` - Verify the default hardcoded statistics (if any) before the API loads.
- `src/pages/Archives.tsx` - Verify the 25-season `HISTORICAL_SEASONS` array (Ensure Hamilton, Verstappen, Schumacher years/points are fully accurate).
- `src/pages/News.tsx` - If RSS feed falls back to placeholder news content, ensure placeholders do not contain dummy text (Lorem Ipsum).
- `src/data/constructorDetails.ts` - Double-check all official Constructor team colors (Hex codes) and foundation years.

Delete this file once verification is complete.
