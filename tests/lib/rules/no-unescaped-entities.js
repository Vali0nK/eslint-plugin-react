/**
 * @fileoverview Tests for no-unescaped-entities
 * @author Patrick Hayes
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unescaped-entities');
const RuleTester = require('eslint').RuleTester;

const {BABEL_ESLINT} = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unescaped-entities', rule, {

  valid: [
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return (
              <div/>
            );
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Here is some text!</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some escaped entities: &gt; &lt; &amp;</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{">" + "<" + "&" + '"'}</div>;
          },
        });
      `
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>Here is some text!</>;
          }
        });
      `,
      parser: BABEL_ESLINT
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</>;
          }
        });
      `,
      parser: BABEL_ESLINT
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{">" + "<" + "&" + '"'}</>;
          },
        });
      `,
      parser: BABEL_ESLINT
    }
  ],

  invalid: [
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>></div>;
          }
        });
      `,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>></>;
          }
        });
      `,
      parser: BABEL_ESLINT,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some bad entities: ></div>
          }
        });
      `,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>first line is ok
            so is second
            and here are some bad entities: ></>
          }
        });
      `,
      parser: BABEL_ESLINT,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>'</div>;
          }
        });
      `,
      errors: [{message: '`\'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Multiple errors: '>></div>;
          }
        });
      `,
      errors: [
        {message: '`\'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.'},
        {message: '`>` can be escaped with `&gt;`.'},
        {message: '`>` can be escaped with `&gt;`.'}
      ]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{"Unbalanced braces"}}</div>;
          }
        });
      `,
      errors: [{message: '`}` can be escaped with `&#125;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{"Unbalanced braces"}}</>;
          }
        });
      `,
      parser: BABEL_ESLINT,
      errors: [{message: '`}` can be escaped with `&#125;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>foo & bar</>;
          }
        });
      `,
      parser: BABEL_ESLINT,
      errors: [{message: 'HTML entity, \`&\` , must be escaped.'}],
      options: [{
        forbid: ['&']
      }]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [{message: 'HTML entity, \`&\` , must be escaped.'}],
      options: [{
        forbid: ['&']
      }]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [{message: '`&` can be escaped with `&amp;`.'}],
      options: [{
        forbid: [{
          char: '&',
          alternatives: ['&amp;']
        }]
      }]
    }
  ]
});
