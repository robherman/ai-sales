# AI Chat Application

A modern chat application powered by AI that allows users to interact with different AI models through a clean and intuitive interface. The application supports multiple chat sessions, real-time responses, and message history persistence.

## Table of Contents
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Core Components](#core-components)
- [Setup and Installation](#setup-and-installation)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Deployment](#deployment)

## Features
- Multiple AI model support (Claude, GPT, etc.)
- Real-time chat interface
- Message history persistence
- Markdown and code syntax highlighting
- Responsive design
- Session management
- Error handling and retry mechanisms

## Technical Architecture

### Frontend Structure
src/
├── components/ # React components
│ ├── Chat/ # Chat-related components
│ │ ├── ChatInput.tsx
│ │ ├── ChatMessage.tsx
│ │ ├── ChatWindow.tsx
│ │ └── MessageList.tsx
│ ├── Layout/ # Layout components
│ │ ├── Header.tsx
│ │ └── Sidebar.tsx
│ └── shared/ # Shared UI components
├── hooks/ # Custom React hooks
├── services/ # API and service integrations
├── store/ # State management
└── utils/ # Utility functions
```

## Core Components

### Chat Components

#### ChatWindow.tsx
The main container component that orchestrates the chat interface. It manages:
- Message display and scrolling
- Message sending and receiving
- Error handling
- Loading states

#### ChatInput.tsx
Handles user input with features like:
- Message composition
- Send button functionality
- Input validation
- Auto-resize textarea

#### ChatMessage.tsx
Renders individual messages with:
- Markdown parsing
- Code syntax highlighting
- Message metadata display
- Loading states

### Services

#### api.ts
Handles all API communications with:
- AI model endpoints
- Authentication
- Error handling
- Request/response formatting

#### messageStore.ts
Manages message persistence with:
- Local storage integration
- Message history management
- Session handling

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment files:
```bash
cp .env.example .env.local
```

## Environment Configuration

Required environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_AI_MODEL=claude
API_KEY=your_api_key
DATABASE_URL=your_database_url
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Run tests:
```bash
npm test
# or
yarn test
```

Build for production:
```bash
npm run build
# or
yarn build
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t ai-chat-app .
```

2. Run the container:
```bash
docker run -p 3000:3000 ai-chat-app
```

## API Integration

### Message Format
```typescript
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}
```

### API Endpoints

#### Send Message
```typescript
POST /api/chat
Body: {
  message: string;
  modelId: string;
  conversationId?: string;
}
```

#### Get Chat History
```typescript
GET /api/chat/history/{conversationId}
```

## Performance Considerations

The application implements several performance optimizations:
- Message virtualization for large chat histories
- Debounced API calls
- Optimistic UI updates
- Lazy loading of non-critical components

## Security

Security measures implemented:
- API key protection
- XSS prevention
- CSRF protection
- Input sanitization
- Secure headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.