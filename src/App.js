import React, { useState } from 'react';
import JsonTree from './JsonTree';
import jsonlint from 'jsonlint';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [treeData, setTreeData] = useState(null);

  const buildTreeData = (key, value) => {
    // For objects and arrays
    if (typeof value === 'object' && value !== null) {
      const children = [];
      const primitiveValues = [];

      Object.entries(value).forEach(([childKey, childValue]) => {
        if (typeof childValue === 'object' && childValue !== null) {
          // Add objects and arrays as tree nodes
          children.push(buildTreeData(childKey, childValue));
        } else {
          // Collect primitive values
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

    // This should not be reached as primitive values are handled in the parent
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
      const data = buildTreeData('root', jsonData);
      setTreeData(data);
    } catch (error) {
      alert('Invalid JSON input.');
    }
  };

  return (
    <div className="container">
      <h1>JSON Tree Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON here"
          rows="10"
          cols="50"
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit">Generate Tree</button>
      </form>
      {treeData && (
        <div className="tree-container">
          <JsonTree data={treeData} />
        </div>
      )}
    </div>
  );
}

export default App;