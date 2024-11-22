import React from 'react';
import Tree from 'react-d3-tree';

const JsonTree = ({ data }) => {
  const containerStyles = {
    width: '100%',
    height: '600px',
  };

  // Custom node renderer with table view for children
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const isExpanded = hasChildren && !nodeDatum.__rd3t.collapsed;
    
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
          </text>
          {hasChildren && (
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

        {/* Table view for children when expanded */}
        {isExpanded && hasChildren && (
          <foreignObject
            x={20}
            y={10}
            width={250}
            height={nodeDatum.children.length * 25 + 30}
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
                  {nodeDatum.children.map((child, index) => (
                    <tr key={index}>
                      <td>{child.name.split(': ')[0]}</td>
                      <td>
                        {child.children ? '(Object)' : child.name.split(': ')[1]}
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
        orientation="horizontal"
        pathFunc="straight"
        translate={{ x: 50, y: 250 }}
        separation={{ siblings: 1, nonSiblings: 1.5 }}
        nodeSize={{ x: 40, y: 270 }}
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