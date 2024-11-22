import React from 'react';
import Tree from 'react-d3-tree';

const JsonTree = ({ data }) => {
  const containerStyles = {
    width: '100%',
    height: '800px',
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const hasPrimitives = nodeDatum.attributes && nodeDatum.attributes.primitiveValues && nodeDatum.attributes.primitiveValues.length > 0;
    const isExpanded = !nodeDatum.__rd3t.collapsed;
    
    return (
      <g>
        <foreignObject
          x={-120}
          y={-25}
          width={240}
          height={50}
          style={{ overflow: 'visible' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}
            onClick={toggleNode}
          >
            {nodeDatum.attributes && nodeDatum.attributes.primitiveValues && nodeDatum.attributes.primitiveValues.map((item, index) => (
              <div key={index} style={{ color: getValueColor(item.value) }}>
                {item.key}: {formatValue(item.value)}
              </div>
            ))}
            {!hasPrimitives && (
              <div style={{ color: '#333' }}>{nodeDatum.name}</div>
            )}
            {(hasChildren || hasPrimitives) && (
              <span style={{ 
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }}>
                {nodeDatum.children ? `(${nodeDatum.children.length})` : ''} {isExpanded ? '▼' : '▶'}
              </span>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  const getValueColor = (value) => {
    switch (typeof value) {
      case 'string':
        return '#a31515';
      case 'number':
        return '#098658';
      case 'boolean':
        return '#0000ff';
      default:
        return '#333';
    }
  };

  const formatValue = (value) => {
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  return (
    <div style={containerStyles}>
      <Tree 
        data={data}
        orientation="horizontal"
        pathFunc="step"
        translate={{ x: 100, y: 350 }}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
        nodeSize={{ x: 300, y: 80 }}
        renderCustomNodeElement={renderCustomNode}
        collapsible={true}
        initialDepth={1}
        zoomable={true}
        scaleExtent={{ min: 0.3, max: 3 }}
        pathClassFunc={() => 'custom-link'}
      />
    </div>
  );
};

export default JsonTree;