import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    cart: 'Cart',
    shipping: 'Shipping',
    payment: 'Payment',
  };

  const steps = ['cart', 'shipping', 'payment'];

  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {steps.map((step, index) => {
          const to = `/${step}`;
          const isActive = location.pathname === to;
          const isCompleted = steps.indexOf(pathnames[0]) > index;

          return (
            <li key={step} className="inline-flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}
              {isActive ? (
                <span className="ml-1 text-lg font-medium text-orange-600 md:ml-2 dark:text-orange-500">
                  {breadcrumbNameMap[step]}
                </span>
              ) : (
                <Link
                  to={to}
                  className={`ml-1 text-lg font-medium ${
                    isCompleted
                      ? 'text-gray-700 hover:text-orange-600 dark:text-gray-400 dark:hover:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  } md:ml-2`}
                >
                  {breadcrumbNameMap[step]}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
