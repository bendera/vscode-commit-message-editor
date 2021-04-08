/**
 * Generate gitmoji config
 * Usage `node gitmoji-config.js > example.json`
 */

const gitmojis = require('./gitmojis.json').gitmojis;

const config = {
  label: 'Gitmoji',
  name: 'gitmoji',
  type: 'enum',
  combobox: true,
  options: [],
}

gitmojis.sort((a, b) => {
  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return 0;
});

gitmojis.forEach((emoji) => {
  const token = {
    label: `${emoji.emoji} ${emoji.name}`,
    value: emoji.emoji,
    description: emoji.description,
  };

  config.options.push(token);
});

console.log(JSON.stringify(config, null, 2));
