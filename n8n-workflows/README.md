# n8n Email Workflow Configuration

This directory contains the n8n workflow for handling email automation in the Employee Dashboard.

## Setup Instructions

### 1. Install n8n

```bash
# Install n8n globally
npm install n8n -g

# Or run with npx
npx n8n
```

### 2. Start n8n

```bash
# Start n8n (opens at http://localhost:5678)
n8n start

# Or with npx
npx n8n
```

### 3. Import Workflow

1. Open n8n at http://localhost:5678
2. Click "New Workflow" or "Import Workflow"
3. Copy the content from `employee-email-workflow.json`
4. Paste it into n8n
5. Configure your email service credentials

### 4. Configure Email Service

The workflow supports multiple email services:

#### Option A: SMTP (Recommended for Development)
- Node: SMTP Email
- Settings: Configure your SMTP server details
- Example: Gmail, Outlook, or local mail server

#### Option B: SendGrid
- Node: SendGrid
- API Key: Get from SendGrid dashboard
- From Email: Verified sender email

#### Option C: Mailgun
- Node: Mailgun
- API Key: Get from Mailgun dashboard
- Domain: Your Mailgun domain

### 5. Webhook Configuration

The workflow webhook URL should be: `https://maxwell-rubert.app.n8n.cloud/webhook-test/send-email`

Update your backend environment variable:
```bash
N8N_WEBHOOK_URL=https://maxwell-rubert.app.n8n.cloud/webhook-test/send-email
```

## Workflow Features

- **Webhook Trigger**: Receives employee data from the frontend
- **Email Processing**: Formats email content based on employee info
- **Multiple Templates**: Supports different email types
- **Error Handling**: Graceful error handling and logging
- **Response**: Returns success/failure status to frontend

## Email Types Supported

1. **General**: Basic communication email
2. **Welcome**: New employee welcome email
3. **Reminder**: Task or meeting reminders
4. **Custom**: Custom message from form

## Customization

### Email Templates

Edit the "Set Email Content" node to customize email templates:

```javascript
// Welcome Email Template
const welcomeTemplate = `
Hello {{$json.employee.name}},

Welcome to our team! We're excited to have you join us as {{$json.employee.position}} in the {{$json.employee.department}} department.

Your first day is coming up, and we want to make sure you're prepared. Here are a few things to know:

- Your start date: [Date]
- Your manager: [Manager Name]
- Location: [Office/Remote]

If you have any questions before your start date, please don't hesitate to reach out.

Best regards,
HR Team
`;

// Set email content based on type
if ($json.emailType === 'welcome') {
    return {
        subject: `Welcome to the team, ${$json.employee.name}!`,
        content: welcomeTemplate,
        to: $json.employee.email
    };
}
```

### Adding New Email Types

1. Update the "Set Email Content" node
2. Add new template logic
3. Update frontend to support new type

## Testing

### Test from Dashboard
1. Go to Employee Management
2. Click the email button for any employee
3. Check n8n execution log
4. Verify email delivery

### Test Direct Webhook
```bash
curl -X POST http://localhost:5678/webhook/employee-email \
  -H "Content-Type: application/json" \
  -d '{
    "employee": {
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Developer",
      "department": "Engineering"
    },
    "emailType": "general",
    "customMessage": "Test message"
  }'
```

## Troubleshooting

### Common Issues

1. **Webhook not found**
   - Ensure n8n is running
   - Check webhook URL in backend
   - Verify workflow is activated

2. **Email not sending**
   - Check email service credentials
   - Verify sender email is authorized
   - Check n8n execution logs

3. **CORS errors**
   - n8n runs on different port
   - Backend handles the webhook call
   - Frontend doesn't directly call n8n

### Logs

Check n8n execution logs:
1. Go to n8n dashboard
2. Click "Executions"
3. View detailed logs for each run

## Production Deployment

### n8n Cloud
- Sign up at n8n.cloud
- Import workflow
- Update webhook URL in backend

### Self-hosted
- Deploy n8n on your server
- Use environment variables for credentials
- Set up SSL/HTTPS
- Configure proper authentication

### Environment Variables

```bash
# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/employee-email

# Email Service (choose one)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Or SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Or Mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```
