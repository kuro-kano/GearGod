import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Breadcrumbs Component that generates breadcrumbs based on current path
const DynamicBreadcrumbs = () => {
  const location = useLocation();
  
  // Get the current path and split it into segments
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  
  // Create breadcrumb items based on path segments
  const breadcrumbItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> }
  ];
  
  // Build up the breadcrumb items based on the path segments
  let currentPath = '';
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    // Convert path segments to readable labels (capitalize, replace hyphens with spaces)
    const readableLabel = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbItems.push({
      path: currentPath,
      label: readableLabel
    });
  });

  return (
    <nav className="bg-gray-100 p-3 rounded-md mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
            )}
            <li>
              {index === breadcrumbItems.length - 1 ? (
                // Current page (last item)
                <span className="text-gray-600 font-medium flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb
                <Link 
                  to={item.path} 
                  className="text-blue-500 hover:text-blue-700 hover:underline flex items-center"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Example pages for the routes
const HomePage = () => <div className="p-4">Home Page</div>;
const ProductsPage = () => <div className="p-4">Products Page</div>;
const ElectronicsPage = () => <div className="p-4">Electronics Page</div>;
const LaptopsPage = () => <div className="p-4">Laptops Page</div>;
const UserProfilePage = () => <div className="p-4">User Profile Page</div>;

// Layout component that includes the DynamicBreadcrumbs
const Layout = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <DynamicBreadcrumbs />
      {children}
    </div>
  );
};

// Main navigation menu for testing different routes
const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 mb-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/products" className="hover:underline">Products</Link></li>
        <li><Link to="/products/electronics" className="hover:underline">Electronics</Link></li>
        <li><Link to="/products/electronics/laptops" className="hover:underline">Laptops</Link></li>
        <li><Link to="/user/profile" className="hover:underline">User Profile</Link></li>
      </ul>
    </nav>
  );
};

// App component with routing setup
const BreadCrumbs = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/electronics" element={<ElectronicsPage />} />
            <Route path="/products/electronics/laptops" element={<LaptopsPage />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
};

export default BreadCrumbs;