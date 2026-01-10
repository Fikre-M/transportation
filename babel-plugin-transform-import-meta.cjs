// Babel plugin to transform import.meta.env to process.env in test environment
module.exports = function() {
  return {
    name: 'transform-import-meta',
    visitor: {
      MemberExpression(path) {
        // Handle import.meta.env
        if (
          path.node.object && 
          path.node.object.type === 'MetaProperty' &&
          path.node.object.meta.name === 'import' &&
          path.node.object.property.name === 'meta' &&
          path.node.property && 
          path.node.property.name === 'env'
        ) {
          // Replace import.meta.env with process.env
          path.replaceWithSourceString('process.env');
        }
        // Handle import.meta.env.VITE_* variables
        else if (
          path.node.object && 
          path.node.object.object &&
          path.node.object.object.type === 'MetaProperty' &&
          path.node.object.object.meta.name === 'import' &&
          path.node.object.object.property.name === 'meta' &&
          path.node.object.property && 
          path.node.object.property.name === 'env' &&
          path.node.property && 
          path.node.property.name && 
          path.node.property.name.startsWith('VITE_')
        ) {
          // Replace import.meta.env.VITE_* with process.env.VITE_*
          const varName = path.node.property.name;
          path.replaceWithSourceString(`process.env.${varName}`);
        }
      },
    },
  };
};
