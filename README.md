# Scrum Pointing Poker

A modern, real-time Scrum Pointing Poker application built with React, TypeScript, and Supabase. This tool helps agile teams estimate user stories and tasks efficiently during sprint planning sessions.

## Features

- 🎯 **Real-time Voting**: Live updates as team members submit their estimates
- 👥 **Multi-user Sessions**: Support for multiple team members in a single session
- 🎨 **Modern UI**: Clean, responsive design built with Tailwind CSS and shadcn/ui
- 📊 **Visual Results**: Clear display of voting results and statistics
- 🔄 **Session Management**: Create, join, and manage estimation sessions
- 💾 **Persistent Data**: Session history and results stored with Supabase
- 🎨 **Theme Support**: Light and dark mode support
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Package Manager**: Bun
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ or Bun
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scrum-pointing-poker
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/migrations` folder
   - Update your environment variables with your Supabase credentials

## Development

Start the development server:

```bash
# Using Bun
bun dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun build:dev` - Build for development
- `bun preview` - Preview production build
- `bun lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and utilities
├── lib/               # Utility functions and configurations
├── pages/             # Page components and routing
├── types.ts           # TypeScript type definitions
└── main.tsx          # Application entry point

supabase/
└── migrations/        # Database migration files
```

## Key Features Explained

### Real-time Collaboration
The application uses Supabase's real-time features to ensure all participants see updates instantly when votes are cast or revealed.

### Session Management
- Create new estimation sessions
- Join existing sessions with session codes
- Manage participants and their roles
- Control voting rounds and reveal timing

### Voting System
- Support for common estimation scales (Fibonacci, T-shirt sizes, etc.)
- Anonymous voting until reveal
- Clear visual feedback on voting status
- Statistical analysis of results

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Configuration

### Vite Configuration
The project uses a custom Vite configuration with:
- React SWC plugin for fast compilation
- Path aliases (`@/` maps to `src/`)
- Development server on port 8080
- Component tagging for development

### Tailwind CSS
Tailwind is configured with:
- Custom color schemes
- Animation utilities
- Typography plugin
- Responsive design utilities

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Deployment

1. **Build the application**
   ```bash
   bun build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Environment Variables**
   Make sure to set your environment variables in your deployment platform.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for agile teams everywhere.
