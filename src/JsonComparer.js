
import React, { useState } from 'react';
import compareJson from './compareJson';

const JsonComparer = () => {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diff, setDiff] = useState('');

  const handleJson1Change = (event) => {
    setJson1(event.target.value);
  };

  const handleJson2Change = (event) => {
    setJson2(event.target.value);
  };

  const handleCompare = () => {
    const result = compareJson(JSON.parse(json1), JSON.parse(json2));
    setDiff(result);
  };

  return (
    <div>
      <h2>JSON Comparer</h2>
      <label>
        JSON 1:
        <textarea value={json1} onChange={handleJson1Change} rows={10} cols={50} />
      </label>
      <label>
        JSON 2:
        <textarea value={json2} onChange={handleJson2Change} rows={10} cols={50} />
      </label>
      <button onClick={handleCompare}>Compare</button>
      {diff && <div>Differences:</div>}
      {diff && <pre>{diff}</pre>}
    </div>
  );
};

export default JsonComparer;