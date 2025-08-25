# User Management Frontend

A Next.js frontend application for managing users with CRUD operations and email notifications.

## Features

- **User Management**: Create, read, update, and delete users
- **Email Integration**: Automatically sends welcome emails when users are created
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions
- **Form Validation**: Client-side validation using Zod and React Hook Form

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

## Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
CRUD_API_URL=http://localhost:8006
EMAIL_API_URL=http://localhost:8007
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t user-management-frontend .

# Run container
docker run -p 3000:3000 \
  -e CRUD_API_URL=http://localhost:8006 \
  -e EMAIL_API_URL=http://localhost:8007 \
  user-management-frontend
```

## API Integration

The frontend integrates with two microservices:

### CRUD API (Port 8006)
- `GET /users` - List all users
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Email API (Port 8007)
- `POST /send-email` - Send welcome email
- `GET /task-status/{task_id}` - Check email status

## Usage

1. **View Users**: The main page displays all users in a table
2. **Add User**: Click "Add User" button to create a new user
3. **Edit User**: Click the edit icon next to any user
4. **Delete User**: Click the delete icon and confirm
5. **Email Notifications**: Welcome emails are automatically sent when creating users

## Project Structure

```
src/
├── app/
│   └── page.tsx          # Main user management page
├── components/
│   ├── UserForm.tsx      # User creation/editing form
│   └── UserList.tsx      # User table display
└── lib/
    ├── api.ts            # API client functions
    └── validations.ts    # Zod schemas
```
