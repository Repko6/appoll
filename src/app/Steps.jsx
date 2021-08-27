import React from 'react';
import { Link } from 'react-router-dom';

function Steps() {
    return (
      <div className="steps">
        <Link style={{display: "inline"}}>Uređivanje</Link>
        <Link style={{display: "inline"}}>Rezultati</Link>
      </div>
    );
  }
  
  export default Steps;