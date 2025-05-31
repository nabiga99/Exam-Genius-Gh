Below is a breakdown of the entire UI into small, shippable chunks. Each chunk contains:

1. **Name & Priority**
2. **Screens (Pages/Modals) Included**
3. **What Each Screen Shows & Actions**
4. **Mini User-Flow Diagram (ASCII)**

Use this as a guide for incremental UI sprints—tackle chunk 1 first, verify it in isolation, then move on to chunk 2, etc.

---

## **Chunk 1 (Highest Priority): Authentication & Landing Area**

> **Goal:** Let teachers learn about the product, sign up, and log in.

### 1.1. Landing Page (`/`)

* **What It Shows:**

  * **Navbar (top)**

    * Left: Logo
    * Right: Links: Home, Features, Pricing, About, Help, \[Login], \[Sign Up]
  * **Hero Section (center)**

    * Headline (H1): “Generate Curriculum-Aligned Exam Questions in Minutes”
    * Subhead: “AI-powered, built for Ghanaian JHS & SHS teachers”
    * CTAs: \[Get Started (Free)] (primary), \[Watch Demo] (secondary)
  * **Feature Highlights (below hero)**

    * 3–4 horizontally stacked cards:

      1. “Save Hours on Question Prep”
      2. “Precisely Aligned to NaCCA Curriculum”
      3. “Multiple Formats (MCQ, T/F, Fill-in, etc.)”
      4. “Export Directly to Word (DOCX)”
  * **Testimonials Carousel**

    * Rotating quotes from pilot teachers (e.g., “As a JHS teacher in Tamale…”)
  * **Footer**

    * Quick links: Privacy, Terms, Blog
    * Contact email, Social icons

* **What You Can Do:**

  * Click **Login** → navigates to `/auth/login`
  * Click **Sign Up** or **Get Started** → navigates to `/auth/register`
  * Scroll to Features, Pricing, About, Help sections
  * Click **Watch Demo** → perhaps scrolls to an embedded video

---

### 1.2. Register Page (`/auth/register`)

* **What It Shows:**

  * **Header (static)** same as Landing (with logo + minimal links)
  * **Center Form**

    1. **Full Name (input)**
    2. **Email (input)**
    3. **Password (input, masked)**
    4. **Confirm Password (input)**
    5. **Terms Checkbox** (“I agree to Terms & Privacy”)
    6. **Create Account** (primary button, disabled until valid)
    7. Link: **Already have an account? Login**
  * **Footer**

    * Minimal: support email, maybe a “Back to Home” link

* **What You Can Do:**

  * Fill in all fields → “Create Account” becomes clickable
  * On success → see “Check your email to verify your account” message
  * Click “Login” → `/auth/login`

---

### 1.3. Email Verification Page (`/auth/verify?token=…`)

* **What It Shows:**

  * If token is valid:

    * Big check icon + “Your email is verified!” (H2)
    * Button: **Log In** (redirect `/auth/login`)
  * If token invalid/expired:

    * Error icon + “Verification failed. Resend link?”
    * Button: **Resend Verification** → triggers email resend

* **What You Can Do:**

  * Click “Log In” → `/auth/login`
  * If expired, click “Resend Verification” → trigger workflow, stay

---

### 1.4. Login Page (`/auth/login`)

* **What It Shows:**

  * **Header** same as above
  * **Center Form**

    1. **Email (input)**
    2. **Password (input)**
    3. **Log In** (primary)
    4. Link: **Forgot Password?** → `/auth/forgot-password`
    5. Link: **No account? Sign Up** → `/auth/register`

* **What You Can Do:**

  * Enter valid creds → “Log In” → `/dashboard`
  * Invalid creds → inline error (“Invalid email or password.”)
  * Click **Forgot Password** → `/auth/forgot-password`
  * Click **Sign Up** → `/auth/register`

---

### 1.5. Forgot Password (`/auth/forgot-password`)

* **What It Shows:**

  * **Header** same as above
  * **Form**

    1. **Email (input)**
    2. **Send Reset Link** (primary)
    3. Link: **Back to Login**

* **What You Can Do:**

  * Provide email → click “Send Reset Link” → “Check your inbox” message
  * Click “Back to Login” → `/auth/login`

---

### 1.6. Reset Password (`/auth/reset-password?token=…`)

* **What It Shows:**

  * **Header**
  * **Form**

    1. **New Password (input)**
    2. **Confirm New Password (input)**
    3. **Reset Password** (primary)
    4. Link: **Back to Login**

* **What You Can Do:**

  * Enter matching new passwords → click “Reset Password” → redirect to `/auth/login` with “Password updated” toast
  * If token invalid, show “Reset failed. Request a new link” and link to `/auth/forgot-password`

---

#### 1.x Mini User Flow Diagram (Authentication)

```
[Landing /]  
   ├─ > Sign Up → [/auth/register] ─(success)→ [Check Email Verification]  
   │                           └(click)→ [/auth/login]
   └─ > Login → [/auth/login]  
           ├─(invalid)→ [Error Inline]  
           └─(valid)→ [/dashboard]

[/auth/register]  
   ├─(valid)→ [Email Verification Page]  
   └─(already have account)→ [/auth/login]

[/auth/login]  
   ├─ > Forgot Password → [/auth/forgot-password]  
   │                           └─(submit)→ [“Check inbox” message]
   └─(valid)→ [/dashboard]

[/auth/forgot-password]  
   └─(submit)→ [“Check Inbox” message], link back

[/auth/reset-password?token]  
   └─(valid token & input)→ [/auth/login] with toast “Password updated”  
   └─(invalid token)→ [“Reset failed. Request new link”]
```

---

## **Chunk 2: Dashboard & Global Navigation**

> **Goal:** Provide a “home base” after login with global navigation and quick access to key flows.

### 2.1. Dashboard Page (`/dashboard`)

* **What It Shows:**

  * **Sidebar (Left, 240px, Navy `#1E3A8A`)** – fixed vertical navigation:

    1. **Dashboard** (icon: home, white text)
    2. **Generate New Set** (icon: plus, white)
    3. **My Documents** (icon: file, white)
    4. **My Question Sets** (icon: clipboard, white)
    5. **Billing & Subscription** (icon: credit card, white)
    6. **Profile & Settings** (icon: user, white)
    7. **Help & Support** (icon: lifebuoy, white)
    8. **Log Out** (icon: power, white)

    * **Active Item Highlight:** 4px Emerald bar on the left edge
  * **Top Navbar (across, above main content)**

    * If sidebar collapsed (responsive), hamburger toggle shows; else just “Dashboard” title
  * **Main Content (center, max‐width 1024px, white background)**:

    1. **Welcome Banner (H2):** “Good Morning, {{FullName}}”

       * Subtext: “Ready to create your next question set?”
       * Button: **Generate New Set** (Primary)
    2. **Usage Snapshot Card:**

       * Title: “This Month’s Usage”
       * Text: “15 / 20 (Free Tier Limit)”
       * Progress Bar (15/20 fill, Emerald)
       * If over limit: show “Upgrade to Pro” (Secondary)
    3. **Recent Activity Table:**

       * Columns: Date, Sub-Strand, Count, Status, Actions (Review, Export, Delete)
       * If empty: show illustration + “No question sets yet” + “Generate New Set” button
    4. **Tips Carousel (optional):** 3–4 tip cards (e.g., “Use extra notes…”)

* **What You Can Do:**

  * Click **Generate New Set** → `/generate` (Step 1)
  * Click **My Documents** in sidebar → `/documents`
  * Click **My Question Sets** → `/sets`
  * Click **Billing & Subscription** → `/billing`
  * Click **Profile & Settings** → `/settings`
  * Click **Help & Support** → `/support`
  * Click **Log Out** → clears session, redirect `/auth/login`
  * In “Recent Activity,” click **Review** → `/questions/sets/{setId}`; **Export** triggers DOCX flow; **Delete** opens confirm modal

---

#### 2.2. Sidebar Component (Global)

* **What It Shows (Always Visible on Desktop):**

  * Vertical list of 8 menu items (icons + text).
  * On hover: darken up hovered item’s background to #1B365F.
  * Collapse icon (→) at bottom for narrow mode (responsive).

* **What You Can Do:**

  * Click any item → navigates to respective page
  * If in mobile view (<768px), sidebar is hidden; hamburger in top navbar toggles a slide-in drawer with same menu

---

#### 2.x Mini User Flow Diagram (Dashboard ↔ Navigation)

```
[/auth/login] (valid) → [/dashboard]

[/dashboard]  
   ├─ Click “Generate New Set” → [/generate (Step 1)]  
   ├─ Click “My Documents” → [/documents]  
   ├─ Click “My Question Sets” → [/sets]  
   ├─ Click “Billing & Subscription” → [/billing]  
   ├─ Click “Profile & Settings” → [/settings]  
   ├─ Click “Help & Support” → [/support]  
   └─ Click “Log Out” → [/auth/login]
```

---

## **Chunk 3: Document Management UI**

> **Goal:** Let teachers upload, view, and delete reference files (syllabi, notes).

### 3.1. My Documents Page (`/documents`)

* **What It Shows:**

  * **Sidebar/ Navbar** (same as Dashboard)
  * **Page Title (H2):** “My Uploaded Documents”
  * **Upload New Document Button** (Primary, top-right)
  * **Documents Table (full width):**

    * **Columns:** File Name (clickable), Uploaded At (date/time), File Size, Actions (View, Delete)
    * If table is empty: full-width **Empty State** block:

      * Illustration
      * Text: “No documents yet. Click ‘Upload New Document’ to add one.”
      * Button: **Upload New Document** (Primary)

* **What You Can Do:**

  * Click **Upload New Document** → open **Upload Modal**
  * In table: click **View** → open **Document Details Modal** (shows metadata + preview if PDF)
  * Click **Delete** → open **Confirm Deletion Modal** (H3: “Delete Document?”, text: “Are you sure?”) → “Cancel” or “Delete” (destructive)

---

### 3.2. Upload Modal (Overlay)

* **What It Shows:**

  * **Overlay (semi-opaque dark background)**
  * **Modal Box (Level 2 shadow, 640px wide)**

    1. **Title (H3):** “Upload Document”
    2. **Drag-and-Drop Area (200px tall):**

       * Dashed border #64748B, radius 8px
       * Icon: upload (Feather)
       * Text: “Drag & drop PDF/DOCX/PPTX here, or click to browse”
       * Subtext: “Max file size: 10 MB”
    3. **Browse Files (Button)** (Secondary) — opens file chooser
    4. **Progress Bar** (hidden until upload begins)
    5. **Cancel** (Tertiary, bottom-left) & **Upload** (Primary, bottom-right, disabled until file chosen)

* **What You Can Do:**

  * Drag a valid file into area or click “Browse Files”
  * Once file selected, “Upload” becomes enabled
  * Click **Upload** → show progress bar 0→100% → on success: close modal + show toast “Upload successful!” → refresh document list
  * Click **Cancel** (if file not yet chosen) → close modal

---

### 3.3. Document Details Modal

* **What It Shows:**

  * **Overlay → Modal (600px wide)**

    1. **Title (H3):** “Document Details”
    2. **Metadata List:**

       * File Name: `{{fileName}}`
       * Uploaded At: `{{uploadedAt | MMM D, YYYY h:mm A}}`
       * File Size: `{{fileSize}} MB`
       * Document Type: `{{fileType}}`
    3. **Preview (if PDF):** Inline embedded PDF viewer (first page) or text “Preview not available for this type.”
    4. **Buttons:** **Close** (Primary) & **Download** (Secondary, if desired)

* **What You Can Do:**

  * Click **Download** → triggers file download from `storageURL`
  * Click **Close** → dismiss modal

---

#### 3.x Mini User Flow Diagram (Documents)

```
[/dashboard]  
   └─ Click “My Documents” → [/documents]

[/documents]  
   ├─ If no docs → Empty State → click “Upload New Document” → [Upload Modal]
   └─ If docs present → Table listing →  
        ├─ Click “View” → [Document Details Modal]  
        │       └─ Click “Close” → close modal  
        └─ Click “Delete” → [Confirm Deletion Modal]  
               ├─ “Cancel” → close modal  
               └─ “Delete” → removes document, refresh list  
   └─ Click “Upload New Document” → [Upload Modal]  
           ├─ Drag/Browse → select file  
           ├─ Click “Upload” → progress bar → on success → toast & close
           └─ Click “Cancel” → close
```

---

## **Chunk 4: Generate Wizard UI (Multi-Step)**

> **Goal:** Guide teachers through selecting their reference, curriculum, question types, and generating the set.

Break this into **three** visible steps + **progress overlay**. Use a single route (`/generate`) and a page-variable (`currentStep`) to toggle sections.

---

### 4.1. Step 1: Select Document & Curriculum (`/generate`, `currentStep = 1`)

* **What It Shows:**

  * **Sidebar/ Navbar** (same as Dashboard)
  * **Breadcrumb/Progress Indicator (H3)**: “Step 1 of 3: Document & Curriculum”
  * **Form Section (left column, 60% width on desktop; full width on mobile):**

    1. **Document Dropdown:**

       * Label: “Choose a Document”
       * Options: list of `Document.fileName` for currentUser
       * If none exist: show a small banner “No documents available. Upload one first.” + link to `/documents`
    2. **Class Level (Radio Group):** Label: “Class Level” → Options: “JHS,” “SHS”
    3. **Subject Dropdown:** Hidden/disabled until Class Level chosen. Label: “Subject” → cascades from `Subject` table where `level = selectedLevel`
    4. **Strand Dropdown:** Hidden until Subject chosen. Label: “Strand” → cascades from `Strand` where `subjectID = selectedSubjectID`
    5. **Sub-Strand Dropdown:** Hidden until Strand chosen. Label: “Sub-Strand” → cascades from `SubStrand` where `strandID = selectedStrandID`
  * **Tips Panel (right column, 40% width on desktop; hidden on mobile):**

    * Text: “Selecting the exact sub-strand ensures the AI generates highly relevant questions. For example, B7/JHS1.1.3.4 covers Photosynthesis…”
  * **Navigation Buttons (bottom, full width on mobile):**

    * **Back** (Tertiary, disabled on Step 1)
    * **Next** (Primary, disabled until all five fields have values)

* **What You Can Do:**

  * Choose a reference document (or be prompted to upload if none exist)
  * Pick Class Level → enables Subject dropdown
  * Pick Subject → enables Strand dropdown
  * Pick Strand → enables Sub-Strand dropdown
  * Once all are filled, “Next” becomes clickable → sets `currentStep = 2`

---

### 4.2. Step 2: Configure Question Types (`/generate`, `currentStep = 2`)

* **What It Shows:**

  * **Breadcrumb/Progress (H3):** “Step 2 of 3: Configure Question Types”
  * **Repeater Section (left/main, 100% on mobile/768px+):**

    * Header: “Select question types and counts”
    * **Repeater Container** (each row = a question-type config):

      1. **Type Dropdown:** Label “Type” → Options: “MCQ,” “True/False,” “Fill-in-the-Blank,” “Short Answer”
      2. **Count Input:** Label “Count” → numeric input (min 1, max 100)
      3. **Remove Row** (trash icon button → deletes that row)
    * **Add Question Type** (Tertiary button below repeater) → adds a blank row
    * **Validation:** show inline error at top if no rows exist or a row is partially filled (“Please select type and count.”)
  * **Summary Panel (right/hidden on mobile):**

    * “You’ve selected:”

      * List of each row’s type & count (e.g., MCQ (5), True/False (3))
  * **Navigation Buttons:**

    * **Back** (Tertiary) → sets `currentStep = 1`
    * **Next** (Primary, disabled until ≥1 valid row)

* **What You Can Do:**

  * Add as many rows as needed (≥1)
  * For each row, pick a Type & Count
  * Remove any row via trash icon
  * Once at least one valid row, click **Next** → `currentStep = 3`

---

### 4.3. Step 3: Extra Notes & Generate (`/generate`, `currentStep = 3`)

* **What It Shows:**

  * **Breadcrumb/Progress (H3):** “Step 3 of 3: Extra Notes & Generate”
  * **Textarea Section (left, full width on mobile, 60% on desktop):**

    * Label: “Additional Notes (Optional)”
    * Placeholder: “E.g., Focus on application-level questions covering Photosynthesis.”
    * Max 500 characters (show live character count below, “345/500”)
  * **Summary Panel (right, 40% on desktop; collapsible on mobile):**

    * **Section Title:** “Review Your Selections”
    * **Bullet List:**

      1. Document: `{{selectedDocumentName}}`
      2. Level: `{{selectedLevel}}`
      3. Subject: `{{selectedSubjectName}}`
      4. Strand: `{{selectedStrandName}}`
      5. Sub-Strand: `{{selectedSubStrandName}}`
      6. Question Types: List from Step 2 rows
      7. Notes: first 100 chars of “Additional Notes”
  * **Navigation Buttons:**

    * **Back** (Tertiary) → `currentStep = 2`
    * **Generate Questions** (Primary) → (a) create `QuestionSetRequest` record, (b) trigger AI workflow, (c) navigate to `/generate/progress?requestId={{...}}`

* **What You Can Do:**

  * Optionally enter guidance for the AI
  * Click **Back** to return to Step 2
  * Click **Generate Questions** (once clicked, ephemeral loading; user immediately lands on Progress screen)

---

### 4.4. Progress Overlay/Page (`/generate/progress?requestId=<id>`)

* **What It Shows:**

  * **Overlay/Page (centered)**

    1. **Title (H2):** “Generating Your Questions…”
    2. **Progress Bar (filled by `progressPct` from DB, polled every 2 sec)**
    3. **Status Text:** “{{progressPct}}% complete. You can leave this page; we’ll notify you when it’s ready.”
    4. **“Go to Dashboard”** (Tertiary) – closes overlay or navigates to `/dashboard`
    5. (Optional) **“View Progress Details”** (Tertiary) – toggles a small panel listing: Parsing → Prompt Build → AI Call → Formatting

* **What You Can Do:**

  * Watch the bar fill from 0→100%
  * Click **Go to Dashboard** anytime (polling continues in background)
  * If wizard completes (`status = complete`), auto-redirect to `/questions/sets/{{setId}}`
  * If `status = failed`, show error in place of bar: “Generation failed—retry or contact support.”

---

#### 4.x Mini User Flow Diagram (Generate Wizard)

```
[/dashboard]  
   └─ Click “Generate New Set” → [/generate (Step 1)]

[/generate (Step 1)]  
   ├─ Fill Doc & Curriculum → Next → [Step 2]  
   └─ (Cancel) → [/dashboard]

[/generate (Step 2)]  
   ├─ Add/configure question rows → Next → [Step 3]  
   └─ Back → [Step 1]

[/generate (Step 3)]  
   ├─ (optional) Add Notes → “Generate Questions” → 
        • Create QuestionSetRequest & trigger AI workflow 
        • Navigate → [/generate/progress?requestId=XYZ]
   ├─ Back → [Step 2]
   └─ “Generate” (Disabled until Step 2 valid)

[/generate/progress?requestId=XYZ]  
   ├─ Poll every 2s → show progress bar 
   │     → (if complete) → [/questions/sets/{{setId}}]  
   │     → (if failed) → Show error + “Retry” or “Go to Dashboard”
   └─ Click “Go to Dashboard” → [/dashboard]
```

---

## **Chunk 5: Review & Edit Questions UI**

> **Goal:** Allow teachers to review, tweak, regenerate, shuffle, and export the AI-generated questions.

### 5.1. Review Page (`/questions/sets/<setId>`)

* **What It Shows:**

  * **Sidebar/ Navbar** (as before)
  * **Breadcrumb (light)**: “Dashboard > My Question Sets > {{subStrandName}}”
  * **Title (H2):** “Review Questions: {{subStrandName}}”
  * **Metadata Row (below title, small text):**

    * Created At: “May 30, 2025 14:23”
    * Subject: “Science”
    * Buttons (right-aligned):

      1. **Regenerate Entire Set** (Secondary, icon: ⟳)
      2. **Shuffle Questions** (Tertiary, icon: ⧓)
      3. **Export to DOCX** (Primary, icon: ↓)
  * **Tabs (under metadata):**

    * MCQ (5), True/False (3), Fill-in (0 disabled), Short Answer (0 disabled)
    * Each label shows count in parentheses
  * **Tab Content (scrollable)**

    * **MCQ Tab** (active by default if count>0):

      * A vertical list of **Question Cards** (24px gap). Each card (elevation 1, 24px padding):

        1. **Header Row:**

           * Title: “Question 1” (H4)
           * **Icons (right):**

             * Regenerate (⟳, Secondary color)
             * Delete (🗑, Danger color)
        2. **Question Text:** “Textarea” (bound to `questionsJSON[0].text`)

           * If empty: show red border + “Question text required.”
        3. **Options (4 rows):**

           * Each row:

             * **Radio Button** (selected if `answer == optionIndex`)
             * **Text Input** (bound to `questionsJSON[0].options[i]`)
           * If fewer than 2 nonempty, card border turns red + “At least 2 options required.”
        4. **Answer Key:** “Answer: {{questionsJSON\[0].answerLabel}}” (14px, success color)
    * **True/False Tab:** Similar, but each card has:

      * “Question 6”
      * Textarea for statement
      * Two toggle buttons: “True” / “False” (success color on selected)
    * **Fill-in** & **Short Answer** tabs are hidden if count=0.
  * **Sticky Footer Bar (always visible at bottom):**

    * **Save Changes** (Primary, left) – disabled until edits detected
    * **Discard Changes** (Tertiary, right) – shows confirm “Discard all unsaved changes?”
  * **Right Sidebar (if desktop, 300px wide; hidden on mobile):**

    * **Help Box (card)**

      * Title: “Review Tips”
      * Bulleted tips (e.g., “Ensure each MCQ has 4 options,” “Use ‘Regenerate’ for a new variant”)
      * Link: **View Curriculum Reference** (opens a small modal showing sub-strand description)

* **What You Can Do:**

  * Switch tabs to view MCQ vs. T/F vs. others
  * Edit any question text or options inline
  * Click **Regenerate Entire Set** → confirm modal → re-runs AI workflow for full set
  * Click **Shuffle Questions** → randomly reorder the questions array and re-render
  * Click **Regenerate (per card)** → re-call AI for this single question, updating that card
  * Click **Delete (per card)** → remove that question from the JSON array → reindex cards
  * As soon as any field changes, “Save Changes” becomes enabled
  * Click **Save Changes** → update `GeneratedQuestionSet.questionsJSON` in DB → toast “Changes saved”
  * Click **Discard Changes** → confirm modal → revert to last saved state
  * Click **Export to DOCX** → run export workflow → show overlay “Preparing DOCX…” → on success, toast “Download ready” with link
  * In right sidebar, click **View Curriculum Reference** → open modal with official NaCCA description of this sub-strand

---

#### 5.x Mini User Flow Diagram (Review & Edit)

```
[/generate/progress?requestId=XYZ] (if complete) → [/questions/sets/ABC]

[/questions/sets/ABC]  
   ├─ Tabs: Click “MCQ (5)” → show 5 MCQ cards  
   ├─ Tabs: Click “True/False (3)” → show 3 T/F cards  
   ├─ Click “Regenerate Entire Set” → [Confirm Modal]  
   │       ├─ “Cancel” → close  
   │       └─ “Confirm” → rerun AI workflow → page reload (or re-fetch data)
   ├─ Click “Shuffle Questions” → questions reorder (no modal)
   ├─ Edit any question field → “Save Changes” button enabled  
   ├─ Click “Save Changes” → update DB → toast “Changes saved”  
   ├─ Click “Discard Changes” → [Confirm Modal] → “Discard” → re-render last saved  
   ├─ Click “Regenerate” icon on a card → rerun AI for that question → update that card  
   ├─ Click “Delete” icon on card → remove question → reindex  
   ├─ Click “Export to DOCX” → [Export Overlay]  
   │       └─ On success → toast “Download ready” with link  
   └─ Click “View Curriculum Reference” in sidebar → [Curriculum Modal]  
          └─ Click “Close” → back
```

---

## **Chunk 6: My Question Sets Listing UI**

> **Goal:** Let teachers see all their generated sets, filter/search, and perform bulk actions.

### 6.1. My Question Sets Page (`/sets`)

* **What It Shows:**

  * **Sidebar/ Navbar**
  * **Page Title (H2):** “My Question Sets”
  * **Top Row (Filters & Search, wrap on mobile):**

    1. **Search Input:** “Search by Sub-Strand or Set Name…” (free text)
    2. **Subject Filter Dropdown:** “All Subjects” + subject list
    3. **Date Range Picker:** Two date fields “From” / “To”
    4. **Status Filter Dropdown:** “All,” “Draft,” “Completed”
    5. **Clear Filters** (Tertiary button)
  * **Generate New Set** (Primary, top-right, same row as filters on desktop; below on mobile)
  * **Sets Table (full width):**

    * **Columns:**

      1. **Select Checkbox** (for bulk)
      2. **Created At** (`{{createdAt | MMM D, YYYY}}`)
      3. **Sub-Strand** (`{{subStrand.name}}`)
      4. **Question Count** (`{{LEN(questionsJSON)}}`)
      5. **Status** (`{{status}}`)
      6. **Actions:**

         * **Review** (eye icon) → `/questions/sets/{{id}}`
         * **Export** (download icon) → if not yet exported run export, else link
         * **Delete** (trash icon) → confirm modal
    * **Pagination Controls:** “Showing 1–10 of 54 sets” + prev/next buttons
    * **Empty State:** If no sets → illustration + “No question sets yet” + “Generate New Set” (Primary)

* **What You Can Do:**

  * **Search/Filter** the list by keyword, subject, date range, status → table updates
  * **Click “Generate New Set”** → `/generate` (Step 1)
  * In each row:

    * **Review** → `/questions/sets/{{id}}`
    * **Export** → runs or links to DOCX
    * **Delete** → confirm modal → removes record
  * **Select Multiple Rows** via checkboxes → shows **Bulk Actions Bar** above table:

    * **Delete Selected** (Secondary) → confirm → deletes all
    * **Export Selected (ZIP)** (Primary) → run batch export workflow → toast with ZIP link

---

#### 6.x Mini User Flow Diagram (My Question Sets)

```
[/dashboard]  
   └─ Click “My Question Sets” → [/sets]

[/sets]  
   ├─ (Filters/Search update table in real time)  
   ├─ Click “Generate New Set” → [/generate]  
   ├─ Table Row:  
   │     ├─ “Review” → [/questions/sets/{{id}}]  
   │     ├─ “Export” → runs export if needed or downloads  
   │     └─ “Delete” → [Confirm Modal] → deletes row  
   ├─ Select multiple checkboxes → Bulk Actions appear  
   │     ├─ “Delete Selected” → [Confirm Modal] → delete all  
   │     └─ “Export Selected (ZIP)” → batch export workflow → ZIP link  
   └─ Pagination: click “Next”/“Prev” → updates rows
```

---

## **Chunk 7: Billing & Subscription UI**

> **Goal:** Enable teachers to see their current plan, upgrade/downgrade, and manage payment methods.

### 7.1. Billing & Subscription Page (`/billing`)

* **What It Shows:**

  * **Sidebar/ Navbar**
  * **Page Title (H2):** “Billing & Subscription”
  * **Current Plan Card (centered or left on desktop):**

    * **Card (elevation 1, 24px padding):**

      * **Title (H3):** “Current Plan: {{plan.name}}”
      * **If plan has limit:**

        * “You’ve used {{usageThisMonth}} / {{plan.monthlyLimit}} questions this month.”
        * **Progress Bar:** fill = `(usageThisMonth/plan.monthlyLimit)*100%`
        * If over limit: show “Upgrade to Pro” (Primary)
      * **If on Pro or Institutional:**

        * “Next billing date: {{nextBillingDate}}” (Small text)
        * **Buttons:**

          * “Change Plan” (Secondary)
          * “Cancel Subscription” (text, Danger)
  * **Available Plans Section (below or right):**

    * **Repeater** bound to `Plans` table. Each plan card (width 300px):

      * **Title (H3):** `plan.name`
      * **Price:** `plan.currency + plan.price + "/mo"`
      * **Feature List:** bullet points from `plan.featuresJSON`
      * **Select / Upgrade Button:**

        * If `plan.id ≠ currentPlan.id`: “Select” (Primary if it’s a paid plan, Tertiary if it’s downgrading to Free).
        * If `plan.id = currentPlan.id`: “Current Plan” (Disabled, Secondary)
  * **Payment Method Section (below Available Plans):**

    * If on Pro:

      * **Card Display:** “Visa \*\*\*\* 4242” (or similar masked)
      * Button: **Update Payment Method** (Secondary) → opens Stripe Elements modal
    * If on Free: nothing or “You’re on Free plan – no payment method needed.”
  * **Payment History Table (bottom):**

    * **Columns:** Date, Amount, Status, Invoice (link)
    * Binds to `PaymentTransaction` filtered by `userID = currentUser.id`
    * **Empty State:** “No transactions yet.”
  * **FAQ Accordion (very bottom):**

    * Bound to a static `BillingFAQ` table (e.g., “Can I cancel any time?”, etc.)

* **What You Can Do:**

  * **If on Free & over limit:** click **Upgrade to Pro** → starts Stripe Checkout
  * **If on Free & under limit:** click **Select Pro** or **Select Institutional** → Stripe Checkout
  * **If on Pro:** click **Change Plan** → shows Available Plans cards to switch
  * **If on Pro:** click **Cancel Subscription** → confirm modal “Are you sure? You’ll revert to Free.”
  * **If on Pro:** click **Update Payment Method** → Stripe Elements form → on success, update `User` default payment method
  * **In Payment History:** click **Invoice** → open invoice PDF in new tab

---

#### 7.x Mini User Flow Diagram (Billing)

```
[/dashboard]  
   └─ Click “Billing & Subscription” → [/billing]

[/billing]  
   ├─ If on Free:  
   │     ├─ “Current Plan: Free” + usage bar  
   │     └─ “Select Pro” (Primary) or “Select Institutional”  
   ├─ If on Pro:  
   │     ├─ “Current Plan: Pro” + next billing date + usage bar  
   │     ├─ “Change Plan” → scroll to Available Plans  
   │     │     └─ Choose another plan → Stripe Checkout  
   │     ├─ “Cancel Subscription” → [Confirm Modal] → cancel → revert to Free  
   │     └─ “Update Payment Method” → Stripe Elements modal → on success update card  
   ├─ Available Plans Section (Repeater):  
   │     └─ Click “Select” → Stripe Checkout → on success update `User.planID`  
   └─ Payment History Table:  
         └─ Click “Invoice” → open PDF
```

---

## **Chunk 8: Profile & Settings UI**

> **Goal:** Allow teachers to update personal info, notification preferences, and security settings.

### 8.1. Profile & Settings Page (`/settings`)

* **What It Shows:**

  * **Sidebar/ Navbar**
  * **Page Title (H2):** “Profile & Settings”
  * **Tabs (across, below title):**

    1. **Profile**
    2. **Notifications**
    3. **Security**
  * **Tab Content (changes based on active tab)**

---

#### 8.2. Profile Tab

* **What It Shows:**

  * **Form Container (max-width 600px):**

    1. **Full Name (input)** bound to `User.fullName`
    2. **Email (input, read-only)** showing `User.email`

       * Button: **Change Email** (Small, Secondary) → opens **Change Email Modal**
    3. **School Name (input, optional)** bound to `User.schoolName`
    4. **Change Password Section:**

       * **Current Password (input** type=“password”)
       * **New Password (input)**
       * **Confirm New Password (input)**
       * Button: **Change Password** (Primary) – disabled until fields valid
    5. **Save Changes** (Primary) & **Cancel** (Tertiary) at bottom

* **What You Can Do:**

  * Update **Full Name** → valid → “Save Changes” enabled → click → update DB → toast “Profile updated”
  * Click **Change Email** → open **Change Email Modal** (see below)
  * Fill in **Change Password** fields → click **Change Password** → workflow verifies `currentPassword` and updates to `newPassword` → show toast “Password changed”
  * Click **Cancel** → revert to last saved values

---

#### 8.3. Change Email Modal

* **What It Shows:**

  * **Overlay → Modal (600px)**

    1. **Title (H3):** “Change Email”
    2. **Form:**

       * **New Email (input)**
       * **Confirm New Email (input)**
       * Inline validation: must match and be a properly formatted email
    3. **Buttons:** **Cancel** (Tertiary) & **Submit** (Primary, disabled until valid)

* **What You Can Do:**

  * Enter a new, valid email → click **Submit** → workflow:

    1. Update `User.email` = new value (flag `emailVerified = false`)
    2. Send verification email → show toast “Check new email to verify”
    3. Close modal
  * Click **Cancel** → close modal without saving

---

#### 8.4. Notifications Tab

* **What It Shows:**

  * **Form Container (max-width 600px):**

    1. **Toggle:** “Email me when my question set is ready” (bind to `User.notifyOnSetReady`)
    2. **Toggle:** “In-app notifications for updates & new features” (bind to `User.notifyInApp`)
    3. **Toggle:** “Receive monthly usage summary email” (bind to `User.notifyUsageSummary`)
    4. **Save Preferences** (Primary) & **Cancel** (Tertiary)

* **What You Can Do:**

  * Flip any toggle → “Save Preferences” enabled → click → update DB → toast “Preferences updated”
  * Click “Cancel” → revert toggles to last saved state

---

#### 8.5. Security Tab

* **What It Shows:**

  * **Login Activity (Repeater):**

    * Columns: “Date & Time,” “Device Info” (e.g., “Chrome on Windows, Accra”)
    * Binds to `LoginHistory` for currentUser (last 5 entries)
  * **Button:** “Logout from all other devices” (Secondary)
  * **Placeholder:** “Enable Two-Factor Authentication (Coming Soon)” (grayed out toggle)

* **What You Can Do:**

  * **View Last 5 Login Sessions** (read-only)
  * Click **Logout from all other devices** → confirm modal (“Are you sure?”) → if yes → clear other sessions → toast “Other sessions logged out”
  * (2FA toggle is disabled until implemented)

---

#### 8.x Mini User Flow Diagram (Profile & Settings)

```
[/dashboard]  
   └─ Click “Profile & Settings” → [/settings]

[/settings]  
   ├─ Tabs:  
   │     ├─ “Profile” → shows profile form  
   │     │     ├─ Edit fields → “Save Changes” → update DB → toast  
   │     │     └─ “Change Email” → [Change Email Modal]  
   │     │           ├─ Fill new email → “Submit” → send verification → close  
   │     │           └─ “Cancel” → close  
   │     ├─ “Notifications” → shows toggles  
   │     │     ├─ Toggle changes → “Save Preferences” → update DB → toast  
   │     │     └─ “Cancel” → revert  
   │     ├─ “Security” → shows login history + “Logout Other Devices” button  
   │     │     └─ Click “Logout Other Devices” → [Confirm Modal] → logout others → toast  
   │     └─ “2FA” toggle disabled
   └─ Sidebar navigation (other items)
```

---

## **Chunk 9: Help & Support UI**

> **Goal:** Let teachers search FAQs and submit support tickets.

### 9.1. Help & Support Page (`/support`)

* **What It Shows:**

  * **Sidebar/ Navbar**
  * **Page Title (H2):** “Help & Support”
  * **Search Bar (wide):** “Search FAQs…”
  * **Popular FAQs (Accordion):** bound to `FAQ` table (e.g., collection of common Q\&A)

    * Each item:

      * **Question (Toggle Header)** – on expand, reveal `answer` (rich text)
    * If search text is entered, filter FAQs whose `question` or `answer` contains that text
  * **Contact Form (below FAQs):**

    1. **Subject (Dropdown):** “Technical Issue,” “Billing,” “Feature Request”
    2. **Message (Textarea, max 2000 chars)**
    3. **Attach Screenshot (File Upload, optional)**
    4. **Submit Ticket** (Primary) & **Reset/Clear** (Tertiary)
  * **Success Message:** On submit → “Thank you! Your ticket #1234 has been submitted. We’ll respond within 24 hours.” (replaces form)

* **What You Can Do:**

  * Type in **Search** → FAQs accordion filters in real time
  * Expand/collapse any FAQ → reveals answer
  * Fill **Contact Form** → click **Submit Ticket** → create `SupportTicket` row → send email notification to support → show success message
  * Click **Reset** → clear all fields

---

#### 9.x Mini User Flow Diagram (Help & Support)

```
[/dashboard]  
   └─ Click “Help & Support” → [/support]

[/support]  
   ├─ Type in “Search FAQs…” → filter accordion items in real time  
   ├─ Click to expand any FAQ → view answer  
   ├─ Fill Contact Form  
   │     ├─ (optional) Attach screenshot  
   │     ├─ Click “Submit Ticket” → create SupportTicket → send email → replaces form with success message  
   │     └─ Click “Reset” → clear all fields  
   └─ Sidebar navigation (other items)
```

---

## Prioritization & Sprint Recommendations

Below is a suggested order of chunks to build, with rough sprint groupings (assuming 2-week sprints). In each sprint, focus **solely on the UI**—static data or mock responses are fine initially; wiring up real data and workflows can follow later.

| **Sprint** | **Chunks (UI Only)**                |  **Notes**                                                                                                                 |
| ---------- | ----------------------------------- |  ------------------------------------------------------------------------------------------------------------------------- |
| Sprint 1   | Chunk 1: Landing & Auth             |     Build Landing, Register, Login, Forgot Password, Reset Password screens. Hot-path for sign-up/log-in                      |
| Sprint 2   | Chunk 2: Dashboard & Sidebar        |       Build sidebar/menu and dashboard layout (cards + table placeholders) without data wiring                                  |
| Sprint 3   | Chunk 3: Document Management              | Build “My Documents” page, Upload Modal UI, Details & Delete flows with static placeholders                               |
| Sprint 4   | Chunk 4: Generate Wizard (Step 1–3)       | Build Steps 1–3 screens with form controls, summary panels, validation. Skip actual AI calls; use placeholders for “Next” |
| Sprint 5   | Chunk 4.4: Progress Screen              | Build “Progress” page/modal with dummy progress bar. On “100%” simulate redirect to Review screen                         |
| Sprint 6   | Chunk 5: Review & Edit Questions UI    | Build tabs, question card templates, edit fields, save/discard bar, export button (no real export)                        |
| Sprint 7   | Chunk 6: My Question Sets Listing       | Build sets table, filters, bulk actions UI with static data                                                               |
| Sprint 8   | Chunk 7: Billing & Subscription UI  |  Build plan cards, current plan view, payment history table with dummy rows (no real Stripe wiring)                        |
| Sprint 9   | Chunk 8: Profile & Settings         |  Build profile forms, change email modal, notifications toggles, security tab (login history dummy)                        |
| Sprint 10  | Chunk 9: Help & Support             |  Build FAQ accordion, search bar, contact form UI (no backend)                                                             |

> **Note:** Each chunk listed above assumes you’re building purely the UI layouts and navigation flows. In parallel (or immediately after), you can scaffold out the necessary data models/workflows in Vibe to power them. But this breakdown ensures you can launch clickable prototypes for user testing as early as Sprint 2.

---

### Summary of Screen Hierarchy

```
[Landing Page "/"]  
   │  
   ├─ "/auth/register"  
   ├─ "/auth/login"  
   │     ├─ "/auth/forgot-password"  
   │     └─ "/auth/reset-password?token=…"  
   │  
   └─ After login → "/dashboard"  
         ├─ Sidebar:  
         │     ├─ Dashboard (home)  
         │     ├─ "/generate" (Step 1–3 & Progress)  
         │     ├─ "/documents"  
         │     │     ├─ [Upload Modal]  
         │     │     └─ [Details Modal]  
         │     ├─ "/sets"  
         │     │     ├─ Bulk Export (ZIP Modal)  
         │     │     └─ Delete Confirm Modal  
         │     ├─ "/billing"  
         │     │     ├─ Plan Cards  
         │     │     ├─ Update Payment (Stripe Modal)  
         │     │     └─ Cancel Confirm Modal  
         │     ├─ "/settings"  
         │     │     ├─ Tab: Profile  
         │     │     │     └─ [Change Email Modal]  
         │     │     ├─ Tab: Notifications  
         │     │     └─ Tab: Security  
         │     └─ "/support"  
         │           └─ Contact Form (Submit / Reset)  
         │  
         └─ "/questions/sets/:setId"  
               ├─ Tabs: MCQ / T/F / Fill-in / Short Answer  
               ├─ Question Cards (regenerate/delete per card)  
               ├─ Save/Discard Bar  
               └─ Export (Export Overlay Modal)
```

---
