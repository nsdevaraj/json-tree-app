import React from 'react';
import Tree from 'react-d3-tree';

const JsonTree = ({ data }) => {
  const containerStyles = {
    width: '100%',
    height: '800px',  // Increased height for vertical layout
  };

  // Custom node renderer with table view for primitive values
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const hasPrimitives = nodeDatum.attributes && nodeDatum.attributes.primitiveValues && nodeDatum.attributes.primitiveValues.length > 0;
    const isExpanded = !nodeDatum.__rd3t.collapsed;
    
    return (
      <g>
        {/* Main node circle and label */}
        <g onClick={toggleNode} style={{ cursor: 'pointer' }}>
          <circle 
            r={5} 
            fill={hasChildren ? "#4ecdc4" : "#45b7d1"}
          />
          <text
            x={8}
            y={3}
            style={{ 
              fill: '#2c3e50',
              fontSize: '12px',
              fontFamily: 'Arial',
              alignmentBaseline: 'middle'
            }}
          >
            {nodeDatum.name}
            {nodeDatum.attributes && nodeDatum.attributes.type === 'array' ? ' []' : ' {}'}
          </text>
          {(hasChildren || hasPrimitives) && (
            <text
              x={-3}
              y={3}
              style={{
                fill: 'white',
                fontSize: '10px',
                fontFamily: 'Arial',
                alignmentBaseline: 'middle',
                pointerEvents: 'none'
              }}
            >
              {nodeDatum.__rd3t.collapsed ? '+' : '-'}
            </text>
          )}
        </g>

        {/* Table view for primitive values when expanded */}
        {isExpanded && hasPrimitives && (
          <foreignObject
            x={-125}  // Centered above the node
            y={-120}  // Moved up for vertical layout
            width={250}
            height={nodeDatum.attributes.primitiveValues.length * 25 + 30}
          >
            <div xmlns="http://www.w3.org/1999/xhtml">
              <table className="node-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {nodeDatum.attributes.primitiveValues.map((item, index) => (
                    <tr key={index}>
                      <td>{item.key}</td>
                      <td>
                        {item.value === null ? 'null' : 
                         typeof item.value === 'string' ? `"${item.value}"` : 
                         String(item.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  return (
    <div style={containerStyles}>
      <Tree 
        data={data}
        orientation="vertical"
        pathFunc="straight"
        translate={{ x: 400, y: 50 }}  // Centered horizontally, more space at top
        separation={{ siblings: 2, nonSiblings: 2.5 }}  // Increased separation
        nodeSize={{ x: 300, y: 150 }}  // Wider spacing for vertical layout
        renderCustomNodeElement={renderCustomNode}
        collapsible={true}
        initialDepth={1}
        zoomable={true}
        scaleExtent={{ min: 0.3, max: 3 }}
      />
    </div>
  );
};

export default JsonTree;