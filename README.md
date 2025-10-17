# 🖨️ Filamentory

**Your 3D Printer Filament Tracker**

A modern, multi-user web application for tracking 3D printer filament inventory with passwordless authentication, notes management, and beautiful responsive design.

![Filamentory Logo](https://via.placeholder.com/200x80/1976d2/ffffff?text=Filamentory)

## ✨ Features

### 📦 Filament Management
- **Complete Inventory**: Track brand, type, color, amount, and cost
- **Multi-Currency Support**: SEK, EUR, USD with automatic conversion
- **Usage Tracking**: Reduce filament amounts after prints
- **Analytics**: View statistics, total value, and brand distribution
- **User-Specific**: Each user has their own private filament inventory

### 📝 Notes & Helpers
- **Personal Notes**: Store spool weights, print settings, and tips
- **Categories**: Organize notes by type (Spool Weights, Print Settings, Maintenance, etc.)
- **Rich Content**: Full-text notes with markdown support
- **User-Specific**: Notes are private to each user

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Material-UI components with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Passwordless Authentication**: No passwords to remember - just email and magic links
- **Dual Login Options**: Magic link OR 6-digit code with visual timer
- **Cookie Consent**: GDPR-compliant cookie management with granular preferences

### 🔐 Authentication & Security
- **Passwordless Login**: Magic link authentication with 6-digit code fallback
- **Token Management**: Automatic token invalidation and refresh
- **Rate Limiting**: Protection against abuse and spam attacks
- **Secure Sessions**: HttpOnly cookies with automatic refresh
- **Multi-User Support**: Complete data isolation between users
- **GDPR Compliance**: Cookie consent management with granular controls

### 🔗 Integrations
- **Home Assistant**: API endpoint for reducing filament amounts from Home Assistant
- **Email Service**: Resend integration for reliable magic link delivery
- **API Documentation**: Interactive Swagger UI for all endpoints

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI + React Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with multi-user support
- **Authentication**: JWT + Magic Links + Resend Email Service
- **Security**: Rate limiting, CORS, HttpOnly cookies
- **Development**: Hot reload, TypeScript, ESLint, Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Resend account for email service

### Installation
1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/filamentory.git
   cd filamentory
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment**
   ```bash
   # Create backend/.env with your Resend API key
   cp backend/.env.example backend/.env
   # Edit the file with your settings
   ```

3. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

The frontend will run on `http://localhost:3000`

> 📖 **Need detailed setup instructions?** See [Installation Guide](docs/INSTALLATION.md)

## 📚 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup and configuration
- **[Authentication Guide](docs/AUTHENTICATION.md)** - Passwordless login system
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Data Models](docs/DATA_MODELS.md)** - Database schema and types
- **[Development Guide](docs/DEVELOPMENT.md)** - Contributing and development
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Home Assistant Integration](docs/HOME_ASSISTANT.md)** - Automation setup

## 🏷️ Supported Brands & Types

**Popular Brands**: Bambu Lab, SUNLU, Creality, eSun, Polymaker, Prusa, Hatchbox, Overture, MatterHackers, and many more...

**Filament Types**: PLA, PETG, ABS, TPU, ASA, PC, Nylon, Wood-filled, Carbon Fiber-filled, Glass Fiber-filled, Metal-filled, Glow-in-the-dark, Silk, Matte, Transparent

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Request magic link login
- `GET /api/auth/verify?token=xxx` - Verify magic link token
- `POST /api/auth/verify-code` - Verify 6-digit code manually

### Filaments (Protected)
- `GET /api/filaments` - Get all filaments for authenticated user
- `POST /api/filaments` - Create new filament
- `PUT /api/filaments/:id` - Update filament
- `DELETE /api/filaments/:id` - Delete filament
- `PATCH /api/filaments/:id/reduce` - Reduce filament amount

### Notes (Protected)
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

> 📖 **Complete API reference**: [API Documentation](docs/API.md)

## 🚀 Production Deployment

### Quick Deploy
- **Frontend**: Deploy to Vercel, Netlify, or similar
- **Backend**: Deploy to Railway, DigitalOcean, or VPS
- **Database**: SQLite with regular backups

### Cost Estimation
- **Resend**: $20/month (50,000 emails)
- **Hosting**: $5-20/month
- **Domain**: $10-15/year
- **Total**: ~$25-40/month

> 📖 **Detailed deployment guide**: [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

> 📖 **Development guidelines**: [Development Guide](docs/DEVELOPMENT.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Resend** for reliable email delivery
- **React** and **Node.js** communities for excellent documentation
- **3D Printing Community** for inspiration and feedback

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/filamentory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/filamentory/discussions)
- **Email**: support@filamentory.com

---

**Happy Printing! 🖨️**

Made with ❤️ for the 3D printing community