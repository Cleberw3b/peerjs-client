import React from 'react'
import Header from './header';
import Nav from "./nav";
import Footer from "./footer";

const Layout = ({ children }) => (
  <>
    <Header />
    <Nav />
    {children}
    <Footer />
  </>
);

export default Layout;
