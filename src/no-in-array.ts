// import * as ts from 'typescript';
import * as util from '@typescript-eslint/experimental-utils';
import * as eslintUtils from './util/types'

const createRule = util.ESLintUtils.RuleCreator(name => name);

export default createRule({
  name: 'no-in-array',
  meta: {
    docs: {
      description: 'Disallow using "in" operator on an array',
      category: 'Best Practices',
      recommended: 'error',
      requiresTypeChecking: true,
    },
      messages: {
        inArrayViolation:
          'Using "in" operator on arrays are forbidden. Use Array.prototype.includes instead.',
      },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
    create: function (context) {
      return {
        BinaryExpression(node): void {
          const parserServices = util.ESLintUtils.getParserServices(context);
          const checker = parserServices.program.getTypeChecker();
          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node.right);

          console.log(originalNode);
    
          const type = eslintUtils.getConstrainedTypeAtLocation(
            checker,
            originalNode,
          );
          if (node.operator === 'in' && eslintUtils.isTypeArrayTypeOrUnionOfArrayTypes(type, checker)) {
            context.report({
              node,
              messageId: 'inArrayViolation',
            });
          }
        }
      };
    },
});
