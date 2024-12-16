import React from 'react';

interface BreadcrumbItem {
  label: string; // The text for the breadcrumb
  href?: string; // Optional URL for the breadcrumb link
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]; // List of breadcrumb items
  translate?: (key: string) => string; // Optional translation function
}

const BreadcrumbDashboard: React.FC<BreadcrumbProps> = ({
  items,
  translate = (key) => key,
}) => {
  return (
    <nav className="ml-auto">
      <ol className="flex gap-1 items-center">
        {/* Reverse the items before rendering */}
        {items
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse()
          .map((item, index) => (
            <React.Fragment key={index}>
              <li
                className={`breadcrumb-item ${
                  index === 0 ? 'current' : ''
                }`} // Adjust the 'current' class for reversed order
              >
                {item.href ? (
                  <a href={item.href} className="breadcrumb-link">
                    {translate(item.label)}
                  </a>
                ) : (
                  <span className="breadcrumb-page">
                    {translate(item.label)}
                  </span>
                )}
              </li>
              {index < items.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </React.Fragment>
          ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbDashboard;
