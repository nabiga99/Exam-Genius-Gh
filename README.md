# Exam Genius GH

![Exam Genius GH Logo](public/favicon.ico)

A web-based AI-powered exam question generator for Ghanaian JHS/SHS teachers that helps create curriculum-aligned assessment questions quickly and effectively.

## 🚀 Features

- **AI-Powered Question Generation**: Generate high-quality questions aligned with Ghana Education Service (GES) and NaCCA curriculum
- **Multiple Question Types**: Support for MCQ, True/False, Fill-in-the-Blank, and Short Answer formats
- **Curriculum Alignment**: Select specific subjects, strands, and sub-strands from the official Ghanaian curriculum
- **Document Upload**: Use your own teaching materials as a reference for question generation
- **Edit & Review**: Fine-tune generated questions before exporting
- **Export Options**: Download question sets as Word documents for easy printing and distribution

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn UI (built on Radix UI)
- **State Management**: React Query, React Context
- **Authentication**: Clerk
- **Deployment**: Vercel/Netlify (Recommended)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or bun

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/exam-genius-gh.git
   cd exam-genius-gh
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
exam-genius-gh/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── generate/     # Question generation components
│   │   └── ui/           # UI components (Shadcn)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API services
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
├── .env                  # Environment variables (create this)
└── ...                   # Config files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourgithub)

## 🙏 Acknowledgments

- Ghana Education Service (GES) and NaCCA for curriculum standards
- OpenRouter for AI API access
- All contributors and testers

## 🔒 Authentication Setup

This project uses [Clerk](https://clerk.com/) for authentication. To configure Clerk:

1. Sign up for a Clerk account at [clerk.com](https://clerk.com/)
2. Create a new application in the Clerk Dashboard
3. Get your publishable key from the API Keys section
4. Add it to your `.env` file:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

The publishable key should start with:
- `pk_test_` for development environments
- `pk_live_` for production environments

If a valid Clerk key is not provided, the application will run in development mode with mock authentication. 