# System Requirements Specification (SRS) for Ghanaian JHS/SHS Exam Question Generator

## 1. Introduction
The SRS defines what the **web-based question generation tool** must do and how it should perform for Ghanaian JHS/SHS teachers. It lays the groundwork so all stakeholders understand the key functionalities and constraints. This system is intended to help teachers create exam questions aligned with the Ghana Education Service (GES) and NaCCA curriculum by leveraging AI. For example, modern AI question generators can produce diverse question formats **aligned with educational standards**, saving teachers time and ensuring curriculum relevance. This document covers purpose, scope, definitions, and overall system context for a web-only platform (English interface) with user management, content upload, AI-driven question generation, and export capabilities.

## 2. System Overview
The system is a **web-based platform** (no mobile/desktop apps initially) allowing teachers to access features via standard browsers. The major components are:

- **Web UI/Frontend**  
  - A responsive browser interface for user registration/login, uploading documents, configuring question parameters, reviewing questions, and exporting output.  
  - Uses HTML/CSS/JavaScript and supports common browsers on desktop/laptop devices.

- **Backend/Application Server**  
  - Handles business logic, user management, file processing, and API orchestration.  
  - Connects to the AI engine, database, and external services.  
  - Sends uploaded content to an AI service that uses NLP/ML to generate questions.

- **AI Question-Generation Service**  
  - A third-party or self-hosted AI/LLM (e.g. OpenAI GPT-4) that analyzes teacher-provided content and curriculum context to produce questions.  
  - These AI technologies “analyze content and transform it into meaningful assessment questions.”

- **Database**  
  - Stores user accounts, uploaded reference documents, generated question sets, and curriculum metadata (e.g. GES/NaCCA subject/topic taxonomy).  
  - All user data is stored securely per best practices.

- **Document Processor**  
  - A service or library (e.g. python-docx, Apache POI) to generate and format a Word (DOCX) file containing the finalized questions for export.

- **Payment/Gateway Integration**  
  - If a freemium or subscription model is used, the system will integrate with payment APIs (e.g. Stripe or mobile money) to manage billing.

Overall, the system follows a three-tier web architecture (client UI, application logic server, database/API) to ensure modularity, scalability, and maintainability.

## 3. Functional Requirements
The system must provide the following functions for teacher users:

1. **User Account Management**  
   - Teachers can create an account (email/password signup), verify their email, log in securely, and reset passwords.  
   - The system will enforce secure authentication and store credentials safely.  
   - Non-admin users are teachers with a “Teacher” role.

2. **Document Upload**  
   - Teachers can upload reference documents (e.g. PDF, DOCX, PPTX).  
   - These serve as source material for question generation.  
   - The system should accept common file types and upload via the web interface.  
   - Note: AI quiz tools typically allow users to *“upload a file to start”* and convert PDFs, PPTs, notes, textbooks into quizzes in minutes.

3. **Curriculum Selection**  
   - After logging in, teachers select the *level* (JHS or SHS), *subject* (e.g. Mathematics, English, etc.), and *topic* (curriculum strand and sub-strand).  
   - The platform will present dropdowns or menus reflecting the official NaCCA/GES curriculum taxonomy.  
   - This ensures generated questions are aligned to the chosen curriculum area.

4. **Question Configuration**  
   - Teachers specify the **question types** (e.g. multiple-choice, true/false, fill-in-the-blank, short answer, etc.) and the **number of questions** of each type to generate.  
   - They may also set the *language* (English only) and optionally enter *context notes* or instructions to guide the AI.  
   - The UI should allow specifying “how many questions you need, the language…, and the type of questions.”

5. **AI Question Generation**  
   - Upon submission, the system sends the reference document, curriculum context, question types, and any notes to the AI engine.  
   - The AI processes the content (using NLP/ML) and produces a set of questions.  
   - Generated questions must be **pedagogically sound and aligned with GES/NaCCA standards**.  
   - The system should handle generation asynchronously if needed (e.g. showing a progress indicator) and store the output in the user’s session or database.

6. **Review and Edit Questions**  
   - Teachers can review the generated questions in the web interface.  
   - They should be able to accept questions as-is or edit them (e.g. adjust wording or answer choices).  
   - The interface should clearly display questions, choices (for MCQs), and correct answers for verification.  
   - Some AI quiz tools allow regenerating or editing questions on the fly.

7. **Export to DOCX**  
   - After finalizing, teachers can export the question set to a Word document (DOCX).  
   - The export should include questions and answer keys formatted as a clean exam paper or worksheet.  
   - The system will generate this file server-side and provide it as a download, allowing teachers to print or share the document.

8. **Data Storage**  
   - The system must store user profiles, account settings, uploaded documents, generation history, and generated questions securely in the database.  
   - This enables teachers to access past materials and prevents data loss.

9. **Pricing and Subscription**  
   - The system will support a **freemium or subscription model**.  
   - Basic features (e.g. a limited number of questions per month or basic question types) may be free, while advanced features or higher usage require payment.  
   - The UI should include pages for plan selection and integrate with payment providers for subscriptions.

10. **User Support and Documentation**  
    - The platform will include help documentation or tooltips explaining how to select curriculum topics and use features.  
    - Optional: an admin dashboard for managing subscriptions and viewing usage analytics (for stakeholders).

Each functional requirement ensures teachers can log in, configure and generate questions, and obtain them in DOCX format.

## 4. Non-Functional Requirements
The system’s quality and constraints are defined by these NFRs:

1. **Performance**  
   - The system should respond quickly. Page loads and simple actions (login, navigation) should happen within 1–2 seconds on a typical internet connection.  
   - Question generation (an AI call) may take longer (up to 10–15 seconds), but the UI should provide feedback (e.g., a spinner or progress bar).  
   - These performance goals ensure teachers aren’t left waiting.

2. **Security**  
   - User accounts and data must be secured. All web traffic will use HTTPS/TLS.  
   - Passwords will be stored hashed (bcrypt or similar).  
   - Access controls ensure teachers see only their own data.  
   - Sensitive data (e.g. payment info) is handled via PCI-compliant services.  
   - The system must comply with applicable data protection laws (e.g. Ghana’s Data Protection Act) by encrypting user data at rest and in transit.  
   - Overall, security is a core NFR to protect user information.

3. **Usability**  
   - The interface should be intuitive for teachers (who may have varying technical skills).  
   - Use clear labels (e.g. “Upload Document”, “Generate Questions”), step-by-step workflow, and helpful error messages.  
   - Provide an English-only interface (as required).  
   - Ensure accessibility (e.g. readable fonts, logical navigation).  
   - Minimal training should be needed, as the UI is straightforward.

4. **Scalability**  
   - The architecture should allow scaling the AI service and web server to handle many teachers concurrently.  
   - For a cloud deployment, resources (CPU/RAM) should auto-scale based on demand.  
   - The system should support hundreds of users generating questions simultaneously without failure.  
   - This reliability under load is an important NFR (performance and capacity).

5. **Reliability/Availability**  
   - Target high availability (e.g. 99% uptime).  
   - The service should handle expected loads without crashing.  
   - Regular backups of the database are required to prevent data loss.  
   - Error handling should prevent data corruption.  
   - Reliable storage of teacher-generated content is critical to trust.

6. **Maintainability**  
   - The codebase should be well-documented and modular so that developers can update the AI model, add new question types, or integrate additional curriculum topics as needed.  
   - Configuration (e.g. curriculum data, pricing tiers) should be externalized so business users can update plans or topics without code changes.

7. **Localization/Language**  
   - The system will operate in **English only**. All UI text, prompts, and generated questions will be in English. (Future versions might add local languages, but initial release is English.)

8. **Legal/Compliance**  
   - The system must respect GES/NaCCA guidelines for education content.  
   - Any copyrighted reference material must only be used under fair use.  
   - Payment processing must follow financial regulations.

These non-functional requirements ensure the system is fast, secure, user-friendly, and robust. NFRs define system behaviors such as “performance, security, usability, reliability, and scalability.”

## 5. External Interfaces
The SRS specifies the following external interfaces:

1. **Web Browser (User Interface)**  
   - Teachers interact via standard web browsers (Chrome, Firefox, Edge).  
   - The UI will include forms and file-upload components for all features.  
   - It must support screen sizes typical of laptops and desktops.  
   - All interactions (login, upload, etc.) happen over HTTP(S).

2. **AI Generation Service (API)**  
   - The system will call a Generative AI API (for example, an LLM endpoint).  
   - The backend sends a request containing the reference document text, selected topic metadata, and question settings.  
   - The AI returns a list of questions and answers.  
   - This interface must use a secure API (e.g. REST over HTTPS with authentication).  
   - Example: call to OpenAI GPT-4 or a custom LLM.  
   - This corresponds to the “AI question generator” described in the literature.

3. **Document Processing Library**  
   - Internally, the backend will use a library or service to generate DOCX files.  
   - For example, an open-source library (like Apache POI for Java, DocX for .NET, or python-docx) can programmatically create a Word file from the question data.  
   - The interface here is application-internal.

4. **Payment Gateway API**  
   - If using subscriptions, integrate with a payment processor (e.g. Stripe, PayPal, or local mobile money APIs).  
   - This requires HTTPS requests to the payment provider and handling callbacks/webhooks.  
   - It ensures teachers can enter payment details and the system can verify subscription status.

5. **Email Service**  
   - For account verification and password reset, the system will use an email-sending service (e.g. SendGrid).  
   - This SMTP interface sends emails to users.

6. **Optional External Content**  
   - If needed, the system may integrate external curriculum data or standards by importing files (CSV/JSON) from NaCCA/GES sources to populate the subject/topic lists.  
   - Primarily, the curriculum taxonomy will be stored internally.

These interfaces define how the system connects to the web, AI, and other services. Notably, the AI interface embodies the NLP/ML pipeline: AI tools “use NLP and machine learning algorithms to analyze content and transform it into meaningful assessment questions.”

## 6. Assumptions and Constraints
The following assumptions and constraints apply:

1. **User Environment**  
   - Teachers have periodic internet access and use the platform on desktop or laptop computers (or tablets with web browsers).  
   - We assume basic digital literacy; training will focus only on curriculum-specific steps.

2. **Language Constraint**  
   - The UI and generated content will be **English only**. (This assumes Ghanaian teachers will use English for exam questions.)

3. **Curriculum Data**  
   - It is assumed that a list of subjects, strands, and sub-strands from the GES/NaCCA curriculum is available and loaded into the system.  
   - Teachers will pick from these predefined categories.

4. **Web-Only Platform**  
   - No mobile app or offline desktop version is required initially. The system is *web-only*, accessed via browsers.  
   - Future plans might include a mobile app, but the SRS is limited to web.

5. **Content Quality**  
   - We assume the AI model can generate pedagogically valid questions. The system will provide a way for teachers to edit or reject bad questions.  
   - The AI must *align with curriculum standards*, but ultimate responsibility for correctness lies with the teacher.

6. **Legal Compliance**  
   - The system assumes compliance with Ghanaian data protection laws (e.g. Data Protection Act, 2012) and copyright law (uploaded materials are used only for question generation).

7. **Scale**  
   - Initial user base may be limited to pilot schools. We assume usage will grow, so the design is scalable.

8. **Budget/Pricing**  
   - We assume a freemium model will be used to attract users.  
   - This imposes constraints on what features are free vs paid. The architecture must support feature gating by subscription.

These assumptions and constraints shape the design choices. For example, assuming reliable internet means we do not need offline mode. Assuming English-only simplifies UI localization. Acknowledging AI limitations means building a review/edit interface. All constraints have been considered to ensure a clear, feasible blueprint for developers and stakeholders.

**References:** This SRS follows best practices for software requirements and leverages modern AI question-generation concepts. It will guide the team in building a robust, curriculum-aligned assessment tool for Ghanaian teachers.  
