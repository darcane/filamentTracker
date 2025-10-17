# 🔧 Development Guide

## Project Structure

```
filamentory/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth, Cookie Consent)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── scripts/         # Migration and utility scripts
│   │   └── types/           # TypeScript type definitions
│   └── data/                # SQLite database and backups
└── docs/                    # Documentation
```

## Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## Environment Variables

### Backend (.env)
```env
# Email Service
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
APP_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Cookie Configuration
COOKIE_DOMAIN=localhost
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## Database Schema

The application uses SQLite with the following tables:

- **users**: User accounts and authentication
- **filaments**: Filament inventory (user-specific)
- **notes**: User notes and tips (user-specific)
- **magic_tokens**: Magic link tokens for authentication
- **sessions**: User sessions and refresh tokens
- **cookie_consents**: GDPR cookie consent preferences

## Authentication Flow

1. **Login Request**: User enters email → system generates magic token
2. **Email Sent**: Magic link + 6-digit code sent via Resend
3. **Token Verification**: User clicks link OR enters code
4. **Session Creation**: JWT tokens created and stored in HttpOnly cookies
5. **Data Access**: User can access their private data

## Multi-User Architecture

- **Data Isolation**: All data is filtered by `user_id`
- **Authentication**: JWT-based with automatic refresh
- **Session Management**: Secure cookie-based sessions
- **Rate Limiting**: Per-user rate limiting for security

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use Material-UI components consistently
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style
- Ensure mobile responsiveness

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test thoroughly
4. Update documentation if needed
5. Create pull request
6. Code review and merge

### Testing
- Write unit tests for business logic
- Test API endpoints with proper authentication
- Test authentication flow end-to-end
- Test multi-user data isolation
- Test mobile responsiveness

## Adding New Features

### Backend
1. **Create Types**: Add TypeScript interfaces in `src/types/`
2. **Database**: Add new tables/methods in `src/services/database.ts`
3. **Business Logic**: Implement in `src/services/`
4. **Routes**: Add endpoints in `src/routes/`
5. **Middleware**: Add authentication/validation in `src/middleware/`

### Frontend
1. **Components**: Create reusable components in `src/components/`
2. **Contexts**: Add state management in `src/contexts/`
3. **Hooks**: Create custom hooks in `src/hooks/`
4. **Services**: Add API calls in `src/services/`
5. **Types**: Add TypeScript interfaces in `src/types/`

## Debugging

### Backend Debugging
- Use `console.log` for debugging (remove in production)
- Check server logs in terminal
- Use Postman/Insomnia for API testing
- Check database with SQLite browser

### Frontend Debugging
- Use React Developer Tools
- Check browser console for errors
- Use Network tab for API calls
- Test with different screen sizes

### Common Issues
1. **CORS Errors**: Check backend CORS configuration
2. **Authentication**: Verify JWT tokens and cookies
3. **Database**: Check file permissions and paths
4. **Email**: Verify Resend API key and configuration

## Performance Optimization

### Backend
- Use database indexes for frequently queried fields
- Implement connection pooling
- Add caching for expensive operations
- Monitor memory usage and optimize queries

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with code splitting
- Use proper image optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Update documentation if needed
- Ensure all tests pass
- Request review from maintainers

## Resources

- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
