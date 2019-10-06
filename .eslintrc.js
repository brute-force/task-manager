module.exports = {
  env: {
    mocha: true
  },
  extends: [
    'standard',
    'plugin:mocha/recommended'
  ],
  plugins: [
    'mocha',
    'chai-friendly'
  ],
  rules: {
    'semi': [2, 'always'],
    'no-extra-semi': 2,
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2
}
};
