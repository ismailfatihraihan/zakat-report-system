# 🌙 Zakat Report System

A web-based zakat management and reporting system built with **React**, **TypeScript**, and **Supabase**. This app simplifies the process of recording and managing various types of Islamic charitable contributions including Zakat Fitrah, Zakat Maal, Fidyah, and Infaq/Sedekah.

![Dashboard Preview](https://github.com/user-attachments/assets/c028ddde-97e5-4b8c-90ea-e999dd1b0c16)
![App Preview](https://github.com/user-attachments/assets/539d1b22-e178-4bab-b7fc-20cc2811a365)

---

## ✨ Features

| Feature | Description |
|---|---|
| Interactive Dashboard | Summary cards and charts for data visualization |
| Multi-type Zakat | Supports Zakat Fitrah, Zakat Maal, Fidyah, and Infaq |
| Full CRUD | Add, edit, view, and delete zakat records |
| Export Reports | Download reports in PDF and CSV format |
| Authentication | Secure login system via Supabase Auth |
| Responsive Design | Optimized for all screen sizes |
| Modern UI | Built with Shadcn/ui components |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Backend:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context API
- **Form Handling:** Custom hooks

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zakat-report-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Open your Supabase Dashboard
   - Run the SQL scripts from the `supabase/migrations/` folder

5. **Start the development server**
   ```bash
   npm run dev
   ```
   App will run at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── dashboard/       # Dashboard components
│   ├── ui/              # Shadcn/ui components
│   ├── zakat-form/      # Form sections
│   ├── zakat-list/      # List components
│   └── zakat-table/     # Table components
├── contexts/            # React Context (Auth)
├── hooks/               # Custom React hooks
├── integrations/        # External integrations (Supabase)
├── lib/                 # Utility libraries
├── pages/               # App pages
├── services/            # Business logic & API calls
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

---

## 🗄️ Database Schema

### `zakat_records` table

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Muzakki name |
| `address` | String | Address |
| `phone` | String | Phone number |
| `zakat_fitrah_amount` | Number | Zakat Fitrah amount |
| `zakat_maal_amount` | Number | Zakat Maal amount |
| `fidyah_amount` | Number | Fidyah amount |
| `infaq_amount` | Number | Infaq amount |
| `total_amount` | Number | Total amount |
| `payment_date` | Date | Payment date |
| `notes` | String | Additional notes |
| `created_at` | Timestamp | Record creation time |
| `updated_at` | Timestamp | Last update time |

---

## 🔒 Security

- Authentication via Supabase Auth
- Row Level Security (RLS) enabled on all tables
- Sensitive credentials stored in environment variables
- Input validation on all forms

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ for better zakat management
