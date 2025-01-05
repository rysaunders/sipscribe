# SipScribe - Wine & Whisky Tasting Journal

A digital journal for recording tasting notes of whiskies and wines. Built with React, TypeScript, and Tailwind CSS, this application runs entirely in the browser and stores data locally using IndexedDB.

## Features

- Record detailed tasting notes for both wines and whiskies
- Capture multiple scoring categories (aroma, taste, finish)
- Store images with your tasting notes
- Filter entries by beverage type
- All data stored locally in your browser
- Responsive design that works on both desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sipscribe.git
   cd sipscribe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to a static hosting service like GitHub Pages.

## Usage

1. **Adding a Tasting**
   - Click "Add New Tasting" on the home page
   - Select the beverage type (wine or whisky)
   - Fill in the details and tasting notes
   - Add an optional image
   - Submit to save

2. **Viewing Tastings**
   - All tastings are displayed on the home page
   - Click on any entry to view full details
   - Use the type filter to show only wines or whiskies

3. **Editing/Deleting**
   - Click on a tasting to view details
   - Use the Edit button to modify the entry
   - Use the Delete button to remove the entry

## Data Storage

All data is stored locally in your browser using IndexedDB. This means:
- No data is sent to any server
- Your tasting notes are private
- Data persists between sessions
- Data is limited by your browser's storage capacity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
