import React from 'react';
import './App.css';
import MapComponent from './components/Map';
import DoubleRangeSliderObserver from './components/DoubleRangeSlider';
import TypeMapSelector from './components/TypeMapSelector';
import ColorScale from './components/ColorScale';
function App() {
  return (
    <div className="App">
      <h1>Shinkansen Dashboard</h1>
      <MapComponent />
      <DoubleRangeSliderObserver />
      <ColorScale />
      <TypeMapSelector />
    </div>
  );
}

export default App;
