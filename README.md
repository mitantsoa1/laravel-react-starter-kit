# Laravel React Starter Kit

A modern starter kit combining Laravel 12 with React, TypeScript, and several powerful tools for rapid application development.

## Features

### Authentication & Authorization

- Full authentication system using Laravel Breeze
- Role-based access control (ROLE_ADMIN, etc.)
- Protected routes with middleware
- User management (CRUD operations)

### Frontend

- **React 18** with TypeScript
- **Inertia.js** for seamless SPA-like experience
- **Tailwind CSS** for styling
- **Shadcn/ui** components library
- **React Hook Form** with Zod validation
- **Lucide React** for icons
- Responsive layout with mobile support
- Toast notifications
- SweetAlert2 for confirmations

### Backend

- **Laravel 12** framework
- MySQL database
- RESTful API architecture
- Form request validation
- Eloquent ORM with relationships
- Database migrations and seeders

### Developer Experience

- TypeScript for better type safety
- Hot module replacement
- ESLint & Prettier configuration
- Organized folder structure

## Project Structure

```
laravel-react-starter-kit/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   └── Models/
├── resources/
│   └── js/
│       ├── components/
│       │   └── ui/
│       ├── layouts/
│       ├── lib/
│       ├── pages/
│       └── types/
└── routes/
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/laravel-react-starter-kit.git
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install Node dependencies:

```bash
npm install
```

4. Configure environment:

```bash
cp .env.example .env
php artisan key:generate
```

5. Set up database:

```bash
php artisan migrate --seed
```

6. Start development servers:

```bash
php artisan serve
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `php artisan test`: Run tests
- `php artisan migrate:fresh --seed`: Reset database with fresh data

## Key Components

### DataTable

- Sortable columns
- Custom cell rendering
- Responsive design
- Action buttons with permissions

### Form Components

- Form validation with Zod
- Error handling
- Backend validation integration
- File upload support

### Authentication

- Login/Register pages
- Password reset
- Remember me functionality
- Session management

### User Management

- User listing with roles
- Create/Edit/Delete users
- Role assignment
- Permission checks

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Requirements

- PHP 8.2+
- Node.js 16+
- MySQL 8.0+
- Composer
- npm

This starter kit provides a solid foundation for building modern web applications with Laravel and React. Feel free to customize it according to your needs!
