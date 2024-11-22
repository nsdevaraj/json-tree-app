import React, { useState } from 'react';
import JsonTree from './JsonTree';
import jsonlint from 'jsonlint';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [treeData, setTreeData] = useState(null);

  const transformToTreeData = (key, value) => {
    if (value === null) {
      return {
        name: `${key}: null`,
        attributes: {
          type: 'null'
        }
      };
    }

    if (typeof value === 'object') {
      const children = Object.entries(value).map(([k, v]) => transformToTreeData(k, v));
      return {
        name: key,
        attributes: {
          type: Array.isArray(value) ? 'array' : 'object'
        },
        children
      };
    }

    return {
      name: `${key}: ${value}`,
      attributes: {
        type: typeof value
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      jsonlint.parse(jsonInput);
      const jsonData = JSON.parse(jsonInput);
      const treeStructure = transformToTreeData('root', jsonData);
      setTreeData(treeStructure);
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