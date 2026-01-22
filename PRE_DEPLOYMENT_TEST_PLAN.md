# Pre-Deployment Full Test Plan

This document outlines the comprehensive test plan to verify the application's readiness for deployment. This covers data integrity, business logic, UI/UX consistency, and critical SEO structures.

## Phase 1: Core Weather Data & Data Flow

### 1.1. Data Accuracy & Fallbacks
- [ ] **Zero Value Handling**: Verify that 0°C temperatures, 0 UV Index, and 0mm Rain don't trigger "missing" fallbacks (e.g., ensure no 20°C / UV 5 defaults appear).
- [ ] **Current Conditions**: Compare "Hero Dashboard" data with "Bento Grid" metrics (Wind, Humidity, Pressure) for consistency.
- [ ] **Hourly Trend**: Check the hourly chart smooths correctly across midnight.
- [ ] **Daily Forecast**: Verify the next 7 days in the list match the API expectations (no missed days).

### 1.2. Forecast Drawer (Detailed View)
- [ ] **Open/Close Logic**: Click on every day in the 15-day list. Ensure:
  - The correct drawer opens.
  - No "wrong day" data is shown (verified by checking the date in the drawer header).
- [ ] **Hourly Data in Drawer**: Ensure data populates for all 15 days (especially days 7-15).
- [ ] **Legend**: Confirm the new legend (Temperature, Feels Like, Rain, Wind) appears and matches chart colors.

### 1.3. City & District Switching
- [ ] **City Search**: Search for "Istanbul", "Ankara", "Izmir". click result -> URL updates -> Data updates.
- [ ] **District Logic**: Navigate to a URL like /hava-durumu/istanbul/kadikoy. Verify:
  - Breadcrumb shows "İstanbul > Kadıköy".
  - Data is specific to Kadıköy coordinates (if API supports) or falls back gracefully.
- [ ] **Recent Cities**: Check that searching/visiting a city adds it to the "Last Visited" or local storage history.

## Phase 2: Business Logic & Verbal Summaries

### 2.1. "Havadan Konuşalım" (Smart Summaries)
- [ ] **Smart Phrase Logic**:
  - Rain: If rain > 30%, verify phrase warns about rain/umbrella.
  - Wind: If wind > 30km/h, verify phrase warns about wind.
  - Heat/Cold: Verify extreme temp phrases trigger correctly.
- [ ] **Commentary Grid**:
  - Verify "Sıcaklık", "Rüzgar", "Nem" cards show text descriptions matching the numeric data (e.g., "Nemli" for >60%).

### 2.2. FAQ Generation (SEOFAQSection)
- [ ] **Dynamic Answers**: Read the FAQs for the current city.
  - "Bugün hava nasıl?": Answer must match current temp/condition.
  - "Hafta sonu nasıl?": Answer must accurately summarize Sat/Sun data (e.g., correct range).
  - "Yağmur var mı?": Answer must be "Evet" if rain prob > 30% in next 7 days, else "Hayır/Beklenmiyor".

### 2.3. Forecast Accuracy
- [ ] **Accuracy Banner**: In 'Today' view, check if the "Tahmin Doğruluğu" banner appears (if data available).

## Phase 3: "Islands" (Specialized Widgets)

### 3.1. Tourism Konforu (Fixed)
- [ ] **Consistency**: Verify again that Tourism temperature/UV matches the main dashboard exactly.
- [ ] **Advice Logic**: Check if the text advice makes sense for the conditions (e.g., "Güneş kremi sürün" if UV > 5).

### 3.2. Traffic & Marine
- [ ] **Traffic**: Check Istanbul (should show Traffic widget). Check a rural city (should correctly HIDE or show Hub data).
- [ ] **Marine**: Check a coastal city (Izmir/Antalya) -> Marine widget appears. Check Ankara -> Marine widget HIDDEN.

### 3.3. New Islands (Ski, Agriculture, Fire)
- [ ] **Ski**: Visit a ski city (Bursa/Uludağ, Erzurum/Palandöken). Verify Ski widget loads.
- [ ] **Agriculture**: Visit an agricultural hub (Konya, Adana). Verify Agriculture widget loads.
- [ ] **Fire Risk**: Verify logic (only shows if risk is high or in season? Check implementation).

## Phase 4: SEO & Metadata

### 4.1. Page Titles & Meta
- [ ] **Dynamic Titles**:
  - Home: [City] Hava Durumu...
  - Tomorrow: [City] Yarınki Hava Durumu...
  - 15 Days: [City] 15 Günlük...
- [ ] **Canonical Tags**: Ensure self-referencing canonicals are present.

### 4.2. Schema Markup (JSON-LD)
- [ ] **WeatherForecast**: Verify structure includes valid dates and location.
- [ ] **FAQPage**: Verify strictly matches the visual FAQ content.
- [ ] **BreadcrumbList**: Verify hierarchy (Home > City > [District]).

## Phase 5: UI/UX & Responsive

### 5.1. Layout
- [ ] **Mobile View**: Resize browser to 375px/412px.
  - Check Ad placement (no overflow).
  - Check Forecast Drawer readability.
  - Check Island widgets stacking.
- [ ] **Desktop View**: Verify sidebar ads and grid layout.

### 5.2. Theme
- [ ] **Dark Mode**: Toggle theme. Check for unreadable text (e.g., dark text on dark background) in new areas like the Legend or Tourism widget.

## Phase 6: Edge Cases & Error Handling

### 6.1. Navigation
- [ ] **Back/Forward**: Navigate City A -> City B -> Back. Ensure City A data reloads without page refresh.
- [ ] **Direct URL Access**: Paste a deep link (e.g., /hava-durumu/ankara/15-gunluk) into a new tab. Verify it loads correctly.

### 6.2. Missing Data
- [ ] **Invalid City**: Try /hava-durumu/invalid-city-name. Verify graceful error or redirect (not crash).
