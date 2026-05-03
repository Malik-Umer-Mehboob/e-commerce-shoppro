import React from 'react';
import Header from './Header';
import Footer from './Footer';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
