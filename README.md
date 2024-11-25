# EasyNFC

EasyNFC is a versatile digital identity management application that allows users to create and manage multiple profiles with their contact information and social media links. Users can generate unique URLs for each profile and easily switch between them.

## Features

- **User Authentication**
  - Secure email and password registration
  - JWT-based authentication
  - Protected routes for authenticated users

- **Profile Management**
  - Create up to 5 different profiles
  - Automatic first profile creation during registration
  - Switch between profiles seamlessly
  - Update profile information anytime
  - Generate unique URLs for each profile

- **Profile Information**
  - Basic Details: Name, Phone Number, About
  - Social Media Links: Instagram, LinkedIn, Twitter/X
  - Business Contact: Business Email, WhatsApp
  - Custom Links: Add any additional links with custom titles

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Mobile App**: Flutter
- **Web Interface**: React/Next.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/easynfc.git
cd easynfc
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BASE_URL=your_frontend_base_url
PORT=3000
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Profile Management
- `POST /api/profile/create` - Create new profile
- `PUT /api/profile/update` - Update current profile
- `POST /api/profile/switch` - Switch active profile
- `GET /api/profile/all` - Get all user profiles
- `GET /api/profile/active` - Get active profile
- `GET /api/profile/profile/:profileId` - Get specific profile
- `GET /api/profile/public/:urlSlug` - Get public profile view

## API Usage Examples

### Register New User
```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phoneNo": "+1234567890",
  "about": "Software Developer",
  "links": [
    {
      "platform": "instagram",
      "url": "https://instagram.com/johndoe",
      "isCustom": false
    },
    {
      "platform": "custom",
      "url": "https://johndoe.com",
      "isCustom": true,
      "customTitle": "Portfolio"
    }
  ]
}
```

### Create New Profile
```javascript
POST /api/profile/create
Authorization: Bearer <jwt_token>
{
  "name": "John Smith",
  "phoneNo": "+1987654321",
  "about": "Business Profile",
  "links": [
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/johnsmith",
      "isCustom": false
    }
  ]
}
```

## Data Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required),
  profiles: Array of Profile objects (max 5),
  activeProfile: Number (default: 0)
}
```

### Profile Model
```javascript
{
  name: String (required),
  phoneNo: String,
  about: String,
  links: Array of Link objects,
  urlSlug: String (unique)
}
```

### Link Model
```javascript
{
  platform: String,
  url: String,
  isCustom: Boolean,
  customTitle: String (for custom links)
}
```

## Security Features

- Passwords are hashed using bcrypt
- JWT-based authentication for protected routes
- Unique URL slugs for each profile
- Input validation and sanitization
- MongoDB injection protection

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request


## Authors

- Agneya Kalathil Anoop
- Contributors welcome
