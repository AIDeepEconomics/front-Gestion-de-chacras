# Portal de Trazabilidad de Arroz

## Overview

A rice traceability portal designed for rural producers to manage their agricultural operations. The system provides comprehensive tracking of rice farms (chacras), field events, and mill relationships through a professional dashboard interface. The application enables producers to register their rural establishments, manage field plots, track agricultural events (fertilization, planting, harvest), and coordinate with associated mills for rice processing and distribution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following Material Design principles
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: Hot module replacement via Vite middleware in development
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless provider
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple

### Database Schema Design
The system models agricultural operations through interconnected entities:
- **Users**: Authentication and authorization
- **Mills**: Rice processing facilities with permission-based data sharing
- **Establishments**: Rural properties containing multiple fields
- **Chacras**: Individual field plots with area, regime, and ownership details
- **Zafras**: Agricultural seasons defining crop cycles (6-month periods)
- **Events**: Time-stamped agricultural activities (planting, fertilization, harvest, etc.)

### Component Architecture
- **Modular Design**: Self-contained components with clear interfaces
- **Design System**: Consistent spacing, typography, and color schemes
- **Responsive Layout**: Mobile-first design with adaptive interfaces
- **Accessibility**: ARIA compliance through Radix UI primitives

### Key Features Implementation
- **Mill Management**: Dynamic addition/removal of associated mills with granular permission controls
- **Field Management**: Interactive maps (mockup), tabular data with sorting and filtering
- **Event Timeline**: Visual timeline representation with zafra-based organization
- **Data Sharing**: Configurable sharing of field management, harvest data, and traceability information with mills

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Platform**: Development environment with integrated deployment

### UI and Styling
- **Google Fonts**: Inter font family for consistent typography
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Consistent icon library

### Development and Build Tools
- **Vite**: Fast development server with HMR and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Data and Validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities
- **TanStack Query**: Server state management with caching and synchronization

### Development Quality
- **Replit Cartographer**: Development environment integration
- **Runtime Error Overlay**: Enhanced error reporting in development