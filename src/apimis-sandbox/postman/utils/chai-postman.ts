const chai = require('chai');
import ChaiApimis from './chai-apimis';

chai.use(() => {
  ChaiApimis(chai);
});

export default chai;
