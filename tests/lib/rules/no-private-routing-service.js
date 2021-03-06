//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-private-routing-service');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-private-routing-service', rule, {
  valid: [
    // Classic
    "export default Component.extend({ someService: service('routing') });",
    "export default Component.extend({ someService: service('-router') });",
    "export default Component.extend({ '-routing': service('routing') });",
    "export default Component.extend({ '-routing': service('-router') });",
    "Component.extend({ routing: someOtherFunction('-routing') });",
    'export default Component.extend({ someService: service() });',
    'export default Component.extend({ notAService: "a value" });',
    'export default Component.extend({ anInt: 25 });',

    // Octane
    'export default class MyComponent extends Component { @service router; }',
    "export default class MyComponent extends Component { @service('router') routing; }",
    'export default class MyComponent extends Component { @service routing; }',
    "export default class MyComponent extends Component { @service('routing') routing; }",
    `
    export default class MyComponent extends Component {
      @computed('-routing', 'lastName')
        get fullName() {
        return \`${this.firstName} ${this.lastName}\`;
      }
    }
    `,
    'class MyComponent extends Component { @service() routing; }',
    'class MyComponent extends Component { @service() notRouting; }',
    'class MyComponent extends Component { aProp="routing"; }',
    'class MyComponent extends Component { aProp="-routing"; }',
    'class MyComponent extends Component { aProp="another value"; }',
    'class MyComponent extends Component { anIntProp=25; }',
  ],
  invalid: [
    // Classic
    {
      code: "export default Component.extend({ routing: service('-routing') });",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },

    // Octane
    {
      code: "export default class MyComponent extends Component { @service('-routing') routing; }",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ClassProperty' }],
    },
  ],
});
