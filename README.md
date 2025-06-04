# Exam Genius Ghana

![Exam Genius Ghana Logo](public/logo.png)

## Overview

Exam Genius is an AI-powered educational tool designed to help Ghanaian teachers generate customized exam questions based on the Ghana Standard-Based Curriculum. The application simplifies the assessment creation process by allowing educators to quickly create high-quality, curriculum-aligned questions from approved teacher manuals.

## Features

- **Curriculum-Aligned Question Generation**: Create questions that perfectly match the Ghana Standard-Based Curriculum.
- **Multiple Question Types**: Generate Multiple Choice, True/False, Fill-in-the-Blank, and Short Answer questions.
- **Subject Coverage**: 
  - Physics
  - Chemistry
  - Biology
  - Computing
  - General Science
- **Document Export**: Export questions to Word (DOC) format for easy printing and distribution.
- **Question Management**: Edit, customize, and organize generated questions.
- **User Authentication**: Secure user accounts for saving and accessing question sets.

## Screenshots

![Question Generation Interface](public/screenshot-generation.png)
![Question Review Interface](public/screenshot-review.png)

## Technology Stack

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui components

- **AI Integration**:
  - OpenRouter API
  - GPT models for question generation

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Exam-Genius-GH.git
   cd Exam-Genius-GH
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with bun
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or with bun
   bun dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
Exam-Genius-GH/
├── public/               # Static assets
│   └── manuals/          # Teacher manuals in PDF format
├── src/
│   ├── components/       # React components
│   │   ├── generate/     # Question generation components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Usage

1. **Sign in** to your account
2. **Select curriculum details**:
   - Class level (SHS - Senior High School)
   - Class (SHS1, SHS2, SHS3)
   - Subject (Physics, Chemistry, Biology, Computing, etc.)
   - Strand and Sub-strand
   - Learning indicators
3. **Choose a teacher manual** from the available options
4. **Configure** the number and types of questions to generate
5. **Generate** your questions
6. **Review and edit** the generated questions as needed
7. **Export** to Word document for use in your classroom

## Contributing

We welcome contributions to improve Exam Genius! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ghana Education Service for curriculum guidance
- OpenRouter for AI API services
- All the dedicated Ghanaian teachers who provided feedback and testing

## Contact

For questions or support, please contact the project maintainers at:
- Email: support@examgenius.gh
- Twitter: [@ExamGeniusGH](https://twitter.com/ExamGeniusGH)

---

Developed with ❤️ for Ghanaian educators
