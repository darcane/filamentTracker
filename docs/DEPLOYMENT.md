# 🚀 Production Deployment Guide

## Prerequisites

- Node.js 18+ on your server
- Domain name with SSL certificate
- Resend account with verified domain
- Database backup strategy

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Configure domain for cookies
- [ ] Set up email domain verification
- [ ] Configure rate limiting for production
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Test authentication flow
- [ ] Test email delivery
- [ ] Test multi-user functionality

## Environment Variables

### Production Configuration

```env
# Production settings
NODE_ENV=production
APP_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com

# Strong secrets (generate new ones)
JWT_SECRET=your-very-strong-production-secret
RESEND_API_KEY=re_your_production_api_key
FROM_EMAIL=noreply@yourdomain.com

# Production rate limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
```

### Security Considerations

1. **JWT Secrets**: Use cryptographically strong secrets (32+ characters)
2. **HTTPS**: Always use SSL certificates in production
3. **CORS**: Configure proper origins for your domain
4. **Rate Limiting**: Adjust limits based on expected traffic
5. **Database**: Regular backups and monitoring

## Deployment Platforms

### Vercel (Recommended for Frontend)

1. **Connect Repository**: Link your GitHub repository
2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Environment Variables**: Add all required variables
4. **Domain**: Configure custom domain with SSL

### Railway (Recommended for Backend)

1. **Connect Repository**: Link your GitHub repository
2. **Environment Variables**: Add all required variables
3. **Database**: Use Railway's PostgreSQL or external SQLite
4. **Domain**: Configure custom domain with SSL

### DigitalOcean App Platform

1. **Create App**: Connect your repository
2. **Configure Services**: Separate frontend and backend services
3. **Environment Variables**: Add all required variables
4. **Database**: Use managed database service
5. **Domain**: Configure custom domain with SSL

### Self-Hosted (VPS)

1. **Server Setup**: Ubuntu 20.04+ recommended
2. **Node.js**: Install Node.js 18+ using NodeSource
3. **Nginx**: Configure reverse proxy and SSL
4. **PM2**: Process management for Node.js
5. **SSL**: Let's Encrypt certificates
6. **Database**: SQLite with regular backups

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'filamentory-backend',
      script: 'dist/server.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

## Database Backups

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_PATH="/path/to/filaments.db"

# Create backup
cp "$DB_PATH" "$BACKUP_DIR/filaments_$DATE.db"

# Keep only last 30 days
find "$BACKUP_DIR" -name "filaments_*.db" -mtime +30 -delete

echo "Backup completed: filaments_$DATE.db"
```

### Cron Job

```bash
# Run backup daily at 2 AM
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Health Checks

- **Backend**: `GET /health`
- **Database**: Check SQLite file accessibility
- **Email Service**: Test Resend API connectivity

### Logging

- **Application Logs**: PM2 handles log rotation
- **Error Tracking**: Consider Sentry for error monitoring
- **Performance**: Monitor response times and memory usage

## Cost Estimation

**Monthly costs for a small deployment:**
- **Resend**: $20/month (50,000 emails)
- **VPS/Server**: $5-20/month
- **Domain**: $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$25-40/month

## Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement Redis for session storage
- Use managed database service

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor and optimize database queries

## Security Hardening

1. **Firewall**: Configure UFW or iptables
2. **Updates**: Regular system and dependency updates
3. **Monitoring**: Set up intrusion detection
4. **Backups**: Encrypted off-site backups
5. **Access**: SSH key authentication only

## Troubleshooting

### Common Issues

1. **SSL Certificate**: Ensure proper domain verification
2. **CORS Errors**: Check frontend URL configuration
3. **Email Delivery**: Verify Resend domain setup
4. **Database Permissions**: Ensure proper file permissions
5. **Memory Issues**: Monitor PM2 memory usage

### Performance Issues

1. **Slow Queries**: Optimize database indexes
2. **High Memory**: Implement connection pooling
3. **Slow Response**: Enable compression and caching
4. **Rate Limiting**: Adjust limits based on usage patterns
