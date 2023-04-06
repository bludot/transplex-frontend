import React from "react";
import {Link} from "react-router-dom";

export default function Header({children}: { children: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children)
  return (
    <header className="bg-white shadow flex flex-row">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link to={'/'} className="text-gray-500 hover:text-gray-900">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </Link>
      </div>
      {childrenArray.map((child, index) => (
          <div key={index} className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {child}
          </div>
        ))
      }
    </header>
  );
}