import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load pages for better performance
const TastingList = lazy(() => import('./pages/TastingList'));
const AddTasting = lazy(() => import('./pages/AddTasting'));
const EditTasting = lazy(() => import('./pages/EditTasting'));
const TastingDetail = lazy(() => import('./pages/TastingDetail'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="font-serif text-2xl font-bold bg-gradient-to-r from-burgundy-600 to-whiskey-700 bg-clip-text text-transparent">
                    SipScribe
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-burgundy-600 to-whiskey-700 hover:from-burgundy-700 hover:to-whiskey-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500"
                >
                  Add New Tasting
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Suspense 
            fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<TastingList />} />
              <Route path="/add" element={<AddTasting />} />
              <Route path="/edit/:id" element={<EditTasting />} />
              <Route path="/tasting/:id" element={<TastingDetail />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              SipScribe - Your Personal Wine & Whisky Tasting Journal
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
