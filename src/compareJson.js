import React, { useState, useEffect, useMemo } from 'react';
import { DiffPatcher } from 'jsondiffpatch';

const JsonComparer = ({ json1, json2 }) => {
  const [parsedData, setParsedData] = useState({
    json1: null,
    json2: null,
    diff: null,
    error: null
  });

  const diffPatcher = useMemo(() => new DiffPatcher(), []);

  useEffect(() => {
    if (!json1 || !json2) {
      setParsedData(prev => ({ ...prev, error: null, diff: null }));
      return;
    }

    try {
      const obj1 = typeof json1 === 'string' ? JSON.parse(json1) : json1;
      const obj2 = typeof json2 === 'string' ? JSON.parse(json2) : json2;
      const delta = diffPatcher.diff(obj1, obj2);

      setParsedData({
        json1: obj1,
        json2: obj2,
        diff: delta,
        error: null
      });
    } catch (error) {
      setParsedData(prev => ({
        ...prev,
        error: `Error comparing JSON: ${error.message}`,
        diff: null
      }));
    }
  }, [json1, json2, diffPatcher]);

  const formatJson = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return '';
    }
  };

  const highlightDifferences = (jsonStr, isLeft) => {
    if (!parsedData.diff || !jsonStr) return jsonStr;

    const lines = jsonStr.split('\n');
    const modifiedLines = new Set();

    const findModifiedLines = (delta, path = '') => {
      Object.keys(delta).forEach(key => {
        if (Array.isArray(delta[key])) {
          const lineNumber = jsonStr.substring(0, jsonStr.indexOf(`"${key}"`)).split('\n').length - 1;
          modifiedLines.add(lineNumber);
        } else if (typeof delta[key] === 'object') {
          findModifiedLines(delta[key], `${path}${key}.`);
        }
      });
    };

    if (typeof parsedData.diff === 'object') {
      findModifiedLines(parsedData.diff);
    }

    return lines.map((line, index) => {
      if (modifiedLines.has(index)) {
        return `<span class="${isLeft ? 'line-removed' : 'line-added'}">${line}</span>`;
      }
      return line;
    }).join('\n');
  };

  if (parsedData.error) {
    return <div className="error">{parsedData.error}</div>;
  }

  if (!json1 || !json2) {
    return <div className="info">Please enter JSON in both fields to compare.</div>;
  }

  return (
    <div className="json-comparer">
      <div className="side-by-side">
        <div className="json-panel left">
          <h3>Original JSON</h3>
          <pre 
            dangerouslySetInnerHTML={{ 
              __html: highlightDifferences(formatJson(parsedData.json1), true) 
            }} 
          />
        </div>
        <div className="json-panel right">
          <h3>Modified JSON</h3>
          <pre 
            dangerouslySetInnerHTML={{ 
              __html: highlightDifferences(formatJson(parsedData.json2), false) 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default JsonComparer;