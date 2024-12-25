import React from 'react';

export function Card({ 
  children, 
  className = '', 
  title,
  subtitle,
  footer,
  ...props 
}) {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm hover:shadow-md 
        transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-6 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}