import React, { useState } from 'react';
import JsonTree from './JsonTree';
import jsonlint from 'jsonlint';
import JsonComparer from './compareJson';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [treeData, setTreeData] = useState(null);
  const [activeView, setActiveView] = useState('tree'); 
  const [jsonInput2, setJsonInput2] = useState('');

  const buildTreeData = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      const children = [];
      const primitiveValues = [];

      Object.entries(value).forEach(([childKey, childValue]) => {
        if (typeof childValue === 'object' && childValue !== null) {
          children.push(buildTreeData(childKey, childValue));
        } else {
          primitiveValues.push({ key: childKey, value: childValue });
        }
      });

      return {
        name: key,
        children: children,
        attributes: {
          primitiveValues: primitiveValues,
          type: Array.isArray(value) ? 'array' : 'object'
        }
      };
    }

    return {
      name: key,
      attributes: {
        primitiveValues: [],
        type: typeof value
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      jsonlint.parse(jsonInput);
      const jsonData = JSON.parse(jsonInput);
      if (activeView === 'tree') {
        const tree = buildTreeData('root', jsonData);
        setTreeData(tree);
      } else {
        jsonlint.parse(jsonInput2);
        const jsonData2 = JSON.parse(jsonInput2);
      }
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  };

  return (
    <div className="App">
      <div className="view-toggle">
        <button
          className={`toggle-btn ${activeView === 'tree' ? 'active' : ''}`}
          onClick={() => setActiveView('tree')}
        >
          JSON Tree
        </button>
        <button
          className={`toggle-btn ${activeView === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveView('compare')}
        >
          JSON Comparer
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter your JSON here..."
        />
        {activeView === 'compare' && (
          <textarea
            value={jsonInput2}
            onChange={(e) => setJsonInput2(e.target.value)}
            placeholder="Enter second JSON for comparison..."
          />
        )}
        <button type="submit">Process JSON</button>
      </form>

      <div className="result-container">
        {activeView === 'tree' ? (
          treeData && <JsonTree data={treeData} />
        ) : (
          <JsonComparer json1={jsonInput} json2={jsonInput2} />
        )}
      </div>
    </div>
  );
}

export default App;