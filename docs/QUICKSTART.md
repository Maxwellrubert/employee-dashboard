# Quick Start Guide

Get your Employee Dashboard running in minutes!

## Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- Git (optional)

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd employee-dashboard
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API server on http://localhost:5000
   - React frontend on http://localhost:3000

4. **Set up n8n for email functionality**
   ```bash
   # In a new terminal
   npx n8n
   ```
   
   - Open http://localhost:5678
   - Import the workflow from `n8n-workflows/employee-email-workflow.json`
   - Configure your email service (SMTP/SendGrid/Mailgun)

## Using the Dashboard

### Dashboard View (/)
- View employee statistics
- See department breakdown
- Monitor recent hires and trends

### Employee Management (/employees)
- **Add Employee**: Click "Add Employee" button
- **Edit Employee**: Click edit icon in table row
- **Delete Employee**: Click delete icon (with confirmation)
- **Send Email**: Click email icon to trigger n8n workflow

### Sample Data
The system starts with 3 sample employees. You can:
- Edit their information
- Delete them
- Add new employees
- Send test emails

## Testing Email Integration

1. **Ensure n8n is running**: http://localhost:5678
2. **Import the workflow**: Copy content from `n8n-workflows/employee-email-workflow.json`
3. **Configure email service** in n8n (SMTP recommended for testing)
4. **Test from dashboard**: Click email button for any employee

## Troubleshooting

### Common Issues

**Backend not starting?**
- Check if port 5000 is available
- Run `cd server && npm install` if dependencies missing

**Frontend not loading?**
- Check if port 3000 is available
- Run `cd client && npm install` if dependencies missing

**Email not working?**
- Ensure n8n is running on port 5678
- Check n8n workflow is activated
- Verify email service configuration in n8n

**CORS errors?**
- Frontend is configured to proxy API requests
- Ensure backend is running on port 5000

### Getting Help

1. Check the console for error messages
2. Verify all services are running
3. Check network tab for API call failures
4. Review n8n execution logs for email issues

## Next Steps

- Customize email templates in n8n workflow
- Add authentication (Auth0, Firebase, etc.)
- Deploy to production (Vercel + Render + n8n Cloud)
- Add more features (file uploads, reporting, etc.)

## File Structure

```
employee-dashboard/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── services/   # API service
├── server/             # Node.js backend
│   ├── data/          # JSON data storage
│   └── index.js       # Main server file
├── n8n-workflows/     # n8n workflow configs
└── docs/             # Documentation
```

Happy coding! 🚀
