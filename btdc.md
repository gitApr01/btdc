# Blood Test Data Collection App

This is a React application for managing blood test data collection, reporting, and user management for a pathology lab.

## Project Overview

- **Purpose**: Manage patient blood test data, payments, report status, and admin commissions.
- **Target Audience**: Pathology technicians, collection agents, and administrators.
- **Current Status**: MVP focusing on Admin Dashboard for User, Test, and Case management.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand (with Persistence)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Key Features Implemented

### Authentication
- **Login Page**: Single login page for all users.
- **Role-Based Redirection**: 
  - Admins -> Admin Dashboard
  - Technicians/Agents -> User Dashboard
- **Session Management**: Persists user session using localStorage via Zustand middleware.
- **Logout**: Secure logout functionality clearing session state.

### Admin Dashboard
- **User Management**:
  - List all users (Admin, Technician, Collection Agent)
  - Add new users (Username, Password, Role, etc.)
  - Edit user details
  - Activate/Suspend users
  - Delete users
- **Test Management**:
  - List all available tests
  - Add new tests with rates
  - Edit test details
  - Activate/Suspend/Delete tests
- **Case Management**:
  - List all cases with search (Name, Mobile, Test) and filters (Date, Payment Status, Report Status)
  - Add new cases with patient details, test selection, and payment info
  - Edit existing cases (Update details, Payment, Delivery Status)
  - Delete cases (Admin only)
  - Auto-calculation of total amounts based on selected tests
  - Track payment status (Paid, Partial, Due) and report status
- **Commission Management**:
  - View case-wise commission details (Total, Paid, Due)
  - Filter commissions by date (Today, Weekly, Monthly, Custom Range)
  - **User Filter**: Filter commission reports by specific users (Technicians/Agents)
  - Summary cards for Total Commission, Paid Commission, and Due Commission
  - **Payment Workflow**: Pay commission for individual cases with partial payment support
  - Auto-update of commission status (Paid, Partial, Unpaid)
- **Analytics Summary**:
  - View total users, active tests, total revenue, and total commission.
  - Filter UI (Date and User filters - visual only in MVP).

### User Dashboard (Technician/Agent)
- **Case Management**:
  - View list of cases
  - Add new cases
  - Edit existing cases (Update details, Payment, Delivery Status)
  - **Restriction**: Cannot delete cases (Admin only feature)
  - Search and Filter capabilities same as Admin

## Architecture & Structure

### Directory Structure
```
src/
  components/
    admin/          # Admin-specific components (UserList, TestList, CaseList, CommissionList, etc.)
    ui/             # Reusable UI components (Button, Card, Modal, Input)
  data/             # Mock data for development
  pages/            # Page components (LoginPage, AdminDashboard, UserDashboard)
  store/            # Zustand store (appStore)
  types/            # TypeScript definitions
```

### Data Model
- **User**: 
  - `id`: string (Unique identifier)
  - `name`: string (Optional, can be empty)
  - `username`: string (Required for login)
  - `password`: string (Required for login)
  - `role`: 'admin' | 'technician' | 'collection_agent'
  - `status`: 'active' | 'suspended'
  - `email`: string (Optional, can be empty)
  - `joinedDate`: string (ISO Date)
- **Test**: 
  - `id`: string
  - `name`: string
  - `rate`: number
  - `status`: 'active' | 'suspended'
- **PatientEntry**: 
  - `id`: string
  - `patientName`: string (Required)
  - `age`: number (Optional, defaults to 0)
  - `sex`: 'male' | 'female' | 'other'
  - `mobileNumber`: string (Optional)
  - `testIds`: string[] (List of selected test IDs)
  - `totalAmount`: number (Optional, auto-calculated or manual)
  - `advanceAmount`: number (Optional)
  - `dueAmount`: number (Calculated)
  - `commissionAmount`: number (Calculated 40%)
  - `commissionPaid`: number
  - `commissionStatus`: 'paid' | 'partial' | 'unpaid'
  - `status`: 'paid' | 'due' | 'partial'
  - `deliveryStatus`: 'delivered' | 'partial' | 'not_delivered'
  - `date`: string (ISO Date)
  - `userId`: string (Creator ID)
  - `collectedByName`: string
  - `testedByName`: string

### State Management
- `useAppStore` in `src/store/appStore.ts` manages the global state for users, tests, and entries.
- **Persistence**: State is persisted to `localStorage` to maintain data across reloads.

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`
- **Preview build**: `npm run preview`

## Future Roadmap

1. **Reports & Analytics**: Implement detailed reporting pages with CSV export.
2. **Backend Integration**: Replace mock data with real backend (Youware Backend).
3. **Secure Auth**: Replace mock auth with real JWT-based authentication.
4. **Mobile Optimization**: Ensure all views are fully responsive for mobile users.
