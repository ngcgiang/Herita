# Herita Platform Demo - UI/UX Wireframes & Layout

This document describes the user interface design and layout structure for the Herita Platform demo website.

## 🎨 Overall Design Philosophy

- **Clean & Professional**: Business-focused design suitable for corporate users
- **Progressive Disclosure**: Show relevant information at each step
- **Web3 Native**: Seamless integration with wallet connection and blockchain interactions
- **Responsive**: Works on desktop, tablet, and mobile devices

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                           │
│  🏛️ Herita Platform [Demo]              [Connect Wallet]   │
└─────────────────────────────────────────────────────────────┘
│                                                             │
│                      HERO SECTION                          │
│         ESG Blockchain for Cultural Heritage               │
│    Increase your company's ESG score by sponsoring         │
│         cultural heritage projects...                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   USE CASE GRID (3x2)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │🏢 UC01      │ │📊 UC02      │ │🤖 UC03      │          │
│  │Register     │ │Evaluate &   │ │AI Project   │          │
│  │Business     │ │Score        │ │Suggestions  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │💰 UC04      │ │🎖️ UC05      │ │🔍 UC06      │          │
│  │Sponsor      │ │Mint ESG NFT │ │Verify NFT   │          │
│  │Project      │ │             │ │             │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                   MAIN CONTENT AREA                        │
│                 (Dynamic Use Case Content)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
│                        FOOTER                              │
│            Demo Environment Information                     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Use Case Layouts

### UC01: Business Registration

```
┌─────────────────────────────────────────────────┐
│ 🏢 UC01: Business Registration                 │
├─────────────────┬───────────────────────────────┤
│ REGISTRATION    │ BENEFITS & INFO               │
│ FORM            │                               │
│                 │ ✅ Access to marketplace      │
│ • Business Name │ ✅ ESG score tracking         │
│ • Business ID   │ ✅ Blockchain certificates    │
│ • Industry      │ ✅ AI recommendations         │
│ • Company Size  │ ✅ Impact reporting           │
│ • Wallet Address│                               │
│                 │ [SUCCESS MESSAGE AREA]        │
│ [Register]      │                               │
└─────────────────┴───────────────────────────────┘
```

### UC02: Business Evaluation & Scoring

```
┌─────────────────────────────────────────────────┐
│ 📊 UC02: Business Evaluation & HeritaScore     │
├─────────────────┬───────────────────────────────┤
│ FINANCIAL DATA  │ HERITA SCORE DISPLAY          │
│                 │                               │
│ • Annual Revenue│    ┌─────────────────┐        │
│ • ESG Programs  │    │      [85]       │        │
│ • Sustainability│    │   HeritaScore   │        │
│   Budget %      │    └─────────────────┘        │
│ • Heritage      │                               │
│   Interest      │ SCORE BREAKDOWN:              │
│                 │ 💰 Financial: Strong          │
│ [Calculate]     │ 📊 Programs: Moderate         │
│                 │ 🌱 Budget: 2.5%               │
│                 │ 🏛️ Interest: High             │
│                 │                               │
│                 │ RECOMMENDATIONS:              │
│                 │ "Try medium-scale projects"   │
└─────────────────┴───────────────────────────────┘
```

### UC03: AI Project Suggestions

```
┌─────────────────────────────────────────────────┐
│ 🤖 UC03: AI Co-pilot for Project Suggestions   │
├─────────────────┬───────────────────────────────┤
│ PREFERENCES     │ AI RECOMMENDATIONS            │
│                 │                               │
│ • Budget Range  │ [LOADING: AI analyzing...]    │
│ • Geography     │                               │
│ • Project Types:│ ┌─────────────────────────┐   │
│   ☑ Monuments   │ │ Roman Theatre - Italy   │   │
│   ☑ Museums     │ │ 📍 Italy | $15,000     │   │
│   ☐ Archaeology │ │ 95% Match [Select]      │   │
│   ☐ Traditions  │ └─────────────────────────┘   │
│                 │ ┌─────────────────────────┐   │
│ [Get AI Recs]   │ │ Maya Temple - Guatemala │   │
│                 │ │ 📍 Guatemala | $25,000  │   │
│                 │ │ 87% Match [Select]      │   │
│                 │ └─────────────────────────┘   │
└─────────────────┴───────────────────────────────┘
```

### UC04: Sponsor Heritage Project

```
┌─────────────────────────────────────────────────┐
│ 💰 UC04: Sponsor Heritage Project              │
├─────────────────┬───────────────────────────────┤
│ [SELECTED PROJECT INFO]                         │
│ Roman Theatre Restoration - Italy               │
├─────────────────┬───────────────────────────────┤
│ SPONSORSHIP     │ BENEFITS & IMPACT             │
│ FORM            │                               │
│                 │ 🎖️ ESG NFT Certificate        │
│ • Select Project│ 📊 Improved ESG Score         │
│ • Amount (ETH)  │ 🔗 Blockchain Verification    │
│ • Enterprise ID │ 📱 Public Recognition         │
│                 │ 🏛️ Cultural Support           │
│ [Sponsor]       │                               │
│                 │ [TRANSACTION RESULT]          │
│                 │ ✅ Success! TX: 0x123...      │
└─────────────────┴───────────────────────────────┘
```

### UC05: Mint ESG NFT

```
┌─────────────────────────────────────────────────┐
│ 🎖️ UC05: Mint ESG NFT Certificate              │
├─────────────────┬───────────────────────────────┤
│ NFT PARAMETERS  │ CERTIFICATE PREVIEW           │
│                 │                               │
│ • Recipient     │ ┌─────────────────────────┐   │
│ • Enterprise ID │ │    🎖️ HERITA ESG       │   │
│ • Project ID    │ │    CERTIFICATION        │   │
│ • Amount (Wei)  │ │                         │   │
│ • ESG Score     │ │ Token: ERC-721          │   │
│                 │ │ Network: Lisk Sepolia   │   │
│ [Mint NFT]      │ │ Symbol: HESG            │   │
│                 │ │ Transferable: Yes       │   │
│                 │ └─────────────────────────┘   │
│                 │                               │
│                 │ [MINTING RESULT]              │
│                 │ ✅ NFT #42 Minted!            │
│                 │ • Enterprise: COMP001         │
│                 │ • Project: PROJ001            │
│                 │ • Amount: 0.01 ETH            │
│                 │ • Score: 75/100               │
└─────────────────┴───────────────────────────────┘
```

### UC06: Verify NFT (HeritaBank)

```
┌─────────────────────────────────────────────────┐
│ 🔍 UC06: HeritaBank NFT Verification           │
├─────────────────┬───────────────────────────────┤
│ 🏦 BANK PORTAL  │ VERIFICATION RESULTS          │
│                 │                               │
│ Verify by:      │ [NO RESULTS INITIALLY]        │
│ ○ Enterprise ID │                               │
│ ○ Token ID      │ Enter information and click   │
│ ○ Wallet Address│ "Verify ESG NFT" to see       │
│                 │ results                       │
│ [Input Field]   │                               │
│                 │ ┌─────────────────────────┐   │
│ [Verify NFT]    │ │ ✅ Verification Success │   │
│                 │ │ NFT #42                 │   │
│                 │ │ Enterprise: COMP001     │   │
│                 │ │ Project: PROJ001        │   │
│                 │ │ Amount: 0.01 ETH        │   │
│                 │ │ Score: 75/100           │   │
│                 │ │ Status: ✅ Verified     │   │
│                 │ └─────────────────────────┘   │
│                 │                               │
│                 │ 🏦 Bank Summary:              │
│                 │ Total ESG: 75 points         │
│                 │ Projects: 1 verified          │
└─────────────────┴───────────────────────────────┘
```

## 🎨 Color Scheme

### Primary Colors
- **Blue**: `#3b82f6` (Primary actions, links)
- **Green**: `#10b981` (Success states, ESG scores)
- **Purple**: `#8b5cf6` (AI features, premium content)
- **Orange**: `#f59e0b` (Sponsorship, financial actions)
- **Red**: `#ef4444` (Verification, bank features)

### Neutral Colors
- **Dark Gray**: `#374151` (Primary text)
- **Medium Gray**: `#6b7280` (Secondary text)
- **Light Gray**: `#f3f4f6` (Backgrounds)
- **White**: `#ffffff` (Cards, modals)

### Semantic Colors
- **Success**: Green variants
- **Warning**: Orange/yellow variants  
- **Error**: Red variants
- **Info**: Blue variants

## 📱 Responsive Behavior

### Desktop (1024px+)
- Full 3x2 grid for use cases
- Side-by-side layout for forms and info
- Larger typography and spacing

### Tablet (768px - 1023px)
- 2x3 grid for use cases
- Stacked layout for forms and info
- Medium typography

### Mobile (< 768px)
- Single column grid for use cases
- Fully stacked layouts
- Larger touch targets
- Condensed navigation

## 🔄 User Flow & Navigation

### Primary Navigation Flow
```
Welcome → Register → Evaluate → Suggestions → Sponsor → Mint → Verify
```

### Alternative Entry Points
- Direct use case access via grid
- Verification as standalone (bank users)
- Project suggestions without registration (public)

### State Management
- Wallet connection status
- Business registration state
- Selected projects
- Transaction history
- Minted NFTs

## 💫 Interactive Elements

### Micro-interactions
- Button hover effects with elevation
- Card hover animations
- Loading spinners for blockchain operations
- Success/error state animations
- Progress indicators for multi-step processes

### Feedback Systems
- Toast notifications for actions
- Inline validation for forms
- Progress bars for transactions
- Status badges for verification states

### Web3 Integration Points
- Wallet connection indicator
- Network status display
- Transaction progress
- Gas fee estimates
- Block explorer links

## 🎯 Accessibility Features

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color combinations
- Clear focus indicators
- Alt text for icons and images
- Semantic HTML structure

## 📊 Data Visualization

### ESG Score Display
- Large numeric display
- Progress bars or circular indicators
- Color-coded score ranges
- Breakdown charts

### Transaction History
- Timeline view
- Status indicators
- Amount formatting
- Date/time stamps

### Verification Results
- Certificate-style layouts
- Authenticity badges
- Detailed information grids
- Export/share options

This design creates an intuitive, professional experience that guides users through the Herita platform's ESG blockchain functionality while maintaining clarity and trust throughout the process.
