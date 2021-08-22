import {expect} from '@open-wc/testing';
import TemplateCompiler from '../../../components/cme-form-view/TemplateCompiler';
import { TokenValueDTO } from '../../../components/cme-form-view/types';

describe('TemplateCompiler', () => {
  it('template should be comiled', () => {
    const template = [
      '{type}{scope}: {description}',
      '',
      '{body}',
      '',
      '{breaking_change}{footer}',
    ];

    const tokens: Token[] = [
      {
        label: 'Type',
        name: 'type',
        type: 'enum',
        options: [
          {
            label: '---',
            value: '',
          },
          {
            label: 'build',
            description:
              'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
          },
          {
            label: 'chore',
            description: 'Updating grunt tasks etc; no production code change',
          },
          {
            label: 'ci',
            description:
              'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
          },
          {
            label: 'docs',
            description: 'Documentation only changes',
          },
          {
            label: 'feat',
            description: 'A new feature',
          },
          {
            label: 'fix',
            description: 'A bug fix',
          },
          {
            label: 'perf',
            description: 'A code change that improves performance',
          },
          {
            label: 'refactor',
            description:
              'A code change that neither fixes a bug nor adds a feature',
          },
          {
            label: 'revert',
          },
          {
            label: 'style',
            description:
              'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
          },
          {
            label: 'test',
            description: 'Adding missing tests or correcting existing tests',
          },
        ],
        description: 'Type of changes',
      },
      {
        label: 'Scope',
        name: 'scope',
        description:
          'A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., "feat(parser): add ability to parse arrays".',
        type: 'text',
        multiline: false,
        prefix: '(',
        suffix: ')',
      },
      {
        label: 'Short description',
        name: 'description',
        description: 'Short description in the subject line.',
        type: 'text',
        multiline: false,
      },
      {
        label: 'Body',
        name: 'body',
        description: 'Optional body',
        type: 'text',
        multiline: true,
        lines: 5,
        maxLines: 10,
      },
      {
        label: 'Breaking change',
        name: 'breaking_change',
        type: 'boolean',
        value: 'BREAKING CHANGE: ',
      },
      {
        label: 'Footer',
        name: 'footer',
        description: 'Optional footer',
        type: 'text',
        multiline: true,
      },
    ];

    const tokenValues: TokenValueDTO = {
      type: 'feat',
      scope: 'lorem|ipsum',
      description: 'test description',
      body: 'Test body',
      breaking_change: 'BREAKING CHANGE: ',
    };

    const compiler = new TemplateCompiler(template, tokens, tokenValues);
    const result = compiler.compile();

    let expected = '';

    expected += 'feat(lorem|ipsum): test description\n';
    expected += '\n';
    expected += 'Test body\n';
    expected += '\n';
    expected += 'BREAKING CHANGE: ';

    expect(result).to.eq(expected);
  });
});
