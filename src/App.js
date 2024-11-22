import React, { useState, useCallback } from 'react'; 
import jsonlint from 'jsonlint';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [treeData, setTreeData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      // Replace hideBlankColumns with hideBlankCols in the JSON input
      const modifiedInput = jsonInput.replace(/"hideBlankCols"/g, '"hideBlankColumns"');
      jsonlint.parse(modifiedInput);
      const jsonData = JSON.parse(modifiedInput);
      const data = buildTreeData('root', jsonData);
      setTreeData(data);
      setJsonInput(modifiedInput); // Update the textarea with modified JSON
    } catch (error) {
      alert('Invalid JSON input.');
    }
  };

  const handleDownload = () => {
    if (!jsonInput) {
      alert('No JSON content to download');
      return;
    }
    
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please drop a valid JSON file.');
    }
  }, []);

  return (
    <div className="container">
      <h1>Config Fix</h1>
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter JSON here or drag and drop a JSON file"
            rows="10"
            cols="50"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button type="submit">Modify</button>
            {treeData && ( <button type="button" onClick={handleDownload}>Download JSON</button>)}
          </div>
        </form>
      </div>
       
    </div>
  );
}

export default App;