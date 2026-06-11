# Product Requirements Document: Device Refurbishing Management System

A professional web application for managing mobile device and computer refurbishing workflows, enabling technicians to systematically record device intake information, track repair progress, and maintain user profiles.

**Experience Qualities**:
1. **Systematic** - Guide technicians through structured intake and refurbishing processes with clear step-by-step workflows
2. **Professional** - Present a polished, business-ready interface that inspires confidence and efficiency
3. **Efficient** - Minimize data entry time with smart forms and persistent storage

**Complexity Level**: Light Application (multiple features with basic state) - The app provides device tracking and user management with straightforward CRUD operations and status workflows.

## Essential Features

### User Authentication
- **Functionality**: Login and registration system for technician accounts
- **Purpose**: Maintain accountability and track which technician worked on each device
- **Trigger**: Application load (if not authenticated)
- **Progression**: Login screen → Enter credentials → Dashboard (or) Register → Create profile → Dashboard
- **Success criteria**: User data persists, can log out and log back in successfully

### Theme Toggle (Dark Mode)
- **Functionality**: Toggle between light and dark color themes
- **Purpose**: Provide visual comfort in different lighting conditions and user preference
- **Trigger**: Click theme toggle button in header
- **Progression**: Click sun/moon icon → Theme switches instantly → Preference persists across sessions
- **Success criteria**: Theme preference saved to KV storage, all UI elements properly styled in both modes, smooth visual transition

### Device Intake
- **Functionality**: Multi-step form to record new device information (type, brand, model, serial, IMEI, condition, issue description)
- **Purpose**: Systematically capture all relevant device information at intake
- **Trigger**: Click "New Intake" button from dashboard
- **Progression**: Dashboard → New Intake → Fill device details → Submit → Return to dashboard with new device listed
- **Success criteria**: Device data persists, appears on dashboard, can be edited later

### Device Management Dashboard
- **Functionality**: Central view displaying all devices with status, assigned tech, and intake date
- **Purpose**: Central hub for managing refurbishing operations
- **Trigger**: Default view after login
- **Progression**: Login → Dashboard shows device list → Filter by status/tech → Click device → View details
- **Success criteria**: All devices displayed, filtering works, clicking navigates to details

### Device Status Tracking
- **Functionality**: Update and track refurbishing progress through defined stages
- **Purpose**: Monitor where each device is in the refurbishing pipeline
- **Trigger**: Edit device from dashboard
- **Progression**: Device details → Update status dropdown → Select (Intake/Diagnosis/Parts Ordered/In Repair/Testing/Complete/Ready for Sale) → Save → Dashboard reflects new status
- **Success criteria**: Status updates persist, visual indicators show status on dashboard, can filter by status

### User Profile
- **Functionality**: View and manage technician profile information
- **Purpose**: Maintain current user information and preferences
- **Trigger**: Click "Profile" from navigation
- **Progression**: Dashboard → Profile → View user details → Edit if needed → Save
- **Success criteria**: Profile information displays correctly, edits persist

## Edge Case Handling
- **Empty States**: Show helpful messages when no devices exist yet, prompting tech to create first intake
- **Duplicate Devices**: Allow duplicate serial numbers (same device may be repaired multiple times) but flag with warning
- **Missing Information**: Allow partial saves during multi-step intake with validation on final submission
- **Long Serial/IMEI Numbers**: Text inputs accommodate full-length identifiers without truncation
- **Guest Access**: Require login; no guest browsing to ensure accountability
- **Deleted Users**: Preserve device history even if user account is removed, showing "Unknown Tech" for deleted accounts
- **Theme Persistence**: Theme preference loads immediately on app mount to prevent flash of wrong theme

## Design Direction
The design should evoke precision, professionalism, and technical confidence. Think industrial tech workspace meets modern SaaS application - clean lines, high contrast for readability in workshop environments, with purposeful red accents that draw attention to critical actions and status indicators. The interface should feel like a professional tool that respects the technician's expertise while streamlining their workflow.

Dark mode maintains the same professional character with inverted tones - light text on dark backgrounds while preserving the red accent for consistency and brand recognition.

## Color Selection
A bold, high-contrast palette centered on red, black, and white that ensures readability in varied lighting conditions and communicates technical precision.

**Light Mode:**
- **Primary Color**: Pure Black (oklch(0.15 0 0)) - Represents professionalism, precision, and technical authority. Used for primary UI elements and text.
- **Secondary Colors**: 
  - Crisp White (oklch(1 0 0)) - Provides maximum contrast and clean workspace feel
  - Cool Gray (oklch(0.45 0 0)) - Muted elements and secondary text
  - Light Gray (oklch(0.96 0 0)) - Background for cards and sections
- **Accent Color**: Vibrant Red (oklch(0.55 0.22 25)) - Commands attention for CTAs, status warnings, and critical information. Suggests urgency and importance.
- **Status Colors**:
  - Success Green (oklch(0.65 0.18 145)) - Completed devices
  - Warning Amber (oklch(0.75 0.15 75)) - In-progress states
  - Info Blue (oklch(0.55 0.15 250)) - Informational status

**Dark Mode:**
- **Background**: Near Black (oklch(0.15 0 0)) - Deep, professional background
- **Foreground**: Off White (oklch(0.95 0 0)) - High contrast text
- **Card**: Dark Gray (oklch(0.18 0 0)) - Elevated surfaces
- **Accent**: Brighter Red (oklch(0.65 0.22 25)) - Maintains brand identity with increased luminance for dark backgrounds

**Foreground/Background Pairings**:
- **Light Mode**:
  - Accent Red (oklch(0.55 0.22 25)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Light Gray Background (oklch(0.96 0 0)): Black text (oklch(0.15 0 0)) - Ratio 13.5:1 ✓
  - White Background (oklch(1 0 0)): Cool Gray text (oklch(0.45 0 0)) - Ratio 5.1:1 ✓
- **Dark Mode**:
  - Dark Background (oklch(0.15 0 0)): Off White text (oklch(0.95 0 0)) - Ratio 13.2:1 ✓
  - Accent Red (oklch(0.65 0.22 25)): Off White text (oklch(0.95 0 0)) - Ratio 4.6:1 ✓
  - Card (oklch(0.18 0 0)): Off White text (oklch(0.95 0 0)) - Ratio 12.1:1 ✓

## Font Selection
Typography should convey technical precision and modern professionalism with excellent readability in workshop environments.

- **Primary Font**: IBM Plex Sans - A technical yet approachable typeface that bridges industrial and digital aesthetics, offering excellent readability and a contemporary feel
- **Monospace Font**: JetBrains Mono - For serial numbers, IMEI codes, and technical identifiers requiring character-by-character precision

**Typographic Hierarchy**:
- H1 (Page Titles): IBM Plex Sans Bold / 32px / tight letter spacing / leading-tight
- H2 (Section Headers): IBM Plex Sans Semibold / 24px / normal spacing / leading-snug
- H3 (Card Titles): IBM Plex Sans Semibold / 18px / normal spacing / leading-normal
- Body (Primary): IBM Plex Sans Regular / 16px / normal spacing / leading-relaxed
- Body (Secondary): IBM Plex Sans Regular / 14px / normal spacing / leading-relaxed / text-muted-foreground
- Technical (Serial/IMEI): JetBrains Mono Regular / 14px / tracking-tight / leading-normal
- Buttons: IBM Plex Sans Semibold / 15px / tight spacing / leading-none

## Animations
Animations should reinforce the systematic, professional nature of the application while providing clear feedback for technical workflows.

Use purposeful micro-interactions that confirm actions and guide workflow progression. Status changes should animate to reinforce state transitions. Multi-step forms should slide smoothly between steps, creating a sense of forward progress. Keep timing quick and crisp (200-300ms) to match the efficient pace of technical work. Add subtle hover states on interactive elements with color shifts and slight scale transforms. Use loading states for any data operations to reassure users the system is working. Theme transitions should be instant without animation to provide immediate feedback.

## Component Selection

**Components**: 
- **Navigation**: Header component with navigation buttons, theme toggle, and sign out
- **Forms**: Multi-step intake uses Card components with Form, Input, Select, Textarea components; react-hook-form for validation
- **Dashboard**: Table component for device list with sortable columns, status Badge components
- **Device Cards**: Card component with hover effects, showing device image, status badge, tech name, date
- **Status Indicators**: Badge components with variant styling (default/success/warning/destructive)
- **Dialogs**: Dialog component for confirmations, Alert Dialog for destructive actions
- **User Profile**: Avatar component for user images, Card for profile information display
- **Theme Toggle**: Button with icon (Sun/Moon from Phosphor Icons) that shows current theme state
- **Toasts**: Sonner for success/error notifications after form submissions
- **Tabs**: Tabs component for organizing device details (Info/Repairs/Parts/History)

**Customizations**:
- Device status flow visualization component
- Recent activity timeline component for dashboard

**States**:
- Theme Toggle: Sun icon in light mode, Moon icon in dark mode with filled weight for visual clarity
- Inputs: Border highlight on focus (red accent), error state with red border and message, success with green checkmark
- Buttons: Hover state with subtle background change, active state with slight scale
- Cards: Subtle shadow in light mode, border highlight in dark mode, hover state with slight elevation increase and red border accent
- Status badges: Color-coded with dot indicator (green/amber/red/blue), same colors work in both themes

**Icon Selection**:
- Theme: Sun (light mode), Moon (dark mode) with filled weight
- Plus: New device intake, add part
- User/UserCircle: Profile/account
- Wrench: Repairs/refurbishing
- ClockClockwise: Status/progress
- Warning: Issues/alerts
- CaretRight/CaretLeft: Multi-step navigation
- X: Close/cancel
- SignOut: Logout

**Spacing**:
- Page padding: p-6 on desktop, p-4 on mobile
- Card padding: p-6
- Section gaps: gap-6 for major sections, gap-4 for related elements, gap-2 for tightly coupled items
- Form spacing: space-y-4 for form fields, space-y-6 between form sections
- Grid gaps: gap-4 for card grids

**Mobile**:
- Navigation collapses to horizontal scroll on mobile with smaller buttons
- Multi-step form shows single step at a time with progress indicator at top
- Table converts to stacked card layout
- Reduce padding to p-4 globally
- Theme toggle remains accessible in header at all screen sizes
- Sticky header on scroll for navigation context
