import './App.css';
import { Navbar } from './app/Navbar';
import Header from './app/Header';
import Content from './app/Content';
import { useState } from 'react';

function App() {

  const [breadcrumb, setBreadcrumb] = useState('');

  function onChangeBreadcrumb(value){
    setBreadcrumb(value);
  }

  return (
    <div>
      <Header breadcrumb={breadcrumb} />
      <Navbar />
      <Content onChangeBreadcrumb={onChangeBreadcrumb} />
    </div>
  );
}

export default App;
