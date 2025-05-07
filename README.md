# Event Compass

## 🗺️ Project Info

A web application that allows community members to discover, create, and manage events. Staff users can manage event listings, while regular users can view event details and add to calander.

## 🛠️ How Can I Edit This Code?

You can work on this app locally using any code editor like VS Code.

Make sure you have Node.js and npm installed. We recommend installing Node via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

### Steps to Run Locally:

```sh
# 1. Clone this repository
git clone <YOUR_GIT_URL>

# 2. Navigate into the project folder
cd community-event-compass

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

The app should now be running at `http://localhost:5173`.

## 🧪 Test Users

> These are demo accounts for testing purposes.

**👤 Normal User**

- Email: `amy@example.com`
- Password: `password123`

**👨‍💼 Staff User**

- Email: `steven@example.com`
- Password: `password123`

## 🔧 Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [React Router](https://reactrouter.com/)
- [Google Auth via Supabase](https://supabase.com/docs/guides/auth/social-login/google)

## 🌐 Deployment

This project is deployed on [Netlify](https://event-compass-im.netlify.app/) and supports Google login.

If you're deploying it yourself, make sure to:

- Add your site domain to **Supabase → Auth → Redirect URLs**
- Add the same domain to **Google Developer Console → OAuth → Authorized origins**
- Create a `_redirects` file for SPA routing (`/* /index.html 200`)

## 📁 Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
