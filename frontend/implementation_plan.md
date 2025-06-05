Below is the revised project documentation—written from the standpoint of a Head of Product with 30 years of experience in education software—specifically updated to assume the application will be built using a no-code/low-code AI-powered platform such as Vibe (formerly Windsurf) or a similar tool. Where appropriate, I’ve indicated how each phase or component can be approached using no-code constructs (data models, visual workflows, built-in authentication modules, API connectors, etc.) rather than traditional hand-coding.

---

# 1. Step-by-Step Implementation Plan (No-Code Approach)

Building with a no-code AI platform (e.g., Vibe/Windsurf) changes the mechanics of implementation: rather than writing code files, you configure data schemas, drag-drop UI components, and wire up API calls visually. However, the high-level phases remain the same. Each phase below describes *how* to realize our features using no-code tools.

## 1.1 Phase I: Discovery & Research (1–2 weeks)

### 1.1.1 Kick-off & Stakeholder Alignment

* **Objective:** Clarify vision, scope, KPIs, and constraints with GES/NaCCA liaisons and pilot teachers.
* **Activities:**

  1. **Project Charter Workshop:** Document goals (e.g., “Cut teacher prep time by 50%,” “90% satisfaction in pilot”). Use a shared Confluence/Notion page or similar.
  2. **Roles & Responsibilities Matrix:** Identify who will configure the no-code platform, who will manage curriculum data, who handles pilot teacher training.

### 1.1.2 Curriculum & Domain Analysis

* **Objective:** Create a master spreadsheet (CSV/Google Sheets) with JHS/SHS curriculum taxonomy that can be imported into the no-code platform’s “Data Models” section.
* **Activities:**

  1. **Obtain Official Syllabi:** Gather NaCCA/GES PDFs for all targeted subjects.
  2. **Curriculum Data Mapping:** In a Google Sheet, list each subject → strand → sub-strand → learning outcome code. Mark cognitive level (e.g., Bloom’s taxonomy) if available.
  3. **Import to No-Code DB:** Use Vibe’s Data Model import (CSV upload) to define tables:

     * `Subject` (ID, Name)
     * `Strand` (ID, SubjectID, Name, Code)
     * `SubStrand` (ID, StrandID, Name, Code, CognitiveLevel).

### 1.1.3 Competitive & Technical Landscape Scan

* **Objective:** Understand how peer no-code/AI question tools function (e.g., Questgen, PrepAI) and confirm the AI integration approach.
* **Activities:**

  1. **Feature Audit:** List features common to AI-driven question generators (e.g., PDF parsing, multi-format output, curriculum alignment).
  2. **No-Code Feasibility Assessment:** Confirm Vibe has built-in PDF/DOCX importers, REST API connectors, and ability to call OpenAI/Azure AI endpoints. Document any limitations (e.g., file-size limits, API quotas).

### 1.1.4 User Research & Validation

* **Objective:** Validate workflows with 8–12 teachers, iterating on no-code “MVP prototypes” as we go.
* **Activities:**

  1. **Low-Fidelity Prototype in Vibe:** Quickly assemble a few pages (e.g., login, dashboard, document upload) with placeholder fields.
  2. **Teacher Interviews:** Present the Vibe prototype via screensharing, gather feedback on navigation and labeling.
  3. **Persona & Journey Map:** Create 2–3 personas (e.g., “Rural JHS Science Teacher, limited connectivity,” “Urban SHS English Teacher, higher digital literacy”) and map their ideal flows.

### 1.1.5 Requirement Refinement & Prioritization

* **Objective:** Finalize “no-code backlog” in a project management tool (e.g., Trello, Asana), dividing into MVP vs. Phase 2.
* **Activities:**

  1. **Review & Update SRS:** Confirm that each feature can be built in Vibe (e.g., PDF/DOCX upload, AI integration, DOCX export).
  2. **Prioritize Features (MoSCoW):**

     * **Must:** User auth, document upload, curriculum selection, AI question generation (MCQ), DOCX export.
     * **Should:** Support for T/F and fill-in-the-blank, subscription gating, usage dashboard.
     * **Could:** Offline/low-bandwidth capabilities, peer review library.
     * **Won’t (for initial release):** Built-in local language support, SSO.

3. **Sprint 0 Setup Checklist:**

   * Ensure Vibe account is provisioned with appropriate access.
   * Confirm integrations enabled (OpenAI/Azure AI, Stripe/Flutterwave, SendGrid).
   * Create a shared “Vibe Workspace” folder for assets (images, PDF samples, curriculum CSV).

---

## 1.2 Phase II: Platform Configuration & Technical Design (2–3 weeks)

In a no-code environment, “architecture” is largely defined by how you model your data, configure page templates, and wire up API calls. The steps below guide you through setting up the core building blocks in Vibe (or a similar platform).

### 1.2.1 Define Data Models (Vibe Data Studio)

* **Objective:** Replicate the database schema inside Vibe’s Data Models section.
* **Activities:**

  1. **Create “User” Table:**

     * Fields: `id (auto)`, `fullName (text)`, `email (text, unique)`, `passwordHash (text)`, `role (enum: teacher/admin)`, `subscriptionPlanID (relation)`, `emailVerified (boolean)`, `createdAt (timestamp)`, `updatedAt (timestamp)`.
     * Enable Vibe’s built-in “Authentication” to manage sign-ups and logins, storing users in this table automatically.
  2. **Create “SubscriptionPlan” Table:**

     * Fields: `id (auto)`, `name (text)`, `monthlyLimit (number)`, `price (decimal)`, `currency (text)`, `featuresJSON (rich text or JSON)`.
  3. **Create “Document” Table:**

     * Fields: `id (auto)`, `userID (relation to User)`, `fileName (text)`, `fileType (text)`, `fileSize (number)`, `storageURL (text)`, `uploadedAt (timestamp)`.
     * Configure Vibe’s “File Storage” to point to a linked S3/Blob bucket, so uploading a file row saves the file and populates `storageURL`.
  4. **Create “Subject” / “Strand” / “SubStrand” Models:**

     * **Subject:** `id (auto)`, `name (text)`, `level (enum: JHS/SHS)`.
     * **Strand:** `id (auto)`, `subjectID (relation)`, `name (text)`, `code (text)`.
     * **SubStrand:** `id (auto)`, `strandID (relation)`, `name (text)`, `code (text)`, `cognitiveLevel (enum: Knowledge/Application/Evaluation, etc.)`.
     * Link them so that Vibe auto-generates lookups (e.g., when choosing a subject, Vibe can filter related strands).
  5. **Create “QuestionSetRequest” Table:**

     * Fields: `id (auto)`, `userID (relation)`, `documentID (relation)`, `subjectID (relation)`, `strandID (relation)`, `subStrandID (relation)`, `questionConfig (JSON)`, `extraNotes (text)`, `status (enum: pending/in_progress/complete/failed)`, `progressPct (number)`, `createdAt (timestamp)`, `updatedAt (timestamp)`.
  6. **Create “GeneratedQuestionSet” Table:**

     * Fields: `id (auto)`, `requestID (relation to QuestionSetRequest)`, `questionsJSON (JSON blob)`, `version (number)`, `exportStatus (enum: pending/ready/failed)`, `exportURL (text)`, `createdAt (timestamp)`, `updatedAt (timestamp)`.
  7. **Create “UsageRecord” Table (Optional, if needed):**

     * Fields: `id (auto)`, `userID (relation)`, `questionCount (number)`, `timestamp (timestamp)`. Vibe can automatically track usage via workflows.

### 1.2.2 Configure Authentication & User Management

* **Objective:** Leverage Vibe’s built-in Authentication module to handle sign-up, login, password resets, and email verification without writing any code.
* **Activities:**

  1. **Enable Email/Password Authentication:**

     * In Vibe’s Authentication settings, toggle on “Email & Password” and configure email templates via an SMTP or SendGrid integration.
  2. **Email Verification Workflow:**

     * Enable “Email Verification” so that on sign-up, Vibe sends a link. Configure the click URL to `https://yourapp.com/auth/verify?token={{token}}`.
     * In the “Email Templates” section, edit subject/body to reference your branding and next steps.
  3. **Password Reset Workflow:**

     * Enable “Forgot Password” functionality. Vibe automatically generates a secure reset token and email. Customize the template to say:
       “Click here to reset your password.” with link: `https://yourapp.com/auth/reset-password?token={{token}}`.
  4. **Role Assignment (Teacher vs. Admin):**

     * After sign-up, default `role = teacher`. If you need an Admin interface later, you can manually set `role = admin` in the user’s row.

### 1.2.3 Set Up File Storage for Documents & Exports

* **Objective:** Use Vibe’s integrated File Storage (backed by an S3/Blob bucket) to handle uploads (PDF/DOCX/PPTX) and store generated DOCX files.
* **Activities:**

  1. **Link to Cloud Storage Provider:**

     * In Vibe’s settings, configure the File Storage to point to your AWS S3 bucket (or Azure Blob) using credentials.
     * Create two “buckets” or “folders”:

       * `/uploads/` (for teacher reference documents)
       * `/exports/` (for generated `.docx` files)
  2. **Configure Document Model Field:**

     * In the `Document` table, add a “File” field type. Choose “Upload to /uploads/.” Vibe will auto-populate `fileName`, `fileType`, `fileSize`, and `storageURL`.
  3. **Configure Export Field:**

     * In the `GeneratedQuestionSet` table, add a “File URL” (text) field for `exportURL`.
     * We will populate this via a no-code “backend workflow” after generating a DOCX temporarily to local Vibe storage, then push to `/exports/` and save the resulting URL.

### 1.2.4 Wire Up AI Integration (OpenAI/Azure) via API Connector

* **Objective:** Use Vibe’s “API Connector” feature to call the AI service (OpenAI or Azure OpenAI) when generating questions.
* **Activities:**

  1. **Provision AI Credentials:**

     * Obtain an API key from OpenAI (or Azure OpenAI) and store it securely in Vibe’s secrets manager.

  2. **Configure API Connector:**

     * In Vibe’s “Integrations” panel, create a new REST API connection:

       * **Endpoint Base URL:** `https://api.openai.com/v1/chat/completions` (or Azure’s equivalent).
       * **Authentication:** Set header `Authorization: Bearer {{AI_API_KEY}}` (pull from secrets).
       * **Timeouts:** Set a 30s timeout to account for longer generation times.

  3. **Define a No-Code Workflow:**

     * In Vibe’s “Automation” or “Workflows” area, create a workflow triggered when a new `QuestionSetRequest` row is inserted (status = “pending”).
     * Steps in the workflow:

       1. **Extract Document Text:**

          * Use Vibe’s built-in “Text Extraction” module (if available) or a code-free “Custom Function” that calls a PDF-to-text service. Alternatively, extract text client-side on upload and store in a separate `documentText` field.
       2. **Build AI Prompt Payload:**

          * Construct a JSON object:

            ```json
            {
              "model": "gpt-4",
              "messages": [
                {
                  "role": "system",
                  "content": "You are an AI tutor specialized in Ghanaian JHS/SHS curricula. Generate questions aligned to the given sub-strand."
                },
                {
                  "role": "user",
                  "content": "Generate {{count_mcq}} MCQs with 4 choices each, {{count_tf}} True/False, etc., based on this text: {{documentText}}. Sub-strand: {{subStrandName}} ({{subStrandCode}})."
                }
              ],
              "max_tokens": 1500,
              "temperature": 0.7
            }
            ```
          * Use Vibe’s “Set Variable” block to assemble this JSON, pulling in fields from `QuestionSetRequest` (e.g., `questionConfig`, `extraNotes`, `documentID → documentText`).
       3. **Call AI API:**

          * Add a “REST API Call” block that uses the configured connector, sending the prompt JSON.
       4. **Parse AI Response:**

          * The API returns a `choices[0].message.content` string containing question data (e.g., in JSON or a structured format).
          * Use Vibe’s “Parse JSON” block (no-code JSON parser) to extract an array of questions.
       5. **Insert into GeneratedQuestionSet:**

          * Create a new row in `GeneratedQuestionSet`, setting:

            * `requestID` = current `QuestionSetRequest.id`
            * `questionsJSON` = parsed array of question objects
            * `status` = “complete”
            * `createdAt` = now.
       6. **Update Request Status:**

          * Update the original `QuestionSetRequest` row: `status` → “complete,” `progressPct` → 100.
       7. **(Optional) Notify Teacher:**

          * Use Vibe’s “Send Email” block to email the teacher: “Your question set is ready! Visit Review page.”

  4. **Error Handling:**

     * If the API call fails or returns an error, catch it in an “If Error” branch in the workflow. Update `QuestionSetRequest.status` → “failed” and store `errorMessage`. Send an email or in-app notification: “Generation failed—please try again.”

### 1.2.5 Design Data-Driven Pages (Frontend)

* **Objective:** Visually compose each page—login/register, dashboard, document upload, generate wizard, review/edit—using Vibe’s Page Builder.
* **Activities:**

  1. **Login/Register Pages (Auto-Generated):**

     * Vibe’s Authentication module provides pre-built login/register UI components. You can customize labels, colors, and field order but the logic is auto-wired to the `User` model.

  2. **Dashboard Page (`/dashboard`):**

     * **Header / Navbar:** Drop in a “Navbar” component from Vibe’s UI library—set its background to Navy (#1E3A8A), add a logo on left, and a “Logout” button on right.
     * **Sidebar:** Use Vibe’s “Sidebar” component, configure menu items (Dashboard, Generate, My Documents, My Sets, Billing, Profile, Help). Assign appropriate icons (Feather/Heroicons) and link each to the corresponding page slug.
     * **Main Content Area:**

       * **Usage Snapshot Card:** Drag a “Card” component, bind its text fields to a Vibe “Script” or “Formula” that sums `UsageRecord.questionCount` for the current user in the current month and compares to `SubscriptionPlan.monthlyLimit`. Display “X / Y” in a “Progress Bar” component.
       * **Recent Activity Table:** Drag a “Table” component, connect its data source to `GeneratedQuestionSet` filtered by `userID = currentUser.id`, sorted by `createdAt DESC`. In the “Actions” column, add buttons (“Review,” “Export,” “Delete”) that trigger relevant page navigations or or workflows.
       * **Tips Carousel:** Use a “Carousel” component, manually enter 2-3 tip slides or pull from a `Tips` static collection.

  3. **My Documents Page (`/documents`):**

     * **Upload Button:** Drop in a “File Upload” component linked to the `Document.file` field. Configure upload destination to `/uploads/`.
     * **Document List/Table:** Use a “Table” bound to `Document` where `userID = currentUser.id`. Include columns for “fileName,” “uploadedAt,” “fileSize,” and a “View” button (which links to a “Document Details” modal) and “Delete” button (which triggers a Vibe “Delete Record” action).
     * **Empty State:** Configure a “Conditional Display” area: if `Document` count = 0, show an illustration + text + “Upload New Document” button.

  4. **Generate New Set Wizard (`/generate`):**

     * Vibe doesn’t always have a built-in “multi-step wizard,” but you can simulate it with a single page and conditional “Step” sections.
     * **Step 1 UI (Curriculum & Document):**

       * Dropdown for “Select Document” (bind to `Document` where `userID = currentUser.id`).
       * Radio Group for “Class Level” (options: JHS, SHS).
       * Dropdown for “Subject” bound to `Subject` where `Subject.level = selectedLevel`.
       * Dropdown for “Strand” bound to `Strand` where `Strand.subjectID = selectedSubjectID`.
       * Dropdown for “Sub-Strand” bound to `SubStrand` where `SubStrand.strandID = selectedStrandID`.
       * “Next” button. On click, run a “Set Page Variable” to `currentStep = 2`.
       * **Validation Rule:** Use Vibe’s “Form Validation” feature to ensure all fields have values; disable “Next” until valid.
     * **Step 2 UI (Question Config):**

       * Use a “Repeater” component bound to a temporary “QuestionConfig” collection (local page state). Each repeater row:

         * Dropdown for `type` (MCQ, True/False, Fill-in, Short Answer).
         * Numeric Input for `count` (min=1, max=100).
         * “Remove Row” button to delete the repeater item.
       * “Add Question Type” button adds a new item to the repeater.
       * “Back” and “Next” buttons: “Back” sets `currentStep = 1`; “Next” sets `currentStep = 3`, provided at least one valid row exists.
     * **Step 3 UI (Extra Notes & Generate):**

       * Textarea bound to a page variable `extraNotes`.
       * “Back” sets `currentStep = 2`; “Generate” triggers a Vibe “Create Record” action on `QuestionSetRequest` with fields:

         ```json
         {
           "userID": "{{currentUser.id}}",
           "documentID": "{{selectedDocumentID}}",
           "subjectID": "{{selectedSubjectID}}",
           "strandID": "{{selectedStrandID}}",
           "subStrandID": "{{selectedSubStrandID}}",
           "questionConfig": "{{QuestionConfigCollection}}", 
           "extraNotes": "{{extraNotes}}",
           "status": "pending"
         }
         ```
       * Immediately after record creation, Vibe runs the “AI Generation” workflow (see Section 1.2.4). Then navigate to a “Progress” screen or show a modal with `currentStep = 4`.
     * **Step 4 UI (Progress & Notification):**

       * On page load of Step 4, use Vibe’s “Poll Data” feature: every X seconds, query `QuestionSetRequest` where `id = newRequestID` to fetch `status` and `progressPct`.
       * Bind a “Progress Bar” component to `progressPct`.
       * When `status = complete`, navigate automatically to `/questions/sets/{{setID}}` (you can store `GeneratedQuestionSet.id` in a page variable during the AI workflow).
       * If `status = failed`, show an error message and a “Retry” button that sets `status = pending` and re-invokes the workflow.

### 1.2.6 Design Data-Driven Pages (Continued)

5. **Review & Edit Questions Page (`/questions/sets/:setId`):**

   * **Data Binding:** Bind the page to a single record of `GeneratedQuestionSet` (lookup by `setId` passed in the URL).
   * **Header / Breadcrumb:** Use Vibe’s “Dynamic Text” component to show `questionsSet.requestID → subStrand.name` and `createdAt`.
   * **Tabs (MCQ, True/False, etc.):** In the Vibe UI, create a “Tabs” component with dynamic visibility:

     * Each tab’s label is `typeName + " (" + questionCount + ")"`, where `questionCount` is derived via a small Vibe formula that counts how many objects in `questionsJSON` have `type = "MCQ"`, etc.
   * **Question Cards:** Use a “Repeater” component bound to `questionsJSON`. Inside the repeater:

     * If `type = MCQ`, render a template:

       1. **“Question X”** text (X = index).
       2. **Textarea** bound to `questionsJSON[index].text` (editable).
       3. **Repeater** nested inside for options (bind to `questionsJSON[index].options[]`), each row has:

          * Custom “Radio” component: if `questionsJSON[index].answer = optionValue`, mark selected.
          * Text Input bound to `optionValue`.
       4. **Answer Key** (Dynamic Text) bound to `questionsJSON[index].answer`.
       5. **“Regenerate” Icon Button:** On click, run a Vibe workflow that:

          * Calls AI API for a single question (similar to main workflow, but for only that index), updates `questionsJSON[index]` accordingly.
       6. **“Delete” Icon Button:** Deletes this item from `questionsJSON`.
     * If `type = TrueFalse`, render a similar pattern with a statement textarea and a toggle.
     * Etc.
   * **Bulk Actions (Top Right):**

     * **“Regenerate Entire Set” Button:** On click, run a workflow that resets `status = pending` on `QuestionSetRequest`, triggering the AI workflow to overwrite `questionsJSON`.
     * **“Shuffle Questions” Button:** On click, run a Vibe “Custom Function” that randomizes the order of items in `questionsJSON`.
     * **“Export to DOCX” Button:** On click, run a workflow:

       1. **Set `exportStatus = pending`** on `GeneratedQuestionSet`.
       2. **Invoke a “Custom Function”** or “API Call” that packages `questionsJSON` into a `.docx` using Vibe’s “Document Generation” plugin (if available), or calls a small serverless endpoint (AWS Lambda) that uses a headless library (e.g., `docx`) to generate the file and uploads to `/exports/`.
       3. Upon successful upload, update `GeneratedQuestionSet.exportStatus = ready`, and set `exportURL` to the pre-signed URL.
       4. Notify teacher via email or in-app toast.
   * **Save/Publish Sticky Bar:**

     * **“Save Changes” Button:** Triggers Vibe to `Update Record` of `GeneratedQuestionSet` with the modified `questionsJSON`.
     * **“Discard Changes” Button:** Re-query the record from the DB to reset local changes (Vibe can rebind the repeater to fresh data).
   * **Help Sidebar (Right):** Use a “Sidebar Panel” with static text or a repeater bound to a `Tips` collection keyed by `subStrandID`.
   * **Conditional Display:** If `exportStatus = ready`, show a “Download Now” link (bind to `exportURL`). If `exportStatus = pending`, show “Preparing document…”.

6. **My Question Sets Page (`/sets`):**

   * **Search & Filter Controls:**

     * Use Vibe’s “Search Input” component for free-text filtering on `setName` or sub-strand names.
     * Use a “Dropdown Filter” bound to `Subject` to filter by subject.
     * For date range, use Vibe’s “Date Picker” for “From” and “To,” filter `createdAt` accordingly.
     * For status, use a “Radio Group” (All, Draft, Completed).
   * **Table of Sets:** Use a “Table” component bound to `GeneratedQuestionSet` filtered by `currentUser.id`.

     * Each row: `createdAt`, `subStrand.name`, `questionCount` (via a Vibe formula: `LEN(questionsJSON)`), `status`, and action buttons:

       * **“Review”** (navigates to `/questions/sets/{{id}}`)
       * **“Export”** (calls the same DOCX workflow if `exportStatus ≠ ready` or direct link if ready)
       * **“Delete”** (runs a “Delete Record” action).
   * **Bulk Actions:**

     * Above table, an “Actions” dropdown: “Delete Selected” (runs a batch delete workflow) and “Export Selected (ZIP)”—for the latter, run a serverless lambda to zip multiple DOCX URLs and return a single link.

7. **Billing & Subscription Page (`/billing`):**

   * **Current Plan Card:**

     * Use a “Card” component dynamically bound to `SubscriptionPlan` where `id = currentUser.subscriptionPlanID`.
     * Display plan name, `monthlyLimit`, and a “Progress Bar” bound to usage metrics.
     * “Upgrade / Change Plan” button: On click, open a Vibe “Stripe Checkout” integration block.
   * **Available Plans Section:**

     * Create a static collection (or table) in Vibe named `Plans` with rows for Free, Pro, Institutional.
     * Use a “Repeater” to render each plan. In each card, show features (from `featuresJSON`) and a “Select/Upgrade” button that triggers the subscription workflow:

       1. Vibe invokes Stripe with `priceId` to create a checkout session.
       2. On success webhook, Vibe updates `User.subscriptionPlanID`, and optionally, resets monthly usage.
   * **Payment Method Management:**

     * If on Pro, show a “Update Payment Method” button that triggers a Stripe Elements modal (embedded) to update card info.
   * **Billing History Table:**

     * Bind a “Table” to `PaymentTransaction` filtered by `userID = currentUser.id`.
     * Columns: `transactionDate`, `amount`, `status`, “View Invoice” (link to a PDF if available).

8. **Profile & Settings Page (`/settings`):**

   * **Tabbed Interface:**

     * Create a “Tabs” component with “Profile,” “Notifications,” and “Security” tabs.
   * **Profile Tab:**

     * Use “Form” bound to `User` record for `fullName`, `email` (disabled or with a “Change Email” flow), and `schoolName` (text).
     * Add “Change Password” fields: `currentPassword`, `newPassword`, `confirmNewPassword`. Vibe has a built-in “Change Password” action.
     * “Save Changes” button calls “Update Record” on `User`.
   * **Notifications Tab:**

     * Use toggle switches (bind to a `UserSettings` sub-table or JSON field on `User`) for email/in-app prefs.
     * “Save Preferences” button updates the record.
   * **Security Tab:**

     * For “Login Activity,” use a “Repeater” bound to a `LoginHistory` table (optional phase). Show last 5 sessions (date, device, IP).
     * “Logout from all other devices” button triggers a Vibe built-in or custom workflow to clear all refresh tokens except the current session.

9. **Help & Support Page (`/support`):**

   * **Search Bar:** Connect to a static `FAQ` table (or third-party help documentation).
   * **Accordion List:** Use Vibe’s “Accordion” component bound to `FAQ` rows.
   * **Contact Form:** “Form” that creates a new record in a `SupportTicket` table:

     * Fields: `userID`, `subject`, `message`, `attachedScreenshot` (optional File Upload).
     * On submit: send a notification email to your support inbox and show “Ticket Submitted” toast.

---

## 1.3 Phase III: UX/UI Design & Prototyping (2–3 weeks)

Although Vibe provides pre-built UI components, we still need to define the “look and feel” in detail. Below is how to translate our design system into Vibe’s styling tokens and component overrides.

### 1.3.1 Establish a Design System in Vibe

1. **Define Global Styles / Theme Tokens**

   * **Colors:** In Vibe’s “Theme” settings, create color tokens:

     * `primary` → `#1E3A8A` (Navy)
     * `success` → `#10B981` (Emerald)
     * `secondary` → `#64748B` (Slate Gray)
     * `warning` → `#FBBF24` (Gold)
     * `danger` → `#EF4444` (Orange Red)
     * `background` → `#FFFFFF` (White)
     * `surface` → `#F1F5F9` (Warm Gray Light)
     * `border` → `#E2E8F0` (Warm Gray Medium)
     * `text-primary` → `#1F2937` (Charcoal)
     * `text-secondary` → `#64748B` (Slate Gray)
     * `text-disabled` → `#A0AEC0` (Cool Gray)
   * **Typography Tokens:**

     * Configure Vibe’s global fonts:

       * **Primary:** Inter (fallback: sans-serif)
       * **Secondary (Headlines):** Lexend (fallback: serif)
     * Define font sizes:

       * `h1` → 36px/44px, `h2` → 28px/36px, `h3` → 24px/32px, `body` → 16px/24px, `small` → 14px/20px.
     * Set letter spacing for headings (0.5px) and body (0.25px).
   * **Spacing Tokens:**

     * Define a scale: `[4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px]`. In Vibe, assign these to margin/padding controls in the design inspector.

2. **Customize Pre-Built Components:**

   * **Buttons:**

     * In Vibe’s “Components” library, clone the standard “Button” component and override styles:

       * **Primary Variant:** `background-color: var(--primary)`, `color: var(--background)`, `border-radius: 8px`, `padding: 12px 24px`, `font-size: 16px`, `font-family: Inter, sans-serif`, `font-weight: 600`.
       * Hover: `background-color: darken(var(--primary), 5%)` (Vibe’s color adjust function).
       * Disabled: `background-color: var(--secondary) opacity(50%)`, `cursor: not-allowed`.
     * **Secondary Variant:** White background, `border: 2px solid var(--primary)`, `color: var(--primary)`.
     * **Tertiary Variant:** Transparent, text color `var(--primary)`, hover change to `var(--success)`.

   * **Inputs & Textareas:**

     * Clone Vibe’s “Text Input” and “Textarea” so that default border = `1px solid var(--border)`, `border-radius: 4px`, `padding: 12px`, `font-family: Inter, sans-serif`, `font-size: 16px`, `color: var(--text-primary)`.
     * Focus state: `border: 2px solid var(--success)`, `box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15)`.
     * Error state: `border-color: var(--danger)`, with a small error icon inside the input (use Vibe’s “Icon” with `name="alert-circle"` from Feather Icons, color `var(--danger)`, positioned to the right).

   * **Cards & Containers:**

     * Default card uses `box-shadow: 0 1px 2px rgba(31,41,55,0.05), 0 1px 3px rgba(31,41,55,0.10)`, `border-radius: 8px`, `background-color: var(--background)`, `padding: 24px`.
     * For “raised” components (e.g., modals or the review-questions card), use the Level 2 shadow: `0 4px 6px rgba(31,41,55,0.10), 0 2px 4px rgba(31,41,55,0.06)`.

   * **Tables:**

     * Header row background: `var(--surface)`; header text: `var(--text-primary)` bold.
     * Rows alternate: `background-color: var(--background)` and `var(--surface)`.
     * On row hover: `background-color: lighten(var(--surface), 5%)`.
     * Action buttons (icons) stay as slate gray, change to navy on hover.

   * **Tabs:**

     * Use Vibe’s “Tabs” component, override active tab text color to `var(--primary)` and add a 2px bottom border `var(--success)` under the active tab. Inactive tabs: `color: var(--text-secondary)`.

   * **Modals:**

     * Container: `width: 640px max`, `padding: 32px`, `border-radius: 8px`, `box-shadow: level 2`.
     * Title: `h2` typography token (28px), `font-family: Lexend`, `font-weight: 600`.
     * Footer: Right-aligned primary & secondary buttons, spacing `16px`.

### 1.3.2 Wireframes & Rapid Prototyping in Vibe

1. **Create Basic Page Templates:**

   * Use Vibe’s “Page Template” feature to define a consistent layout: a top Navbar (Navy background), left Sidebar (240px wide, Navy background).
   * Main content region (white background, centered container) with 24px horizontal padding.

2. **Assemble Pages with Placeholder Components:**

   * **Landing Page:** Use a “Hero Section” component with dynamic background image and a “CTA” button (Primary).
   * **Login/Register:** Drag the “Login Form” and “Register Form” from Vibe’s Auth UI library.
   * **Dashboard:** Insert “Card,” “Progress Bar,” and “Table” components, bind them to “mock” test data.
   * **Generate Wizard:**

     * Create three “Section” containers stacked vertically; use “Conditional Visibility” so that only the section matching `currentStep` is visible.
     * Step 1: Curriculum form controls in a “Form Grid.”
     * Step 2: A “Repeater” for questionConfig.
     * Step 3: “Textarea” for extra notes and “Generate” button.
     * Step 4: “Progress Bar” with a dynamic binding to `progressPct`.
   * **Review Page:**

     * Use a “Tabs” component and nest a “Repeater” inside each tab’s pane.
     * In the template for MCQs, use a “Repeater” for options.
   * **My Documents/My Sets/Billing/Profile/Help:** Similarly assemble using Vibe’s “Table,” “Card,” “Form,” and “Repeater” components.

3. **Run Quick Usability Validation:**

   * With Vibe’s “Preview” feature, share a link to 3–5 pilot teachers.
   * Observe if they can navigate from Wizard Step 1 → Step 2 → Step 3 with minimal guidance.
   * Iterate based on their feedback (e.g., button placement, field labels).

### 1.3.3 High-Fidelity Design & Documentation

1. **Transfer Styles from Figma to Vibe:**

   * Copy hex codes, font names, and spacing values from your Figma tokens into Vibe’s Theme/Global Styles.
   * Ensure each Vibe component’s properties match the intended design—e.g., margin = 16px, padding = 24px.

2. **Component Library in Vibe:**

   * In Vibe’s “Design System” section, create overrides or “Variants” for:

     * Button (Primary, Secondary, Tertiary)
     * Input (Default, Focus, Error, Disabled)
     * Card (Flat, Raised)
     * Table (Header, Row, Alternate Row)
     * Modal (Default, Large, Small)
     * Tabs (Active, Inactive)
   * Tag each variant with a descriptive name so developers (and product designers) know when to use “Btn/Primary” vs. “Btn/Secondary.”

3. **Accessibility & Responsiveness:**

   * In each component’s settings, ensure keyboard focus states are visible (set outline = `2px solid var(--success)` on focus).
   * For each full page, test the responsive “breakpoints” in Vibe’s preview mode: mobile (<640px), tablet (640–767px), small desktop (768–1023px), desktop (≥1024px).
   * Tweak component groups for each breakpoint—e.g., stack columns into single column on mobile.

4. **Document Everything:**

   * In Vibe, use “Annotations” on key screens to specify:

     * “Clicking this icon opens a modal with ‘Delete Confirmation.’”
     * “This repeater template corresponds to `GeneratedQuestionSet.questionsJSON` array.”
   * Export a style guide PDF from the “Design System” tab: listing color swatches (with hex codes), typography styles (font, weight, size, line-height), spacing scale (4, 8, 12, … px), and component snapshots (Button Primary, Input Default, etc.).

---

## 1.4 Phase IV: Build & Configure (6–8 weeks)

With the data models, workflows, and design system in place, we can now configure each page in Vibe in earnest. This phase is organized into overlapping “sprints” (2 weeks each), though in no-code you can move quickly between UI, workflows, and data binding.

### Sprint 1 (Weeks 1–2): Authentication, Curriculum Data, & Document Upload

* **Tasks:**

  1. **Authentication Pages (Day 1–2):**

     * Confirm Vibe’s default login/register flows match our requirements. Customize copy (e.g., “Teacher Email” label).
     * Test email verification and password reset end-to-end using a sandbox SMTP (SendGrid) account.
  2. **Import Curriculum Data (Day 3–4):**

     * Upload the CSV from Phase 1 into `Subject`, `Strand`, `SubStrand` tables.
     * Use Vibe’s “Data Browser” to verify each subject/strand/sub-strand row.
  3. **My Documents Page (Day 5–6):**

     * Drag in a “File Upload” component bound to `Document.file`. Configure to store metadata in `Document`.
     * Place a “Table” listing all uploaded documents for the logged-in teacher (filter by `userID = currentUser.id`).
     * Add “Delete” and “View” (preview) actions.
  4. **Curriculum Selection UI (Wizard Step 1, Day 7–10):**

     * Create a page `/generate/step1` with form controls:

       * **Document Dropdown:** bound to `Document` table.
       * **Class Level Radios:** bind to a page variable (`selectedLevel`). When changed, filter `Subject` dropdown by `level`.
       * **Subject / Strand / Sub-Strand Dropdowns:** chain filters: `Strand.where(subjectID = selectedSubjectID)`, `SubStrand.where(strandID = selectedStrandID)`.
     * Add “Next” button that sets `currentStep = 2` in page state and redirects to `/generate/step2` (pass all selected IDs as URL params or page variables).
     * Add form validation: disable “Next” until all four selections are non-null.

* **Quality Checks:**

  * Ensure that if a teacher has no documents, the “Select Document” dropdown is disabled and a prompt appears (“Upload a document first”).

### Sprint 2 (Weeks 3–4): Wizard Steps 2–3, AI Workflow, & Progress Tracking

* **Tasks:**

  1. **Generate Wizard Step 2 (Day 1–3):**

     * Build `/generate/step2`: a “Repeater” for questionConfig. Each repeater row has:

       * Dropdown (`MCQ` / `TrueFalse` / `FillBlank` / `ShortAnswer`)
       * Numeric Input (`count`)
       * Remove Row (trash icon with a Vibe “Delete Item” action).
     * Add “Add Question Type” button bound to a page action “Add Row to Repeater.”
     * “Back” button navigates to `/generate/step1` (retain previous selections via page variables).
     * “Next” button navigates to `/generate/step3` only if at least one row in repeater has both type & count.
  2. **Generate Wizard Step 3 (Day 4–6):**

     * Build `/generate/step3`:

       * Multi-line Textarea (bind to `extraNotes`).
       * A “Summary Panel” on the right (conditioned on desktop width) that shows dynamic text:

         ```text
         Document: {{document.fileName}}
         Level: {{selectedLevel}}
         Subject: {{selectedSubject.name}}
         Strand: {{selectedStrand.name}}
         Sub-Strand: {{selectedSubStrand.name}}
         Question Types: {{for each item in questionConfig}} - {{item.type}} ({{item.count}}){{end}}
         Notes: {{extraNotes}}
         ```
       * “Back” and “Generate Questions” buttons.
       * Clicking “Generate Questions” triggers a “Create Record” on `QuestionSetRequest` with fields:

         * `userID = currentUser.id`
         * `documentID`, `subjectID`, `strandID`, `subStrandID`, `questionConfig = repeaterData`, `extraNotes`
         * `status = pending`, `progressPct = 0`
       * Immediately after creation, Vibe’s “After Create” automation runs the AI workflow (Section 1.2.4).
       * Show a full-screen overlay or navigate to `/generate/progress?requestId={{newRequestID}}`.
  3. **Progress Screen (Day 7–10):**

     * Create `/generate/progress`:

       * On page load, retrieve `QuestionSetRequest` by `requestId`.
       * Insert a “Progress Bar” and bind to `progressPct`.
       * Use Vibe’s “Polling” feature: every 2 seconds, re-fetch that record.
       * If `status = complete`, automatically redirect to `/questions/sets/{{generatedQuestionSetID}}`. You can retrieve `generatedQuestionSetID` via a related lookup (e.g., `GeneratedQuestionSet.where(requestID = requestId).id`).
       * If `status = failed`, show an error card with a “Retry” button that updates `QuestionSetRequest.status = pending` and re-runs the AI workflow.

* **Quality Checks:**

  * Test the entire wizard flow from Step 1 → Step 2 → Step 3 → Progress → Review.
  * Confirm that when AI errors occur (e.g., invalid prompt), the “failed” state is handled gracefully without hanging the UI.

### Sprint 3 (Weeks 5–6): Review/Edit & DOCX Export

* **Tasks:**

  1. **Review/Edit Page (`/questions/sets/:setId`) (Day 1–4):**

     * Bind the page to `GeneratedQuestionSet` by `setId`.
     * Insert a “Tabs” component. Each tab’s label is dynamic: e.g., “MCQ ({{countMCQ}})”, where `countMCQ = COUNT(questionsJSON WHERE type = 'MCQ')`.
     * In each tab, use a “Repeater” bound to `questionsJSON.filter(q => q.type === currentTabType)`.

       * For MCQs: nested repeater for options. Use “Textarea” for `q.text` and “Text Input” for each `q.options[i]`. Use a “Radio” component bound to `q.answer`.
       * For True/False: show `q.text` and two radio buttons (“True”/“False”).
       * For Fill-in: show “Sentence Template” with inline “Text Input” where blanks are. This may be built as a series of “Columns” with small input fields.
       * For Short Answer: a single “Textarea” for `q.text` and an “Editable Textarea” for optional `q.modelAnswer`.
     * Add “Regenerate” button/icon in each card: On click, run a “Run Workflow” action that calls AI for that single question and updates the repeater item.
     * Add “Delete” icon: On click, remove that item from `questionsJSON`, then save.
     * The “Save Changes” button at the bottom: calls `Update Record` on `GeneratedQuestionSet`, saving the modified `questionsJSON`.
     * The “Shuffle Questions” button: calls a “Custom Workflow” that shuffles the array and updates `questionsJSON` accordingly.
  2. **DOCX Export Workflow (Day 5–6):**

     * Add an “Export to DOCX” button in the header. On click, run a Vibe “Run Workflow” action:

       1. Update `GeneratedQuestionSet.exportStatus = pending`.
       2. Call a “Custom Function” block (serverless) that:

          * Reads `questionsJSON` from the record.
          * Uses a headless library (e.g., `docx`) to assemble a `.docx` file, formatting:

            * Cover page (Sub-Strand name, teacher name, date).
            * Questions in order, MCQs formatted with bullets/letters, T/F statements, fill-in sentences intact, and short answer prompts.
            * Append an “Answer Key” section at the end.
          * Uploads to `/exports/{{userID}}/{{setID}}/{{timestamp}}.docx` in S3.
          * Returns a pre-signed URL.
       3. On success, update `exportStatus = ready` and `exportURL = <presignedURL>`.
       4. On failure, set `exportStatus = failed` and store `exportError = <errorMessage>`.
     * After the workflow completes, show a toast: “Your exam has been generated—click to download.” If the teacher stays on the page, show a “Download Now” link bound to `GeneratedQuestionSet.exportURL`.

* **Quality Checks:**

  * Verify that modifying any field in the repeater correctly marks “Save Changes” as active.
  * Test export end-to-end: from Review page, click “Export,” confirm file downloads and opens in Word with proper formatting.

### Sprint 4 (Weeks 7–8): Subscription, Billing, & Support

* **Tasks:**

  1. **Subscription & Billing Setup (Day 1–4):**

     * **Plans Data:** Create a `Plans` table (or a static collection) in Vibe with rows for Free, Pro, Institutional.
     * **Stripe Integration:**

       * Use Vibe’s pre-built “Stripe Checkout” component (if available) or wire up a “REST API” connector to Stripe’s Checkout API.
       * Configure price IDs for Pro and Institutional.
       * On the “Billing” page, create a “Repeater” to show all `Plans`. Each plan’s “Select” button triggers a “Create Checkout Session” action:

         ```json
         {
           "price": "{{plan.priceId}}",
           "success_url": "https://yourapp.com/billing/success?session_id={CHECKOUT_SESSION_ID}",
           "cancel_url": "https://yourapp.com/billing/cancel"
         }
         ```
       * Implement a “Stripe Webhook” endpoint in Vibe’s “Custom Functions” area that listens for `checkout.session.completed`. When received:

         1. Look up `userID = session.metadata.userID`.
         2. Update `User.subscriptionPlanID = planID` and set billing cycle start date.
         3. (Optional) Create a `PaymentTransaction` row with amount & status.
     * **Billing Page UI:**

       * Bind “Current Plan” card to the logged-in user’s plan. Show “Upgrade” or “Manage” actions accordingly.
       * Show usage progress bar (e.g., count of `UsageRecord` in current cycle vs. `SubscriptionPlan.monthlyLimit`).
       * Lower section: “Payment History” table bound to `PaymentTransaction` where `userID = currentUser.id`.
  2. **Usage Triggers & Quota Enforcement (Day 5–6):**

     * In the “Generate Questions” workflow (Section 1.2.4), before creating a new `QuestionSetRequest`, insert a “Conditional Gate”:

       * Query `UsageRecord` for `userID` in current billing period, sum `questionCount`. If sum + (sum of `questionConfig.count`) > `SubscriptionPlan.monthlyLimit`, abort with an error (“Free tier limit exceeded”).
       * If allowed, proceed to create `QuestionSetRequest` and also create a new `UsageRecord` row with `questionCount = (sum of questionConfig.count)`.
  3. **Support & FAQ (Day 7–8):**

     * **FAQ Table:** Create a `FAQ` table with fields `question (text)`, `answer (rich text)`, `category (enum)`, `order (number)`.
     * **Help Page UI:**

       * “Search Input” bound to filter `FAQ` by keywords.
       * “Accordion” component bound to `FAQ` entries.
     * **Contact Form:** Create `SupportTicket` table with fields: `userID`, `subject`, `message`, `attachment` (file), `createdAt`.

       * Bind a “Form” UI to create new `SupportTicket` rows.
       * On submit, use Vibe’s “Send Email” block to notify the support team with the ticket details and link to the attachment.
     * **Admin Notification:**

       * If you want an Admin view later, create an Admin-only page that lists all `SupportTicket` rows for triage.

---

## 1.5 Phase V: Testing, QA, & Pre-Launch (2–3 weeks)

Because we’re building in a no-code environment, testing focuses on functional walkthroughs, data binding validation, and integration checks rather than unit tests.

### 1.5.1 Functional Testing & QA

1. **Authentication Flows:**

   * Sign up a new teacher, verify email, log in, log out.
   * Attempt login with wrong credentials, confirm error.
   * Use “Forgot Password,” reset link, set new password.

2. **Document Upload & Management:**

   * Upload PDF/DOCX/PPTX under 10 MB. Confirm row appears in `Document` table and file is stored in `/uploads/`.
   * Delete a document, ensure it disappears and the file is removed from storage.

3. **Wizard & AI Generation:**

   * Step 1: Select document & curriculum → Step 2: Configure question types → Step 3: Extra notes → “Generate.”
   * Confirm `QuestionSetRequest.status` transitions from `pending` → `in_progress` → `complete`.
   * Confirm `GeneratedQuestionSet.questionsJSON` is populated with an array of question objects.
   * If AI returns an unparseable response, confirm the workflow catches it and sets `status = failed`.

4. **Review/Edit & Export:**

   * Navigate to `/questions/sets/:setId`, confirm questions show correctly in tabs.
   * Edit an MCQ question’s text and options → “Save.” Confirm change persisted in `questionsJSON`.
   * Click “Export to DOCX.” Confirm a file appears in `/exports/` and `GeneratedQuestionSet.exportURL` is populated. Download and open the file to verify formatting.

5. **Subscription & Billing:**

   * Generate questions as a Free user up to the limit (e.g., 20 questions). Confirm the system blocks further generation and displays “Upgrade to continue.”
   * Upgrade to Pro via Stripe test mode. Confirm plan change and that new generation works.
   * Check “Payment History” table for a record of the transaction.

6. **Support & FAQ:**

   * Search for a FAQ term, confirm accordion filters properly.
   * Submit a support ticket with an attachment. Confirm `SupportTicket` row created and email notification was sent.

### 1.5.2 Usability & Accessibility Testing

1. **Usability Sessions (3–5 Teachers):**

   * Provide a “test account” and a sample PDF. Ask them to walk through:

     1. Upload document.
     2. Generate 5 MCQs on a sample topic.
     3. Review & edit one question.
     4. Export to DOCX.
   * Gather feedback on screen layout, labeling, and ease of understanding.

2. **Accessibility Checks:**

   * Use Vibe’s built-in accessibility auditor (if available) or manually check:

     * Color contrast (use a contrast checker tool to confirm >4.5:1 for normal text).
     * Keyboard navigation: Tab through all interactive elements—forms, buttons, repeater items, modals—verify focus styles appear (2 px emerald outline).
     * Screen reader compatibility: With NVDA or VoiceOver, navigate login, form fields, and question review to confirm `aria` labels are read correctly.

### 1.5.3 Performance & Load Testing

1. **Simulated Load in Vibe:**

   * Use Vibe’s “Preview” environment while two or three team members concurrently generate questions to see how the AI calls queue and how the UI responds.
   * Verify that if 20 teachers (with test accounts) press “Generate” at roughly the same time, the AI workflow remains stable (monitor `status` transitions, DB performance in Vibe’s logs).

2. **API Rate Limits & Quotas:**

   * Check OpenAI/Azure consumption metrics: ensure token usage per request stays within budget.
   * If exceeding, consider adding logic to throttle or batch AI calls.

### 1.5.4 Pre-Launch Readiness Checklist

1. **Feature Sign-off:**

   * All MVP features (auth, document upload, curriculum wizard, AI generation, review/export, billing, support) are implemented and tested end-to-end.
2. **Design & Branding:**

   * Confirm UI matches design guidelines exactly: color, typography, spacing, button styles.
   * Review each page’s responsiveness at all breakpoints.
3. **Security & Compliance:**

   * Ensure sensitive data (passwords, API keys) are stored in Vibe’s encrypted secrets.
   * Confirm GDPR/Data Protection Act compliance: data retention policy, “Delete Account” option.
4. **Monitoring & Alerts:**

   * Configure Vibe’s built-in monitoring dashboard to track record creation rates, AI call failures, and storage usage.
   * Set email alerts for “QuestionSetRequest.status = failed” more than X% of times or AI errors > Y within 24 hours.
5. **Help & Documentation:**

   * Finalize “Getting Started” guide (PDF or web page) covering core flows.
   * Record a short 2-minute video showing how to upload & generate.
6. **Launch Communication:**

   * Plan email announcement to pilot schools and teacher groups.
   * Schedule social media posts on local teacher forums and GES channels.

---

## 1.6 Phase VI: Launch, Monitoring, & Iteration (Ongoing)

### 1.6.1 Production Deployment

* **Objective:** Publish the Vibe workspace to a live URL (e.g., `https://questionsuite-vibe.app`), ensuring all environment variables use production keys (OpenAI, Stripe, SMTP).
* **Activities:**

  1. **Domain & SSL:**

     * In Vibe’s “Hosting” settings, configure the custom domain (`questiongenerator.edu.gh` or similar).
     * Enable automatic SSL certificate provisioning.
  2. **Environment Promotion:**

     * Promote staging version (with test keys) to production environment (with live keys).
     * Confirm dynamic secrets (AI keys, payment) reference Vibe’s production secrets vault.

### 1.6.2 Monitoring & Alerts

* **Objective:** Ensure continuous reliability and fast detection of issues.
* **Activities:**

  1. **Built-in Metrics Dashboard:**

     * Vibe often provides usage metrics: number of record creations per minute, workflow run failures, storage usage, active user counts.
  2. **Custom Email Alerts:**

     * Create a Vibe workflow that triggers on error events (e.g., AI workflow fails, export fails) to email the engineering lead.
  3. **Monthly Review:**

     * Check subscription conversion rates (Free → Pro), generation success rates, average generation times.

### 1.6.3 User Support & Feedback

* **Objective:** Keep teachers engaged, gather real-world feedback, and continuously improve.
* **Activities:**

  1. **Help Center & Chat Support:**

     * Use Vibe’s “Dynamic Page” to update FAQs live (no deployments needed).
     * Explore integrating a third-party chat widget (e.g., Crisp, Intercom) if needed.
  2. **Webinars & Documentation Updates:**

     * Host monthly “Office Hours” webinars for new teachers.
     * Update “Getting Started” guide to incorporate common pain points (e.g., “Tips for crafting better prompts”).
  3. **Feedback Collection:**

     * Add a small “Rate Your Experience” widget in the Dashboard: a 5-star rating plus optional comments field that writes to a `UserFeedback` table.

### 1.6.4 Iteration & Roadmap Planning

* **Objective:** Use data and teacher input to prioritize Phase 2 enhancements.
* **Activities:**

  1. **Analyze Usage Data:**

     * How many teachers generate questions monthly? Which subjects are most popular?
     * Where do teachers drop off in the wizard?
  2. **Feature Requests Backlog:**

     * Surveys reveal teachers want “Matching” question type and “Student Self-Study Mode” (students can generate self-practice questions).
     * Prioritize adding T/F distributed feedback if AI output occasionally misses curriculum alignment.
  3. **Phase 2 Planning:**

     * Possible features:

       * Offline/low-bandwidth caching (store selected documents locally).
       * Peer review library (teachers can share approved question sets).
       * Additional export formats (PDF, Moodle XML).
       * Support for local languages (Ewe, Akan)—this requires extending the AI prompt and UI text.
  4. **Quarterly Roadmap Sync:** Meet with stakeholders to confirm next quarter’s deliverables based on analytics and teacher surveys.

---

# 2. App Flow & User Journey (No-Code Perspective)

Below is the comprehensive, up-to-date flow that shows exactly how teachers (our sole user role for MVP) will navigate through the application. The descriptions assume Vibe’s URL structure and that each page is a Vibe-managed route with data binding.

---

## 2.1 Public (Unauthenticated) Screens

1. **Landing Page (`/`)**

   * **Header (Navbar):**

     * Left: Logo (custom image asset)
     * Right: Links “Home,” “Features,” “Pricing,” “About,” “Help,” “Log In,” “Sign Up” (buttons link to Vibe pages).
   * **Hero Section:**

     * Headline: “Generate Curriculum-Aligned Exam Questions in Minutes” (H1, Inter Bold, #1E3A8A).
     * Subhead: “AI-powered, built for Ghanaian JHS & SHS teachers.” (Body, #1F2937)
     * Primary CTA: “Get Started (Free)” (`<Button variant="primary" onClick="/auth/register">`).
     * Secondary CTA: “Watch Demo” (`<Button variant="tertiary" onClick="/features#demo">`).
   * **Feature Highlights:**

     * Vibe “Card” components in a 3-column grid (break to 1-column on mobile). Each card has:

       1. Icon (Feather)
       2. Title (H4, 20px)
       3. Body (16px)
   * **Testimonials Carousel:**

     * Vibe “Carousel” component, manually populated with 3 local teacher quotes.
   * **Footer:**

     * Link columns: Company (About, Blog), Resources (Help, FAQ), Legal (Privacy, Terms).
     * Social icons (Feather icons, 24×24, #64748B).

2. **Features Page (`/features`)**

   * **Section 1 (Overview):**

     * H2: “Why Choose Our AI Question Generator”
     * Grid of 4 cards, each with an icon and paragraph.
   * **Section 2 (How It Works):**

     * A 4-step horizontal process diagram (icons + text):

       1. Upload Document → 2. Select Curriculum → 3. Configure Questions → 4. Download Exam.
   * **Section 3 (Live Demo Embed):**

     * A small Vibe “Embed” component that plays a 2-minute recorded video.
   * **CTA Banner:**

     * “Ready to get started? Sign up now.” (Button → `/auth/register`)

3. **Pricing Page (`/pricing`)**

   * **Pricing Cards (Grid):**

     * Vibe “Repeater” bound to `Plans` table. Each card shows `plan.name`, `plan.price`, `plan.featuresJSON`, “Select” button.
     * The “Select” button triggers the “Subscription” workflow (Stripe checkout).
   * **Feature Matrix Table:**

     * Vibe “Table” with hardcoded rows (MCQ, T/F, FillBlank, ShortAnswer, MonthlyLimit, Support Level). Columns for Free, Pro, Institutional.
   * **FAQ Section:**

     * Vibe “Accordion” bound to a static `PricingFAQ` collection (question/answer pairs).
   * **Footer CTA:**

     * “Still have questions? Contact us.” (Link → `/support`)

4. **Help Center / FAQ (`/help`)**

   * **Search Bar:** Vibe “Search Input” bound to `FAQ` table (filters by `question` contains search term).
   * **FAQ List:** Vibe “Accordion” bound to `FAQ`.

     * Each item: `faq.question` (as header) and `faq.answer` (rich text).
   * **Contact Form:**

     * Vibe “Form” that writes to `SupportTicket`: fields `subject` (dropdown), `message` (textarea), `attachment` (file upload).
     * On submit: create `SupportTicket` row and send an email via Vibe’s SMTP integration.

5. **About Page (`/about`)**

   * **Team Section:** Grid of “Card” components, each showing photo, name, title, short bio.
   * **Mission Statement:** H2 + two paragraphs.
   * **Contact Section:** Simple “Email us at [support@yourapp.edu.gh](mailto:support@yourapp.edu.gh)” (Mailto link).

---

## 2.2 Authentication Flow

All authentication screens are handled via Vibe’s built-in Auth module; the following outlines what the user sees and the fields required.

1. **Sign Up (`/auth/register`)**

   * **Fields:** “Full Name,” “Email,” “Password,” “Confirm Password,” “I agree to Terms” (checkbox).
   * **Action:** “Create Account” button triggers Vibe’s “Sign Up” function.
   * **On Success:** Vibe displays a “Verify Your Email” screen (default text can be customized to read “Check your inbox for a verification link”).
   * **Validation:**

     * Email must be unique.
     * Passwords must match and meet complexity (8+ chars, one number).
   * **Redirect:** After email verification, redirect to `/auth/login`.

2. **Login (`/auth/login`)**

   * **Fields:** “Email,” “Password.”
   * **Buttons:** “Log In,” “Forgot Password?”
   * **On Error:** Show inline error “Invalid credentials.”
   * **On Success:** Set session cookie, redirect to `/dashboard`.

3. **Forgot Password (`/auth/forgot-password`)**

   * **Field:** “Email.”
   * **Button:** “Send Reset Link.”
   * **On Submit:** Vibe sends reset email; show “If that email exists, we’ve sent a reset link.”
   * **Redirect:** After email sent, link to “Back to Login.”

4. **Reset Password (`/auth/reset-password?token=…`)**

   * **Fields:** “New Password,” “Confirm New Password.”
   * **Button:** “Reset Password.”
   * **On Success:** “Password reset successful—log in now” (link to `/auth/login`).
   * **On Error:** “Invalid or expired token—request a new one” with a link back to `/auth/forgot-password`.

---

## 2.3 Authenticated (Teacher) Experience

Once logged in, teachers see the **Dashboard**. From there, they can navigate to all key features via the Sidebar.

### 2.3.1 Dashboard (`/dashboard`)

* **Sidebar (Fixed, 240px, Navy Background)**

  * **Menu Items (Icon + Label, White Text):**

    1. **Dashboard** (icon: home)
    2. **Generate New Set** (icon: plus)
    3. **My Documents** (icon: file)
    4. **My Question Sets** (icon: clipboard)
    5. **Billing & Subscription** (icon: credit card)
    6. **Profile & Settings** (icon: user)
    7. **Help & Support** (icon: lifebuoy)
    8. **Log Out** (icon: power)
  * **Active Item Highlight:** A 4px Emerald (#10B981) bar along the left.

* **Main Content (Centered, Max-Width 1024px, 24px Padding)**

  1. **Welcome Banner:**

     * “Good Morning, {{currentUser.fullName}}” (H2, 28px).
     * Subtext: “Ready to create your next question set?” (Body, 16px).
     * Button: “Generate New Set” (Primary).
  2. **Usage Snapshot Card (Full-Width, Elevation Level 1):**

     * Title: “Monthly Usage” (H4, 20px).
     * Dynamic Text: “{{usageThisMonth}} / {{currentPlan.monthlyLimit}} questions generated.”
     * Progress Bar: fill width = `(usageThisMonth / currentPlan.monthlyLimit) * 100%`, color = Emerald.
     * If `usageThisMonth >= monthlyLimit` and plan = Free: show “Upgrade to Pro” button (Secondary).
  3. **Recent Activity (My Question Sets) Table:**

     * Vibe “Table” bound to `GeneratedQuestionSet` where `userID = currentUser.id`, sorted by `createdAt DESC`.
     * Columns:

       * **Date Created** (`createdAt | formatDate('MMM D, YYYY')`)
       * **Sub-Strand** (`subStrand.name`)
       * **Question Count** (`LEN(questionsJSON)`)
       * **Status** (`status` enum)
       * **Actions:**

         * “Review” (icon: eye; navigates to `/questions/sets/{{id}}`)
         * “Export” (icon: download; calls export workflow if not ready, otherwise downloads)
         * “Delete” (icon: trash; calls “Delete Record” action)
     * **Empty State:** If no rows, display an illustration + “You have no question sets yet. Generate your first one now!” (Button → `/generate`).
  4. **Tips & Tricks Carousel (Below Table):**

     * Vibe “Carousel” with 3–4 cards, each with a “Tip” header (H4) and a short paragraph.
     * E.g., “Tip: Use extra notes to guide the AI toward higher-order thinking questions.”

### 2.3.2 My Documents (`/documents`)

* **Page Header:** “My Uploaded Documents” (H2, 28px) + a Primary “Upload New Document” button (Top-Right).
* **Upload New Document Modal:**

  * **Trigger:** Clicking “Upload New Document” opens a Vibe “Modal” (Level 2 Shadow, 640px width).
  * **Inside Modal:**

    * **Drag-and-Drop Area (200px tall):**

      * Border: `2px dashed var(--secondary)` (#64748B), border-radius: 8px.
      * Centered icon (Feather “upload”), text: “Drag & drop PDF, DOCX, or PPTX here, or click to browse.”
      * Below: “Max file size: 10 MB.”
    * **File Input Fallback:** “Browse Files” button if drag/drop not supported.
    * **On Select:** Show “Uploading…” overlay and a progress bar (fill from 0→100%).
    * **Success:** Close modal and show toast “Upload successful!”
    * **Failure:** Show inline error “Failed to upload—please try again.”
* **Documents List:**

  * Vibe “Table” bound to `Document` where `userID = currentUser.id`.
  * Columns:

    1. **File Name** (`fileName`) – when clicked, opens a “Details” modal showing metadata and a preview of first page (if PDF).
    2. **Uploaded At** (`uploadedAt | formatDate('MMM D, YYYY, h:mm A')`)
    3. **File Size** (`fileSize | formatBytes`)
    4. **Actions:**

       * “View Details” (eye icon) – opens a modal with a PDF preview (if PDF) or “Preview not available” for DOCX/PPTX.
       * “Delete” (trash icon) – opens a Level 2 “Confirm Deletion” modal:

         * **Title:** “Delete Document?”
         * **Message:** “Are you sure you want to delete ‘{{fileName}}’? This cannot be undone.”
         * Buttons: “Cancel” (Tertiary), “Delete” (Secondary with color `var(--danger)`), which invokes Vibe’s “Delete Record” on `Document`.
  * **Empty State:** If no rows, show an illustration + “No documents yet. Click ‘Upload New Document’ to add one.” (Button: “Upload New Document”).

### 2.3.3 Generate New Set Wizard

We simulate a four-step wizard using conditional sections on a single “Generate” page. URL: `/generate`.

1. **Step 1: Document & Curriculum Selection (`currentStep = 1`)**

   * **Section Title:** “Step 1 of 3: Select Document & Curriculum” (H3, 24px).
   * **Form Fields (Stack, 16px vertical spacing):**

     1. **Document Dropdown:** `Document` where `userID = currentUser.id`. Label “Choose a Document” (H4, 20px).

        * If teacher has no document, show a prompt linking to `/documents` with “Upload a Document to start.”
     2. **Class Level (Radio Group):** Options: “JHS,” “SHS.” Label “Class Level.”
     3. **Subject (Dropdown):** Bound to `Subject` where `level = selectedLevel`. Label “Subject.”
     4. **Strand (Dropdown):** Bound to `Strand` where `subjectID = selectedSubjectID`. Label “Strand.”
     5. **Sub-Strand (Dropdown):** Bound to `SubStrand` where `strandID = selectedStrandID`. Label “Sub-Strand.”
   * **Validation:** Disable “Next” unless all selections are made.
   * **Navigation Buttons (Bottom, 32px top margin):**

     * **Cancel (Tertiary):** On click, confirm “Discard selections and return to Dashboard?” → if yes, redirect to `/dashboard`.
     * **Next (Primary):** On click, set `currentStep = 2`.
   * **Layout:** Two-column on desktop: Left (form) 60% width, Right (Tips) 40% (Tips can be a static card with instructions, e.g., “Select the exact sub-strand for best alignment.”). On mobile, stack vertically.

2. **Step 2: Configure Question Types & Counts (`currentStep = 2`)**

   * **Section Title:** “Step 2 of 3: Configure Question Types” (H3).
   * **Repeater (QuestionConfig):**

     * Each row has:

       * **Type Dropdown:** Options: “MCQ,” “True/False,” “Fill-in-the-Blank,” “Short Answer.” Label “Type.”
       * **Count Input:** Numeric input (min 1, max 100). Label “Number of Questions.”
       * **Remove Row** (Trash Icon Button, color `var(--danger)`).
     * **Add Question Type Button:** (“+ Add Question Type,” Tertiary) appends a new repeater row.
   * **Validation:** Require at least one valid row (both Type and Count filled).
   * **Navigation Buttons:**

     * **Back (Tertiary):** sets `currentStep = 1`.
     * **Next (Primary):** sets `currentStep = 3`, passing along `questionConfig` array.
   * **Layout:** Single column on mobile/tablet; 600px single column on desktop or split two-column if desired (left: repeater, right: dynamic summary of selected types).

3. **Step 3: Additional Notes & Generate (`currentStep = 3`)**

   * **Section Title:** “Step 3 of 3: Add Context & Generate” (H3).
   * **Form Field:**

     * **Textarea** labeled “Additional Notes (Optional)” (placeholder: “E.g., Focus on Bloom’s Level 2 application questions.”). Bind to `extraNotes`. 200px tall, max 500 characters.
   * **Dynamic Summary Panel (Right on desktop):**

     * Bulleted list:

       1. Document: `document.fileName`
       2. Level: `selectedLevel`
       3. Subject: `selectedSubject.name`
       4. Strand: `selectedStrand.name`
       5. Sub-Strand: `selectedSubStrand.name`
       6. Question Types: List each from `questionConfig` (e.g., “MCQ: 5, True/False: 3”).
       7. Additional Notes: first 100 chars of `extraNotes`.
   * **Navigation Buttons:**

     * **Back (Tertiary):** `currentStep = 2`.
     * **Generate Questions (Primary):**

       * On click, run an array of Vibe “Actions”:

         1. **Create Record** in `QuestionSetRequest`:

            ```json
            {
              "userID": "{{currentUser.id}}",
              "documentID": "{{selectedDocumentID}}",
              "subjectID": "{{selectedSubjectID}}",
              "strandID": "{{selectedStrandID}}",
              "subStrandID": "{{selectedSubStrandID}}",
              "questionConfig": "{{QuestionConfig}}",
              "extraNotes": "{{extraNotes}}",
              "status": "pending",
              "progressPct": 0
            }
            ```
         2. **Set Page Variable:** `newRequestID = <ID of created record>`.
         3. **Run Workflow:** Trigger the AI workflow (Section 1.2.4).
         4. **Navigate To:** `/generate/progress?requestId={{newRequestID}}`.

4. **Step 4: Generation Progress (`/generate/progress?requestId=<id>`)**

   * **Page Header:** “Generating Questions…” (H2, 28px)
   * **Progress Bar:** Bind to `QuestionSetRequest.progressPct` (poll every 2 seconds using Vibe’s “Poll Data” feature).
   * **Status Text Below:** “{{progressPct}}% complete. You can leave this page; we’ll notify you when it’s ready.”
   * **Button:** “Go to Dashboard” (Tertiary).
   * **Auto-Redirect:** If `status = complete`, Vibe’s “On Data Change” event triggers a redirect to `/questions/sets/{{generatedQuestionSetID}}`.
   * **Error Handling:** If `status = failed`, show an error card:

     * Title: “Generation Failed” (H3, 24px, color `var(--danger)`).
     * Body: “Oops! Something went wrong. Please try again later or contact support.”
     * Buttons: “Retry” (Primary, sets `status = pending`, re-runs AI workflow) and “Back to Dashboard” (Tertiary).

---

### 2.3.4 Review & Edit Questions (`/questions/sets/:setId`)

When the teacher arrives here, they see the AI-generated questions, can edit, shuffle, regenerate, and export.

1. **Page Header & Breadcrumb:**

   * **Breadcrumb:** “Dashboard → My Question Sets → {{subStrand.name}}” (H4).
   * **Title:** “Review Questions: {{subStrand.name}}” (H2).
   * **Metadata Row (Below Title):**

     * **Created At:** “{{GeneratedQuestionSet.createdAt | formatDate('MMM D, YYYY, h\:mm A')}}”
     * **Subject:** “{{subStrand.strand.subject.name}}”
     * **Buttons (Right-aligned):**

       1. **Regenerate Entire Set** (Secondary, icon: refresh)
       2. **Shuffle Questions** (Tertiary, icon: shuffle)
       3. **Export to DOCX** (Primary, icon: download)

2. **Tabs for Question Types:**

   * Use a Vibe “Tabs” component with four possible tabs: “MCQ,” “True/False,” “Fill in the Blank,” “Short Answer.”
   * Each tab’s label shows the count: e.g., “MCQ ({{countMCQ}})”. Retrieve counts by applying a Vibe formula on `GeneratedQuestionSet.questionsJSON`.
   * Only show tabs where `count > 0`. For example, if no fill-in questions, do not display that tab.

3. **Question Cards (Within Each Tab):**

   * **Repeater:** Bound to the filtered array `GeneratedQuestionSet.questionsJSON.filter(q => q.type == currentTabType)`.
   * **MCQ Template (20px vertical gap between cards):**

     * **Card Container (Box, Elevation 1, 24px padding, border-radius 8px):**

       1. **Header Row:**

          * “Question {{index + 1}}” (H4)
          * **Icon Buttons (Right side):**

            * **Regenerate** (icon: refresh, color: `var(--secondary)`, hover: `var(--primary)`, click: run workflow to regenerate this question only).
            * **Delete** (icon: trash, color: `var(--danger)`, click: remove item from `questionsJSON` and call “Save Changes”).
       2. **Question Text:**

          * Editable “Textarea” bound to `questionsJSON[index].text`.
          * If empty, show a 1px border in `var(--danger)` and an inline error: “Question text required.”
       3. **Options List (4 rows):**

          * Each row:

            * **Radio Button** (component) bound to `questionsJSON[index].answer`: if this option’s index matches the stored answer, that radio is selected.
            * **Text Input** for the option text, bound to `questionsJSON[index].options[i]`.
            * On hover over option rows, highlight background to `var(--surface)`.
          * If fewer than 2 non-empty options, highlight card border in `var(--danger)` and show “At least 2 options required.”
       4. **Answer Key Label:**

          * “Answer: {{questionsJSON\[index].answerLabel}}” (Inter Medium, 14px, `var(--success)`).
   * **True/False Template:**

     * Card header & icon buttons (same as MCQ).
     * **Statement Text:** Editable “Textarea” bound to `questionsJSON[index].text`.
     * **Toggle Group:** Two “Button Toggle” components side by side: “True” and “False.” Bind to `questionsJSON[index].answer` (boolean).
     * If text empty, show inline error.
   * **Fill-in-the-Blank Template:**

     * Card header & icon buttons.
     * **Sentence with Inputs:** Display as a “Flex” container mixing static text spans and inline “Text Input” fields (width \~120px each) bound to each blank’s `answer`.
     * Answers list below (optional): loop `questionsJSON[index].answers[]` and show as inline chips.
     * If any blank’s value is empty, highlight in red.
   * **Short Answer Template:**

     * Card header & icon buttons.
     * **Prompt Text:** “Textarea” bound to `questionsJSON[index].text`.
     * **Suggested Answer:** “Textarea” bound to `questionsJSON[index].modelAnswer`. (Optional, grey border).
     * If prompt is empty, show inline error.

4. **Save/Discard Sticky Footer (Position: Fixed Bottom, 100% width, Box Elevation 2):**

   * **Save Changes (Primary):**

     * Enabled if any edits exist (Vibe can track “dirty” state by comparing `questionsJSON` with DB snapshot).
     * On click: run `Update Record` for `GeneratedQuestionSet` with new `questionsJSON`. Show “Changes saved” toast.
   * **Discard Changes (Tertiary):**

     * On click: show a modal “Discard all unsaved changes?” If confirmed, refresh the page or re-fetch data to reset local edits.

5. **Help Sidebar (Right, 300px wide, Collapsible on Mobile):**

   * **Section Title:** “Review Tips” (H4).
   * **Dynamic List:** Use a “Repeater” bound to a `Tips` table where `subStrandID = currentSubStrandID`. Each tip row:

     * Icon (info circle, small), Tip text (16px, slate gray).
   * **Link:** “View Curriculum Details” → opens a modal showing `subStrand.description`.

6. **Export Flow Details:**

   * **Icon Button “Export to DOCX”:** On click, run the “Export to DOCX” workflow from Section 1.4.
   * **During Export:** Show a semi-opaque overlay with a spinner and text “Preparing DOCX…”.
   * **Once `exportStatus = ready`:** Vibe’s “On Data Change” event triggers a small toast: “Your file is ready! Click here to download.” The toast’s “Here” is a dynamic link to `GeneratedQuestionSet.exportURL`.
   * **If `exportStatus = failed`:** Show a red error message “Export failed—try again later.”

---

### 2.3.5 My Question Sets (`/sets`)

* **Page Header:** “My Question Sets” (H2, 28px) + “Generate New Set” (Primary button) aligned right.

* **Search & Filters (Inline, 16px Spacing):**

  1. **Search Input:** “Search by Sub-Strand or Set Name…” (text).
  2. **Subject Filter (Dropdown):** Option “All Subjects,” then list from `Subject`.
  3. **Date Range Picker (Two Date Pickers):** “From” and “To.”
  4. **Status Filter (Dropdown):** Options “All,” “Draft,” “Completed.”
  5. **Clear Filters (Tertiary Button).**

* **Table of Sets:** (Repeater or Table component) bound to `GeneratedQuestionSet` where `userID = currentUser.id`, with applied filters:

  * **Columns:**

    1. **Created At** (`createdAt | formatDate('MMM D, YYYY')`)
    2. **Sub-Strand** (`subStrand.name`)
    3. **Question Count** (`LEN(questionsJSON)`)
    4. **Status** (`status`)
    5. **Actions:**

       * **Review** (icon: eye; navigates to `/questions/sets/{{id}}`)
       * **Export** (icon: download; if `exportStatus != ready`, run export workflow; else direct link to `exportURL`)
       * **Delete** (icon: trash; confirmation)

* **Bulk Actions (Above Table, Visible When >1 Row Selected):**

  * **Delete Selected** (Secondary) – calls “Delete Record” on multiple `GeneratedQuestionSet` IDs.
  * **Export Selected (ZIP)** (Primary) – runs a “Custom Function” that:

    1. Collects `exportURL` for each selected `setID`.
    2. Invokes a serverless function (AWS Lambda) that fetches each DOCX, zips them, uploads the ZIP to `/exports/{{userID}}/batch_{{timestamp}}.zip`, returns a pre-signed URL.
    3. Saves a new record in a `BatchExport` table with `userID`, `zipURL`.
    4. Shows a toast: “Your ZIP file is ready” with link to download.

* **Empty State:** If no sets, show illustration + “You haven’t generated any question sets yet. Let’s create one!” (Button → `/generate`).

---

### 2.3.6 Billing & Subscription (`/billing`)

* **Page Header:** “Billing & Subscription” (H2)
* **Current Plan Card (Center, Width 600px, Elevation 1):**

  * **Title:** “Current Plan: {{currentPlan.name}}” (H3).
  * **Usage Bar:** If `currentPlan.monthlyLimit > 0`, show “You have used {{usageThisMonth}} of {{currentPlan.monthlyLimit}} questions.” Then a “Progress Bar” with fill = `(usageThisMonth/monthlyLimit) * 100%`.
  * **Buttons:**

    * If on Free: “Upgrade to Pro” (Primary).
    * If on Pro: “Change Plan” (Tertiary) + “Cancel Subscription” (text only).
  * **Next Billing Date:** “Renews on {{currentUser.nextBillingDate}}” (Small, 14px, #64748B).
* **Available Plans Section (Below):**

  * **Repeater** bound to `Plans` table. Each plan card (width 300px) shows:

    * `plan.name` + optional “Popular” badge (for Pro).
    * Price: `₵0/mo` for Free or `$15/mo` for Pro.
    * Feature list (from `featuresJSON`).
    * Button:

      * If `plan.id != currentPlan.id`: “Select” (Primary for Pro/Institutional, Tertiary for Free if downgrading).
      * If `plan.id = currentPlan.id`: “Current Plan” (Disabled, Secondary).
    * On clicking “Select,” run Stripe checkout workflow (as described in Section 1.4).
* **Payment Method Section (Below Plans):**

  * If on Pro: show a “Update Payment Method” (Secondary) button embedded with Stripe Elements.
  * **Payment History Table:**

    * Bound to `PaymentTransaction` where `userID = currentUser.id`.
    * Columns: `transactionDate`, `amount`, `status`, “Invoice” link (if available).
* **FAQ Accordion (Bottom):**

  * Static “BillingFAQ” table bound to an “Accordion” component.
  * Common items: “How do I cancel?” “Can I switch mid-cycle?”

---

### 2.3.7 Profile & Settings (`/settings`)

* **Tabbed Interface:**

  * Use a Vibe “Tabs” component with “Profile,” “Notifications,” “Security.”
  * Each tab has a separate “Form” or “Repeater” region.

1. **Profile Tab:**

   * **Form Bound to `User`:** Fields:

     * **Full Name (Text Input)** – bound to `User.fullName`.
     * **Email (Text Input, disabled)** – display only. If teacher requests email change, a “Change Email” button appears (opens a modal asking for new email, triggers a workflow to send verification).
     * **School Name (Text Input, optional)** – bound to `User.schoolName`.
     * **Change Password Section:**

       * **Current Password (Password Input)**
       * **New Password (Password Input)**
       * **Confirm New Password (Password Input)**
       * On “Change Password” button click, run Vibe’s built-in “Change Password” action (which verifies `currentPassword` then sets new one).
   * **Save Changes (Primary)** – runs “Update Record” on `User`.
   * **Cancel (Tertiary)** – revert to last saved values.

2. **Notifications Tab:**

   * **Toggles Bound to `User.settings` (or a separate `UserSettings` table):**

     * “Email me when my question set is ready.” (bind to `User.notifyOnSetReady` boolean)
     * “In-app notifications for new features.” (bind to `User.notifyInAppUpdates`)
     * “Receive monthly usage summary email.” (bind to `User.notifyUsageSummary`)
   * **Save Preferences (Primary)** – updates `User` settings.
   * **Cancel (Tertiary)** – revert changes.

3. **Security Tab:**

   * **Login Activity Repeater:** Bound to `LoginHistory` table (if implemented). Show last 5 entries: `attemptedAt | formatDate('MMM D, YYYY h:mm A')`, `deviceInfo`, `ipAddress`.
   * **Logout from Other Devices (Secondary):** On click, run a Vibe “Custom Function” that deletes all `UserRefreshToken` records where `userID = currentUser.id` except for the current session.
   * **Enable 2FA (Coming Soon):** Disabled toggle. When implemented, toggle would call a “Enable 2FA” workflow.

---

### 2.3.8 Help & Support (`/support`)

* **Search Bar:** “Search FAQs…” (binds to `FAQ.question`).
* **Accordion List:** Bound to `FAQ` where `category` = “General” or “Technical.”
* **Contact Form:**

  * Fields:

    * **Subject (Dropdown):** Options: “Technical Issue,” “Billing,” “Feature Request.”
    * **Message (Textarea)** – up to 2000 chars.
    * **Attach Screenshot (File Upload)** – optional, bind to a `file` field.
  * **Button:** “Submit Ticket” (Primary) – on click: create a `SupportTicket` row with `userID`, `subject`, `message`, and file (if provided). Then run a “Send Email” action to [support@yourapp.edu.gh](mailto:support@yourapp.edu.gh) with ticket ID.
  * **Success:** Show “Thanks! We’ll respond within 24 hours.”
* **Chat Widget (Optional/Phase 2):** Embed a third-party script (e.g., Crisp or Intercom) via Vibe’s “Custom Script” settings.

---

### 2.3.9 Error & Miscellaneous Screens

1. **404 Page:**

   * **Content:**

     * “404 – Page Not Found” (H2, 36px).
     * “Sorry, we couldn’t find that page.” (Body, 16px).
     * “Go to Dashboard” (Primary, `/dashboard`).
     * Illustration (SVG of teacher looking at a blank screen).
   * **Vibe Implementation:** Create a special page in Vibe routed to “404” and set as the fallback route in settings.

2. **500 Page:**

   * **Content:**

     * “500 – Something Went Wrong” (H2).
     * “Our team has been notified. Please try again later or contact support.” (Body).
     * “Contact Support” (Secondary, `/support`).
   * **Vibe Implementation:** Create a page for “500,” but Vibe may handle server errors automatically. Use “Custom Error Pages” if available.

3. **Session Expired Modal:**

   * **Trigger:** If a user’s JWT expires or if Vibe’s “sessionTimeout” event occurs (e.g., 30 minutes of inactivity), show a modal:

     * Title: “Session Expired” (H3, 24px).
     * Body: “For security, please log in again to continue.” (Body, 16px).
     * Button: “Log In” (Primary, `/auth/login`).
   * **Vibe Implementation:** In Vibe’s “Security Settings,” enable “Idle Timeout” (e.g., 30m). Configure redirect to `/auth/login` on automatic logout. For a custom modal, use Vibe’s “Event Triggers” to show when `sessionExpired = true`.

---

## 2.4 Textual Flow Diagram (No-Code)

Below is a concise, linear flow of how a teacher navigates—each step corresponds to a Vibe page or modal. The teacher never sees code—only UI components configured in Vibe.

```plaintext
[Landing Page (/)]
    ↓ (Click “Sign Up”)
[Register Page (/auth/register)] --Vibe Auth--
    ↓ (Submit → Email Verification Sent)
[Email Verification Page (/auth/verify?...)] 
    ↓ (Click link in email)
[Login Page (/auth/login)]
    ↓ (Valid credentials)
[Dashboard (/dashboard)]
 ├─ “Generate New Set” → [/generate] (Step 1)
 │     ├─ Step 1 (Select Document & Curriculum) → Next
 │     ├─ Step 2 (Configure Question Types) → Next
 │     ├─ Step 3 (Extra Notes) → “Generate” → create `QuestionSetRequest`
 │     └─ Step 4 (/generate/progress?requestId=...) (Poll status)
 │           ├─ If pending or in_progress → show progress bar
 │           └─ If complete → redirect to [/questions/sets/{setId}]
 ├─ “My Documents” → [/documents]
 │     ├─ Upload File Modal → saves `Document` row + file in S3
 │     └─ Document Table (View/Delete)
 ├─ “My Question Sets” → [/sets]
 │     ├─ Filter/Search Table (GeneratedQuestionSet for user)
 │     └─ Actions:  
 │         ├– “Review” → [/questions/sets/{setId}]
 │         │     ├– Tabs (MCQ, T/F, etc.)  
 │         │     ├– Repeater cards for questions  
 │         │     ├– “Save Changes” → updates `GeneratedQuestionSet`  
 │         │     └– “Export to DOCX” → runs export workflow → file in /exports/
 │         ├– “Export” (Direct link if ready or runs workflow if not)  
 │         └– “Delete” (Confirms then deletes row)
 ├─ “Billing & Subscription” → [/billing]
 │     ├─ Current Plan Card (Upgrade/Manage)  
 │     ├─ Plans Repeater (Free, Pro, Institutional)  
 │     ├– Select Plan → Stripe Checkout → webhook updates `User.subscriptionPlanID`  
 │     └– Payment History Table (`PaymentTransaction`)
 ├─ “Profile & Settings” → [/settings]
 │     ├– “Profile” Tab (Full Name, Email, Change Password)  
 │     ├– “Notifications” Tab (Email/In-App toggles)  
 │     └– “Security” Tab (Login Activity, “Logout Other Devices”)
 └─ “Help & Support” → [/support]
       ├– FAQ Search & Accordion (FAQ table)  
       └– Contact Form (Create `SupportTicket`, send email)
 
Any invalid URL → [404 Page]
Server error → [500 Page]
Session idle 30m → Session Expired Modal → [/auth/login]
```

---

# 3. Design Guidelines (Technical Product Designer Focus)

Below are the final, detailed design tokens, component styles, and interaction specifications for implementing the UI in Vibe (or any similar no-code platform). These guidelines ensure consistency, accessibility, and a polished, teacher-centric experience.

---

## 3.1 Global Theme & Tokens

### 3.1.1 Color Palette

Define these as named “Color Tokens” in Vibe’s Theme settings so they can be reused across components.

| Token Name       | Role                   | Hex Code | Usage Examples                                           |
| ---------------- | ---------------------- | -------- | -------------------------------------------------------- |
| `primary`        | Primary Branding Color | #1E3A8A  | Primary Buttons, Active Sidebar, Link Hover              |
| `success`        | Success / Focus Color  | #10B981  | Progress Bars, Focus Outlines, Required Field Highlights |
| `secondary`      | Secondary / Icon Color | #64748B  | Iconography, Disabled Buttons, Placeholder Text          |
| `warning`        | Accent / Notification  | #FBBF24  | Badges, “Upgrade” Highlights, Call-to-Action Accents     |
| `danger`         | Error / Destructive    | #EF4444  | Error Text, Delete Icons, Destructive Buttons            |
| `background`     | Page Background        | #FFFFFF  | Main background, Card backgrounds                        |
| `surface`        | Secondary Background   | #F1F5F9  | Form Field Backgrounds, Alternate Table Rows             |
| `border`         | Border Color           | #E2E8F0  | Input Borders, Card Dividers, Table Cell Borders         |
| `text-primary`   | Primary Text Color     | #1F2937  | Body Text, Headings, Button Labels                       |
| `text-secondary` | Secondary Text Color   | #64748B  | Form Labels, Helper Text, Muted Copy                     |
| `text-disabled`  | Disabled / Placeholder | #A0AEC0  | Disabled Inputs, Placeholder Text, Caption               |

---

### 3.1.2 Typography Tokens

Configure Vibe’s global font settings and create “Typography Styles” for each heading and text style.

| Token Name    | Font Family (Fallback) | Size (px) | Line-Height (px) | Weight | Letter Spacing (px) | Usage                                   |
| ------------- | ---------------------- | --------- | ---------------- | ------ | ------------------- | --------------------------------------- |
| `h1`          | Lexend, serif          | 36        | 44               | 700    | 0.5                 | Page Titles, Major Section Headers      |
| `h2`          | Lexend, serif          | 28        | 36               | 600    | 0.5                 | Sub-Section Titles, Modals              |
| `h3`          | Inter, sans-serif      | 24        | 32               | 600    | 0.5                 | Section Headings, Review Screen Headers |
| `h4`          | Inter, sans-serif      | 20        | 28               | 500    | 0.5                 | Form Section Labels, Card Titles        |
| `body`        | Inter, sans-serif      | 16        | 24               | 400    | 0.25                | Paragraphs, Form Inputs, Button Text    |
| `small`       | Inter, sans-serif      | 14        | 20               | 400    | 0.25                | Captions, Timestamps, Helper Text       |
| `extra-small` | Inter, sans-serif      | 12        | 16               | 400    | 0.25                | Legal Text, Footer Links, Micro Copy    |

* **Fallbacks:** System UI fonts are acceptable as fallback (`–apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, “Helvetica Neue”, Arial, sans-serif`) if Inter/Lexend aren’t available.
* **Usage:** Every Vibe text component (Headings, Paragraph, Button, Input) should be assigned exactly one of these style tokens.

---

### 3.1.3 Spacing & Layout Tokens

Use an 8-point grid system for margins, paddings, and gaps.

| Token Name            | Value (px) | Usage Examples                            |
| --------------------- | ---------- | ----------------------------------------- |
| `spacing-extra-small` | 4          | Tiny gaps between icons & text            |
| `spacing-small`       | 8          | Between form label & input                |
| `spacing-medium`      | 16         | Between stacked fields, paragraph spacing |
| `spacing-large`       | 24         | Card padding, Section padding             |
| `spacing-xlarge`      | 32         | Between major page sections               |
| `spacing-xxlarge`     | 40         | Large vertical space in dashboards        |
| `spacing-xxxlarge`    | 48         | Top of page to first section              |
| `spacing-huge`        | 64         | Section-to-section on landing page        |

* **Containers / Grid Breakpoints:**

  * **Max Content Width (Desktop):** 1024px centered.
  * **Tablet Width:** 768px with 16px side padding.
  * **Mobile Width:** Full width with 16px side padding.

---

## 3.2 Component Styles

Below are detailed specs for each primary component. When customizing in Vibe, use the Theme tokens above and override the default component styling accordingly.

### 3.2.1 Buttons

#### Primary Button (`.btn-primary`)

* **Background:** `var(--primary)` (#1E3A8A)
* **Text Color:** `var(--background)` (#FFFFFF)
* **Font:** `font-family: var(--font-body); font-weight: 600; font-size: 16px; letter-spacing: 0.5px`
* **Padding:** `12px 24px` (`spacing-medium` vertical, `spacing-large` horizontal)
* **Border Radius:** `8px`
* **Box Shadow:** Level 1

  ```css
  box-shadow:
    0 1px 2px rgba(31, 41, 55, 0.05),
    0 1px 3px rgba(31, 41, 55, 0.10);
  ```
* **Hover State:**

  ```css
  background-color: darken(var(--primary), 5%);
  transition: background-color 150ms ease;
  ```
* **Active State:**

  ```css
  background-color: darken(var(--primary), 10%);
  ```
* **Disabled State:**

  ```css
  background-color: var(--secondary);
  opacity: 0.5;
  cursor: not-allowed;
  ```

#### Secondary Button (`.btn-secondary`)

* **Background:** `var(--background)` (#FFFFFF)
* **Border:** `2px solid var(--primary)` (#1E3A8A)
* **Text Color:** `var(--primary)`
* **Font:** `Inter SemiBold 16px, letter-spacing: 0.5px`
* **Padding:** `10px 22px` (`spacing-small` × `spacing-large`)
* **Border Radius:** `8px`
* **Hover State:**

  ```css
  background-color: rgba(30, 58, 138, 0.1);
  transition: background-color 150ms ease;
  ```
* **Active State:**

  ```css
  background-color: rgba(30, 58, 138, 0.15);
  ```
* **Disabled State:**

  ```css
  border-color: var(--border);
  color: var(--text-disabled);
  background-color: var(--surface);
  cursor: not-allowed;
  ```

#### Tertiary Button (`.btn-tertiary`)

* **Background:** `transparent`
* **Text Color:** `var(--primary)` (#1E3A8A)
* **Font:** `Inter Medium 16px, letter-spacing: 0.5px`
* **Padding:** `8px 16px` (`spacing-small`)
* **Hover State:**

  ```css
  color: var(--success);
  ```
* **Active State:**

  ```css
  background-color: var(--surface);
  ```
* **Disabled State:**

  ```css
  color: var(--text-disabled);
  opacity: 0.5;
  cursor: not-allowed;
  ```

---

### 3.2.2 Form Inputs

#### Text Input / Numeric Input / Textarea (`.input-default`)

* **Background:** `var(--background)` (#FFFFFF)
* **Border:** `1px solid var(--border)` (#E2E8F0)
* **Border Radius:** `4px`
* **Padding:** `12px` (`spacing-large`)
* **Font:** `Inter Regular 16px, letter-spacing: 0.25px, color: var(--text-primary)`
* **Placeholder Text:** `color: var(--text-secondary); opacity: 0.6`
* **Focus State:**

  ```css
  border: 2px solid var(--success);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
  outline: none;
  transition: border 150ms ease, box-shadow 150ms ease;
  ```
* **Error State:**

  ```css
  border-color: var(--danger);
  ```

  * Add an inline `<span role="alert" style="color: var(--danger); font-size: 14px; margin-top: 4px;">Error message</span>` below the field.
* **Disabled State:**

  ```css
  background-color: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-disabled);
  cursor: not-allowed;
  ```

#### Select / Dropdown (`.select-default`)

* **Appearance:** Styled similarly to text input with a custom dropdown arrow.
* **Background:** `var(--background)` (#FFFFFF)
* **Border:** `1px solid var(--border)`
* **Padding:** `12px` left (`spacing-large`) + `32px` right (space for arrow icon).
* **Border Radius:** `4px`
* **Font:** `Inter Regular 16px`
* **Arrow Icon:** Positioned right (16px from edge), color `var(--secondary)`.
* **Open Menu Styles:**

  * **Container:** `background-color: var(--background)`, `box-shadow: level 2`, `border-radius: 8px`, `overflow: hidden`.
  * **Menu Items:**

    * `padding: 12px 16px`, `font: Inter Regular 16px`, `color: var(--text-primary)`.
    * `:hover` → `background-color: var(--surface)`, `color: var(--primary)`.
    * `:selected` → `background-color: var(--surface)`, `font-weight: 600`.

#### Radio Buttons & Checkboxes

* **Radio (`.radio-input`):**

  * **Outer Circle:** `width: 16px; height: 16px; border: 1.5px solid var(--secondary); border-radius: 50%; display: inline-block; vertical-align: middle;`
  * **Checked State:** Use a `::after` pseudo-element:

    ```css
    .radio-input:checked::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
      margin: 3px; /* centers inside 16px circle */
    }
    ```
  * **Label:** Positioned to the right, `margin-left: 8px`, `font: Inter Regular 16px`, `color: var(--text-primary)`.
  * **Disabled State:** `border-color: var(--text-disabled); cursor: not-allowed;` Label color = `var(--text-disabled)`.

* **Checkbox (`.checkbox-input`):**

  * **Box:** `width: 16px; height: 16px; border: 1.5px solid var(--secondary); border-radius: 4px;`
  * **Checked State:** `background-color: var(--success);` and a white check mark icon inside (use an SVG or icon component).
  * **Label:** Same as radio.
  * **Disabled State:** `border-color: var(--text-disabled); background-color: var(--surface);` Label color = `var(--text-disabled)`.

---

### 3.2.3 Cards & Containers

#### Card (.card-default)

* **Background:** `var(--background)` (#FFFFFF)
* **Border Radius:** `8px`
* **Box Shadow (Elevation 1):**

  ```css
  box-shadow:
    0 1px 2px rgba(31, 41, 55, 0.05),
    0 1px 3px rgba(31, 41, 55, 0.10);
  ```
* **Padding:** `24px` (`spacing-large`)
* **Margin Between Cards:** `32px` (`spacing-xlarge`)
* **Hover State:** Elevate to Level 2 shadow:

  ```css
  &:hover {
    box-shadow:
      0 4px 6px rgba(31, 41, 55, 0.10),
      0 2px 4px rgba(31, 41, 55, 0.06);
    transition: box-shadow 150ms ease;
  }
  ```

#### Table (.table-default)

* **Table Layout:** Horizontal scroll if overflow on mobile.
* **Header Row:**

  * **Background:** `var(--surface)` (#F1F5F9)
  * **Text:** `font: Inter SemiBold 14px`, `color: var(--text-primary)`
  * **Row Height:** `48px`
  * **Cell Padding:** `12px 16px`
* **Body Rows:**

  * **Even Rows:** `background-color: var(--background)` (#FFFFFF)
  * **Odd Rows:** `background-color: var(--surface)` (#F1F5F9)
  * **Text:** `font: Inter Regular 16px`, `color: var(--text-primary)`
  * **Hover (on desktop):** `background-color: lighten(var(--surface), 10%)`
  * **Cell Padding:** `12px 16px`
* **Border:**

  * `border-collapse: separate; border-spacing: 0 1px` for subtle separation.
* **Action Icons:**

  * **Default:** `width: 20px; height: 20px; color: var(--secondary)`
  * **Hover:** `color: var(--primary)`

---

### 3.2.4 Tabs

#### Tabs Container (.tabs)

* **Container:** `display: flex; border-bottom: 2px solid var(--border);`
* **Tab Item:**

  * `padding: 12px 24px; font: Inter Medium 16px; color: var(--text-secondary); cursor: pointer;`
  * **Active Tab:**

    ```css
    color: var(--primary);
    border-bottom: 3px solid var(--success);
    ```
  * **Hover (Inactive):**

    ```css
    color: var(--primary);
    transition: color 150ms ease;
    ```

#### Tab Panels (.tab-panel)

* **Container:** `padding: 24px; background-color: var(--background);`
* **Visibility:** Only the panel matching the active tab index is visible (`display: block`), others `display: none`.

---

### 3.2.5 Modals & Overlays

#### Modal Container (.modal)

* **Positioning:** Fixed, top: 50%, left: 50%, transform: `translate(-50%, -50%)`
* **Background:** `var(--background)` (#FFFFFF)
* **Border Radius:** `8px`
* **Box Shadow (Elevation 2):**

  ```css
  box-shadow:
    0 4px 6px rgba(31, 41, 55, 0.10),
    0 2px 4px rgba(31, 41, 55, 0.06);
  ```
* **Max Width:** `640px`
* **Padding:** `32px`
* **Overlay (Backdrop):**

  * Full-screen fixed `background-color: rgba(0, 0, 0, 0.4);`
  * Z-index just below modal.
* **Animation:**

  * **Enter:** `opacity: 0 → 1`, scale: `0.95 → 1.0` over 250ms.
  * **Exit:** Reverse over 200ms.

#### Toasts / Notifications (.toast)

* **Position:** Fixed bottom-right (24px from edges)
* **Container:** `padding: 16px; border-radius: 6px; display: flex; align-items: center; gap: 12px;`
* **Background:**

  * **Success:** `var(--success)` (#10B981)
  * **Error:** `var(--danger)` (#EF4444)
  * **Info:** `var(--primary)` (#1E3A8A)
* **Text:** `font: Inter Regular 14px; color: var(--background)`
* **Icon (Left):** 24×24 px, `color: var(--background)`
* **Animation:** Slide in from bottom (translateY: 20px → 0) + fadeIn (opacity: 0 → 1) over 250ms.
* **Auto-Dismiss:** After 4 seconds, fade out (opacity 1 → 0) over 150ms. Pause on hover.

---

### 3.2.6 Form Layouts & Validation

#### Form Container (.form-container)

* **Max Width:** `600px` (desktop), 100% (tablet/mobile)
* **Padding:** `24px` (`spacing-large`)
* **Margin:** `auto` left & right to center on desktop
* **Background:** `var(--background)`
* **Border:** `1px solid var(--border)`
* **Border Radius:** `8px`

#### Form Group (.form-group)

* **Display:** `flex; flex-direction: column; margin-bottom: 16px;`
* **Label:**

  * `font: Inter Medium 14px; color: var(--text-primary); margin-bottom: 8px;`
  * If field is required: append an asterisk `*` in `var(--danger)`.
* **Input:** Styled as `.input-default` above.
* **Helper Text:**

  * `font: Inter Regular 14px; color: var(--text-secondary); margin-top: 4px;`
* **Error Text:**

  * `font: Inter Regular 14px; color: var(--danger); margin-top: 4px;`
  * Hidden by default; displayed when a validation rule fails (Vibe’s “Required Field” rule or custom).

---

### 3.2.7 Responsive Layouts & Breakpoints

Use Vibe’s responsive controls to adjust styling at each breakpoint.

1. **Breakpoints:**

   * **Mobile (sm):** `< 640px`
   * **Tablet (md):** `640px – 767px`
   * **Small Desktop (lg):** `768px – 1023px`
   * **Desktop (xl):** `≥ 1024px`

2. **Sidebar Behavior:**

   * \*\* xl & lg (≥ 768px):\*\* Sidebar fixed at 240px.
   * **md (640–767px):** Sidebar collapses to icons only (width 80px). Hover expands.
   * **sm (< 640px):** Sidebar hidden by default; a hamburger menu icon in Navbar toggles a slide-in drawer (width 80% of viewport).

3. **Generate Wizard Layout:**

   * **Desktop (≥ 1024px):** Two-column: Left (form, 60% width), Right (summary, 40%).
   * **Tablet (768–1023px):** Single column—form components full width (100%), summary panel below.
   * **Mobile (< 768px):** All sections full width, step indicator at top only (no side content).

4. **Question Review Page:**

   * **Desktop:** Tabs appear horizontally, repeater cards 800px max width, with right sidebar (300px) for tips.
   * **Tablet:** Tabs may condense; tips sidebar hides or becomes a toggleable panel.
   * **Mobile:** Tabs convert to dropdown (select control), repeater cards full width, no sidebars.

---

### 3.3 Shadows & Depth

Define consistent elevation levels for layering:

1. **Elevation 1 (Cards, Tables, Buttons Hover):**

   ```css
   box-shadow:
     0 1px 2px rgba(31, 41, 55, 0.05),
     0 1px 3px rgba(31, 41, 55, 0.10);
   ```
2. **Elevation 2 (Modals, Overlays, Dropdown Menus):**

   ```css
   box-shadow:
     0 4px 6px rgba(31, 41, 55, 0.10),
     0 2px 4px rgba(31, 41, 55, 0.06);
   ```
3. **Elevation 3 (Tooltips, Context Menus):**

   ```css
   box-shadow:
     0 10px 15px rgba(31, 41, 55, 0.10),
     0 4px 6px rgba(31, 41, 55, 0.05);
   ```

* **Usage Examples:**

  * **Elevation 1:** Dashboard cards (Usage Snapshot, Plans, Question Cards).
  * **Elevation 2:** Modals (Upload, Delete Confirmation, Progress Overlay), dropdown menus.
  * **Elevation 3:** Tooltips (hovering over icons for inline help).

---

### 3.4 Animations & Micro-Interactions

Define global transition settings so interactions feel smooth but not overly flashy.

1. **Easing Curve:**

   * Use `cubic-bezier(0.4, 0.0, 0.2, 1)` for all transitions (fast out, slow in).

2. **Duration Tokens:**

   * **Fast:** `150ms` (hover, focus states)
   * **Medium:** `250ms` (modals, toasts appear/disappear)
   * **Slow:** `400ms` (page region transitions, sidebar expand/collapse)

3. **Button Hover:**

   ```css
   .btn-primary:hover, .btn-secondary:hover {
     transition: background-color 150ms ease, color 150ms ease;
   }
   ```

4. **Modal & Drawer Animations:**

   * **Modal Enter:**

     ```css
     transform: scale(0.95);
     opacity: 0;
     animation: modal-in 250ms forwards;
     @keyframes modal-in {
       to {
         transform: scale(1);
         opacity: 1;
       }
     }
     ```
   * **Modal Exit:**

     ```css
     animation: modal-out 200ms forwards;
     @keyframes modal-out {
       to {
         transform: scale(0.95);
         opacity: 0;
       }
     }
     ```
   * **Sidebar (Mobile) Slide In/Out:**

     ```css
     /* Slide in */
     transform: translateX(-100%);
     animation: sidebar-in 300ms forwards;
     @keyframes sidebar-in {
       to {
         transform: translateX(0);
       }
     }
     /* Slide out */
     animation: sidebar-out 300ms forwards;
     @keyframes sidebar-out {
       to {
         transform: translateX(-100%);
       }
     }
     ```

5. **Tooltip Fade & Scale:**

   ```css
   .tooltip {
     transform: scale(0.9);
     opacity: 0;
     animation: tooltip-in 200ms forwards;
   }
   @keyframes tooltip-in {
     to {
       transform: scale(1);
       opacity: 1;
     }
   }
   .tooltip-out {
     animation: tooltip-out 150ms forwards;
   }
   @keyframes tooltip-out {
     to {
       transform: scale(0.9);
       opacity: 0;
     }
   }
   ```

6. **Toast Slide & Fade:**

   ```css
   .toast {
     transform: translateY(20px);
     opacity: 0;
     animation: toast-in 250ms forwards;
   }
   @keyframes toast-in {
     to {
       transform: translateY(0);
       opacity: 1;
     }
   }
   .toast-out {
     animation: toast-out 150ms forwards;
   }
   @keyframes toast-out {
     to {
       transform: translateY(20px);
       opacity: 0;
     }
   }
   ```

7. **Form Validation Feedback:**

   * When a field goes from valid → invalid (e.g., on blur), flash the border red for 200ms:

     ```css
     animation: shake-border 200ms;
     @keyframes shake-border {
       0%, 100% { border-color: var(--danger); }
       50% { border-color: var(--border); }
     }
     ```
   * If a teacher tries “Next” without filling required fields, shake the “Next” button (subtle horizontal shift) to draw attention.

---

### 3.5 Accessibility & Internationalization Readiness

1. **Contrast & Color Use:**

   * All text uses `var(--text-primary)` on `var(--background)` (ratio ≈ 12.6:1).
   * Links (`var(--primary)`) on white have a ratio ≈ 8.6:1.
   * Error text (`var(--danger)`) on white ratio ≈ 6.0:1.
   * If a state uses `var(--warning)` (#FBBF24) on white, contrast ≈ 3.5:1 (acceptable only for large text ≥ 18px). Use sparingly.

2. **Keyboard Navigation:**

   * All interactive elements (buttons, links, inputs, icons) must be reachable via Tab.
   * Apply `:focus-visible` styles:

     ```css
     button:focus-visible, input:focus-visible, a:focus-visible {
       outline: 2px solid var(--success);
       outline-offset: 2px;
     }
     ```

3. **ARIA Attributes:**

   * **Modals:**

     * `<div role="dialog" aria-modal="true" aria-labelledby="modal-title-id">`
     * Close button has `aria-label="Close modal"`.
   * **Toasts:**

     * `<div role="alert">` so screen readers announce immediately.
   * **Form Inputs:**

     * If an input has an error, `<span role="alert" id="email-error"> “Invalid email address.”</span>` and `<input aria-describedby="email-error">`.
   * **Tabs:**

     * Container: `<div role="tablist">`
     * Each tab: `<button role="tab" aria-selected="true/false" aria-controls="tabpanel-id">`.
     * Each panel: `<div role="tabpanel" aria-labelledby="tab-id">`.

4. **Reduced Motion Support:**

   * Add a global CSS snippet:

     ```css
     @media (prefers-reduced-motion: reduce) {
       * {
         animation: none !important;
         transition: none !important;
       }
     }
     ```

5. **Localization Preparation:**

   * Drive all text strings from a “Translation” collection in Vibe (table with `key`/`value`).
   * In each text component, bind to the translation table (e.g., use lookup `Translation.where(key = "dashboard.title").value`).
   * This ensures that if you later need TWI/Ga support, you can duplicate `Translation` entries in a new language column.

---

### 3.6 Iconography & Illustrations

1. **Icon Library Usage:**

   * Use **Feather Icons** (outline style, 24×24, stroke=2).
   * Default icon color: `var(--secondary)` (#64748B).
   * **Hover State:** `var(--primary)` (#1E3A8A).
   * **Active/Focus State:** `var(--success)` (#10B981).
   * Include `aria-hidden="true"` on icons that have adjacent text labels; if icon conveys meaning without text, give it `aria-label="Delete question"` or similar.

2. **Illustrations for Empty/Error States:**

   * Use custom SVGs limited to Navy (#1E3A8A) and Gold (#FBBF24).
   * For example:

     * **No Documents:** Stylized teacher holding an empty folder (Navy stroke, Gold accent).
     * **No Question Sets:** Open book with floating question marks (Navy stroke, Gold highlights).
   * Save each as a single SVG file (viewBox defined), optimized (SVGOMG).
   * Use Vibe’s “Image” component to insert with `alt="" aria-hidden="true"` if purely decorative, or meaningful alt text if it conveys information (e.g., “Illustration of teacher with empty folder”).

3. **Hero / Banner Images:**

   * On Landing page, an SVG or small vector illustration of a teacher at a computer screen with floating MCQ boxes—colors matched to brand: Navy strokes, Gold highlights.
   * Size: no more than 150 KB compressed. Use `<img role="img" alt="Teacher creating exam questions" src="/assets/hero.svg" />`.

---

### 3.7 Responsive & Mobile Considerations

Below are explicit adjustments for each breakpoint:

1. **Mobile (sm, < 640px):**

   * **Sidebar:** Hidden by default. A hamburger icon appears at top-left of Navbar. On click, a full-screen slide-in drawer (80% width) reveals menu items.
   * **Dashboard Layout:**

     * The “Usage Snapshot” card spans full width (no side panel).
     * “Recent Activity” table: enable horizontal scrolling, or switch to a “List” component that shows each set as a card.
   * **Generate Wizard:**

     * Steps appear stacked vertically; remove summary panel (display summary below the form as a collapsible panel labeled “Review Selections”).
     * Buttons full width (`padding-left/right 24px`).
   * **Review Page:**

     * Convert tabs to a “Select” dropdown. For example, “Select Question Type: \[MCQ ▼]” (where dropdown lists MCQ, T/F, etc.).
     * Each question card spans full width (no side margins).
     * The “Save” / “Discard” bar at bottom spans full width with no horizontal offset.

2. **Tablet (md, 640–767px):**

   * **Sidebar:** Collapsed to icons only (80px width). On hover or tap, expands to full width (240px).
   * **Dashboard:**

     * Two columns for cards if space permits (e.g., “Usage Snapshot” and “Recent Activity Summary” side by side), but generally single column with 16px side margins.
   * **Generate Wizard:**

     * Collapsible summary drawer that teachers can toggle open/close.
   * **Review Page:**

     * Tabs remain at the top; question cards can be narrower with side margins of 16px.

3. **Small Desktop (lg, 768–1023px):**

   * **Sidebar:** Full (240px).
   * **Content Container:** Max width 768px, centered.
   * **Tables and Cards:** Narrower padding (16px) and font sizes drop to:

     * Body: 15px (instead of 16px)
     * Small: 13px (instead of 14px)
   * **Generate Wizard:** Two columns, with summary panel still visible.

4. **Desktop (xl, ≥ 1024px):**

   * **Sidebar:** Always visible (240px).
   * **Content Container:** Max width 1024px, centered.
   * **All components** appear as designed (full margins).

---

### 3.8 Accessibility & ARIA Best Practices

1. **Contrast & Readability:**

   * Verify all text-on-background combinations meet WCAG 2.1 AA.

     * E.g., `#1E3A8A` on `#FFFFFF` = 8.6:1 (AA+, AAA).
     * `#EF4444` on `#FFFFFF` = 6.0:1 (AA+).
     * Avoid using `#FBBF24` (# warning) on white for small text; use only for large text or backgrounds.

2. **Keyboard Navigation & Focus States:**

   * All interactive elements (buttons, links, inputs, tabs) must have a visible `:focus-visible` outline:

     ```css
     :focus-visible {
       outline: 2px solid var(--success);
       outline-offset: 2px;
     }
     ```
   * Ensure the Tab order follows a logical reading order: Navbar → Sidebar → Main Content → Footer.

3. **ARIA Roles & Attributes:**

   * **Modals:**

     ```html
     <div role="dialog" aria-modal="true" aria-labelledby="modal-title-id">
       <h2 id="modal-title-id">Delete Document?</h2>
       ...
     </div>
     ```
   * **Toasts:**

     ```html
     <div role="alert" aria-live="assertive">
       <Icon name="check-circle" /> Your question set is ready!
     </div>
     ```
   * **Tabs:**

     ```html
     <div role="tablist">
       <button role="tab" aria-selected="true" aria-controls="panel-mcq" id="tab-mcq">MCQ (5)</button>
       <button role="tab" aria-selected="false" aria-controls="panel-tf" id="tab-tf">True/False (3)</button>
       ...
     </div>
     <div role="tabpanel" id="panel-mcq" aria-labelledby="tab-mcq"> ... </div>
     <div role="tabpanel" id="panel-tf" aria-labelledby="tab-tf" hidden> ... </div>
     ```
   * **Form Fields & Validation:**

     * Required fields have `aria-required="true"`.
     * If a field has an error, associate it:

       ```html
       <input id="email" aria-describedby="email-error" aria-invalid="true" />
       <span id="email-error" role="alert" style="color: var(--danger);">Email is required.</span>
       ```

4. **Internationalization (i18n) Readiness:**

   * Store all visible text in a `Translation` table with `key`/`value` pairs.
   * Example:

     | key                     | value                                       |
     | ----------------------- | ------------------------------------------- |
     | `dashboard.welcome`     | “Good morning, {{userName}}”                |
     | `wizard.step1.title`    | “Step 1 of 3: Select Document & Curriculum” |
     | `button.next`           | “Next”                                      |
     | `label.document.select` | “Choose a Document”                         |
   * In the UI, instead of static text, bind to `Translation.where(key = 'dashboard.welcome').value` (with a small formula to replace `{{userName}}` dynamically).
   * This way, adding Twi or Ga translations is just a matter of adding new rows (e.g., `translationTwi.welcome`).

---

### 3.9 Iconography & Illustrations

1. **Icon Standards:**

   * Use **Feather Icons** (outline, 24×24, stroke=2).
   * Import as SVG or icon component in Vibe.
   * Default color: `var(--secondary)` (#64748B).
   * On hover: `var(--primary)` (#1E3A8A).
   * On focus/active: `var(--success)` (#10B981).

2. **Illustrations:**

   * **No Documents Empty State:**

     * SVG of teacher holding clipboard with nothing on it. Stroke: `var(--primary)` (#1E3A8A), fill accent: `var(--warning)` (#FBBF24).
     * File size ≤ 150 KB.
   * **No Question Sets Empty State:**

     * SVG of an open book with floating question marks. Colors same as above.
   * Use `alt="" aria-hidden="true"` if purely decorative. If conveying meaning, use `alt="Illustration of teacher with empty folder, indicating no uploaded documents"`.
   * **Hero Illustration (Landing):**

     * A friendly, approachable teacher at a laptop with question blocks floating around.
     * Colors: Navy outlines, Gold accents.
     * Responsive SVG, max width 800px on desktop, scales down on tablet/mobile.

---

### 3.10 Final Notes for the Technical Product Designer

1. **Vibe-Specific Implementation Tips:**

   * Whenever you drag a component into a page, immediately assign the relevant “Style Token.” For example, after placing a “Button,” go to its Style panel and set `Background Color = var(--primary)`, `Border Radius = 8px`, `Font = Inter SemiBold 16px`.
   * Use “Conditional Visibility” rather than creating separate pages for each wizard step—bind to a page variable `currentStep`.
   * For nested repeaters (e.g., MCQ → Options), ensure the inner repeater’s data source is `questionsJSON[currentIndex].options`.

2. **Component Reusability & Naming Conventions:**

   * Name your overrides clearly: e.g., “Btn/Primary,” “Btn/Secondary,” “Input/Text,” “Card/Default,” “Modal/Default.”
   * Create a “Design System” workspace inside Vibe to house all these overrides and tokens so they can be referenced across pages.

3. **Collaboration & Versioning:**

   * Use Vibe’s “Comment” feature in each page to note any assumptions (e.g., “This card will later show usage analytics if we add Phase 2”).
   * Tag each major milestone (e.g., “v1.0-alpha,” “v1.0-beta”) so you can roll back if needed.

4. **Documentation & Handoff for Future Developers:**

   * Keep a “Living Document” (e.g., in Notion) that lists all major Vibe pages, their routes, and a short description.
   * For each page, note which Data Models it relies on and which workflows/triggers it runs (e.g., “/generate → runs AI Workflow on insert to QuestionSetRequest”).
   * Document any “Custom Functions” (serverless scripts) with clear comments and expected inputs/outputs.

---

With this documentation—covering a no-code AI build in Vibe/Windsurf—your team has a clear, prescriptive blueprint for how to assemble every piece of the puzzle without writing traditional code. All functional requirements, user flows, and design guidelines have been adapted to Vibe’s data models, visual workflows, and component theming system, ensuring a consistent, accessible, and high-quality educational web application for Ghanaian teachers.
