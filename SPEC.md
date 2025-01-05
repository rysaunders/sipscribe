# SPEC.md

## Overview

This project is a digital journal for recording tasting notes of whiskies and wines. It will be hosted on GitHub Pages and store all data in the user’s browser (no backend). The initial feature set includes:

- **Tasting Log**: A form for capturing details about each tasting.
- **Sub-Scores**: Capture multiple categories (aroma, taste, finish, etc.) and compute a final score automatically.
- **Data Storage**: IndexedDB (or a library like Dexie.js/localforage) to store entries locally in the user’s browser.
- **UI & UX**: Built with React (bootstrapped via Vite) and styled with Tailwind CSS for a polished look.
- **Extensibility**: Provide a foundation for additional features such as advanced filtering or data export (planned for a future release).

---

## Goals and Requirements

1. **Browser-Only Operation**  
   - No external databases or servers.  
   - Data remains entirely local to the user’s machine.

2. **Tasting Entries**  
   - Must accommodate both **wine** and **whisky** entries.  
   - Provide sub-scores for categories (aroma, palate, finish, etc.) that roll up into a final calculated score.  
   - Store additional fields specific to wine (e.g., vintage, varietal, region) and whisky (e.g., distillery, age statement, mash bill).

3. **User Experience**  
   - **Immersive Journal Layout**: Card-based or visually appealing grid to show entries, each with a photo, summary info, and final score.  
   - **Detailed Notes**: Expand or navigate to a detail page that includes color, nose notes, palate notes, finish notes, pairing suggestions, etc.  
   - **Basic Filtering**: Allow filtering by type (wine/whisky), region, etc., but keep the filtering logic extensible for future expansion.  
   - **Responsive Design**: Should be usable on desktop and mobile devices; does not have to be fully optimized for every screen size, but use Tailwind’s responsive classes where possible.

4. **Technical Stack**  
   - **React + Vite**: Quick setup with minimal config.  
   - **Tailwind CSS**: Utility-first styling.  
   - **IndexedDB**: Store data locally. A small helper library (like Dexie.js) can simplify queries.

5. **Future Features** (not in the initial release)  
   - **Import/Export**: Ability to export tasting notes to a JSON file and import them on another device.  
   - **Advanced Filtering**: Filter by multiple criteria (like region + rating threshold) or free text search across nose/palate/finish notes.  
   - **Analytics/Tag Clouds**: Visualize most common flavor descriptors, average scores, etc.

---

## Data Model

Below is a suggested schema for each tasting entry. Note that some fields are specific to wines vs. whiskies. Fields marked with `?` are optional (or relevant only for one type).

```ts
type TastingEntry = {
  id: string;                 // Unique ID (UUID or generated)
  type: 'wine' | 'whisky';    // Type of beverage

  // Common fields
  name: string;               
  imageBase64?: string;       // Base64-encoded image
  noseNotes: string;
  palateNotes: string;
  finishNotes: string;
  colorNotes: string;         // If you want to capture color impressions
  pairingSuggestions: string; // For both wine & whisky (e.g., cheese, dessert, cigars)
  
  // Sub-scores (each on a 1–10 or 1–100 scale)
  aromaScore: number;
  palateScore: number;
  finishScore: number;
  overallScore: number;       // Computed from sub-scores (e.g., average or weighted sum)

  // Wine-specific
  vintage?: number;           
  varietal?: string;          
  region?: string;            

  // Whisky-specific
  distillery?: string;        
  ageStatement?: number;      
  mashBill?: {
    rye?: number;
    corn?: number;
    barley?: number;
    wheat?: number;
  };

  // Timestamps
  createdAt: string;          // ISO date string
  updatedAt: string;          // ISO date string
};

Score Calculation

    Sub-Scores: The user inputs values (1–10 recommended) for aromaScore, palateScore, and finishScore.
    Overall Score: Computed automatically each time the user updates any sub-score. One simple approach:
    overallScore=aromaScore+palateScore+finishScore3
    overallScore=3aromaScore+palateScore+finishScore​ or any weighted approach desired.

User Flow

    Home / Tasting List Page
        Displays all tastings in either a grid of cards or a table. Each entry includes:
            Thumbnail (if imageBase64 is provided).
            Name (wine or whisky).
            Final score (overallScore).
            Possibly a short snippet of notes.
        User can filter by:
            Type (wine/whisky).
            Possibly region (for wine) or distillery (for whisky) if desired in the first release.
        A button/link to “Add New Tasting” leads to the Add Tasting page.

    Add/Edit Tasting Page
        Form Layout:
            Basic Info: Beverage name, type (dropdown or radio buttons for wine/whisky).
            Image Upload: Convert the uploaded file to base64 and store in imageBase64.
            Sub-Scores: Input fields for aroma, palate, finish. The final score auto-computes.
            General Notes: colorNotes, noseNotes, palateNotes, finishNotes, pairingSuggestions.
            Wine Fields (conditioned on type === 'wine'): vintage, varietal, region.
            Whisky Fields (conditioned on type === 'whisky'): distillery, ageStatement, mashBill breakdown.
        On Submit:
            Create a new entry in IndexedDB (or update an existing one if editing).
            Redirect back to the Tasting List.

    Tasting Detail Page (optional, if separate from Edit)
        If you want more space for an immersive layout, you can separate the “display” view from the “edit” page.
        Show a larger image, the final score, sub-scores, notes, etc.
        An Edit button navigates to the same form used for creating an entry.

    Future: Import/Export
        Export: Allow the user to download a JSON file containing all TastingEntries.
        Import: Allows user to upload a JSON file to restore entries (merging or replacing existing data).

Technical Implementation Details

    Project Setup
        Initialization: npm create vite@latest my-tasting-journal --template react or similar.
        Tailwind: Install via npm install -D tailwindcss postcss autoprefixer and configure tailwind.config.js. Import the Tailwind CSS file in main.jsx or a global CSS.

    Data Storage
        IndexedDB recommended.
        Dexie.js (or localforage) can simplify interactions. Dexie sample usage:

        import Dexie from 'dexie';

        const db = new Dexie('TastingDB');
        db.version(1).stores({ tastings: 'id,type,name,overallScore' });

        // Interacting with DB
        await db.tastings.add(tastingEntry);
        const allEntries = await db.tastings.toArray();

        Schema: Only require indexes for fields you plan to filter often.

    State Management
        Could use a React Context or Recoil or Redux for global state.
        Alternatively, each page can directly query Dexie in useEffect hooks.

    Routing
        React Router or a minimal router can handle navigation (list, add/edit, details).
        If you want to keep it simpler, you can have a single-page approach with conditionally rendered components.

    Styling
        Tailwind: Leverage utility classes to create card layouts and forms.
            Example: A card might look like <div className="max-w-sm rounded overflow-hidden shadow-lg p-4">...</div>
        Responsiveness: Use Tailwind’s breakpoints (sm:, md:, lg:) to adjust layout for smaller screens.

    Deployment
        Build the app with npm run build, producing a dist folder.
        Configure GitHub Pages to serve from the dist folder. A typical approach is to push the dist folder to the gh-pages branch or use an automated action for Vite+GitHub Pages.

Milestones

    MVP
        React front-end with Vite + Tailwind setup.
        Single-page or basic routing for:
            Tasting List (display of all entries, minimal filter)
            Add/Edit Tasting (forms and IndexedDB integration)
        Sub-scores & automatic final score calculation.
        Basic image upload stored as base64.

    Enhancements
        More advanced filtering (region, rating range, etc.).
        Tag cloud or flavor descriptors.
        Additional wine/whisky fields or custom scoring logic.

    Future Release: Import/Export Feature
        Implement JSON export of all data.
        Implement JSON import with conflict resolution (replace or merge existing data).

Deliverables

    Source Code
        A React + Vite project with all components and a Dexie-based data access layer.
        Tailwind configuration and styling.
    Deployed GitHub Pages Site
        Set up to serve the compiled dist folder as a static site.
    Documentation
        README.md with instructions on local setup, running npm run dev, and building.
        This SPEC.md as a high-level requirements and design reference.

Assumptions

    Rating Scale: 1–10 for each sub-score, aggregated via a simple average.
    Filtering: Minimal in the initial release (basic type filtering).
    Import/Export: Deferred to a future release.
    Responsiveness: Implemented primarily via Tailwind’s utility classes, tested on desktop and basic mobile, without extensive QA for every device.

End of SPEC
