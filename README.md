
## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/flight-booking-app.git
cd flight-booking-app
```

### 2. Install Dependencies

```bash
npm install
```

*Or if you prefer yarn:*
```bash
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and configure your environment variables:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Add other necessary environment variables
```

### 4. Install Additional UI Components

If you encounter missing component errors, install the required shadcn/ui components:

```bash
npx shadcn@latest add button input card badge select toast progress
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**

## Project Structure

```
flight-booking-app/
├── app/                      # Next.js App Router
│   ├── booking/             # Booking pages
│   ├── login/               # Authentication pages
│   ├── register/            # Registration pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── flight-card.tsx      # Flight display component
│   └── search-filters.tsx   # Search filtering component
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication logic
│   └── utils.ts             # Helper functions
├── hooks/                   # Custom React hooks
│   └── use-toast.ts         # Toast notification hook
├── public/                  # Static assets
├── styles/                  # Global styles
└── package.json             # Dependencies and scripts
```


