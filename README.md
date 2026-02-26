# HireWithAndi - Job Tracker

A comprehensive and visually appealing job application tracking system designed to help you organize, manage, and analyze your job search journey.

## Features

- **Kanban Board Interface**: Drag and drop job applications across customizable stages (Wishlist, Applied, HR Interview, Technical Interview, Additional Interview, Offered, Rejected).
- **Detailed Job Records**: Store extensive information including company, position, salary, location, work type (Remote/On-site/Hybrid), and custom notes.
- **Offer Management**: Special fields for recording final offer details, benefits, and non-monetary perks when an application reaches the 'Offered' stage.
- **Timeline & Analytics Dashboard**:
  - Visualize application history through a functional Gantt chart.
  - Track key metrics like days since the first application, last interview, and last rejection.
  - Monitor the status of your latest job application.
- **Bilingual Support (i18n)**: Seamlessly toggle between English and Bahasa Indonesia.
- **Mobile Responsive Design**: Fully polished mobile experience with adjusted spacing, hidden tooltips, and optimized layouts.
- **Local Storage**: Data is safely stored in your browser's local storage for privacy and speed.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd job-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at the URL provided in your terminal (typically `http://localhost:5173`).

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Technologies Used

- React 19
- Vite
- Tailwind CSS 4
- @hello-pangea/dnd (for drag and drop)
- Lucide React (for icons)
