# Employee Dashboard

A modern employee management system with CRUD operations and automated email workflows using n8n.

## Features

- Dashboard with employee statistic
- Employee management (Create, Read, Update, Delete)
- Automated email integration via n8n
- Modern, responsive UI
- Real-time data updates

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Automation**: n8n
- **Styling**: CSS3 with modern design

## Getting Started

### Prerequisites

- Node.js
- npm
- n8n (for email automation)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

4. Set up n8n locally:
   ```bash
   npx n8n
   ```

### Project Structure

```
employee-dashboard/
├── client/          # React frontend
├── server/          # Node.js backend
├── n8n-workflows/   # n8n workflow configurations
└── docs/           # Documentation
```

## Usage

1. **Dashboard**: View employee statistics and overview
2. **Employee Management**: Add, edit, delete employees
3. **Email Integration**: Send automated emails via n8n workflows

## API Endpoints

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/send-email` - Trigger email workflow

## Development

The project uses concurrently to run both frontend and backend in development mode.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT Licens
