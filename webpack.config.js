const path = require('path');

module.exports = {
  // diğer yapılandırma ayarları
  resolve: {
    fallback: {
      assert: require.resolve('assert'),
    },
  },
};
