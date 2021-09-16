/**
 * @link https://eslint.org/docs/developer-guide/working-with-rules
 */
module.exports = {
  rules: {
    'variables': {
      meta: {
        messages: {
          avoidName: 'Avoid using variables named \'{{ name }}\''
        }
      },
      create: function (context) {
        return {
          Identifier (node) {
            const blackList = ['obj', 'teste', 'test', 'foo']
            if (
              blackList.includes(node.name) &&
              (
                node.parent.type !== 'MemberExpression' ||
                node.parent.computed ||
                node.parent.object === node
              )
            ) {
              context.report({
                node,
                messageId: 'avoidName',
                data: {
                  name: node.name
                }
              })
            }
          }
        }
      }
    }
  }
}
