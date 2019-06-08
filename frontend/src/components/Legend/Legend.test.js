import React from 'react';
import { shallow, render, mount } from 'enzyme';
import Legend from './Legend';

describe('Legend', () => {
  let props;
  let shallowLegend;
  let renderedLegend;
  let mountedLegend;

  const shallowTestComponent = () => {
    if (!shallowLegend) {
      shallowLegend = shallow(<Legend {...props} />);
    }
    return shallowLegend;
  };

  const renderTestComponent = () => {
    if (!renderedLegend) {
      renderedLegend = render(<Legend {...props} />);
    }
    return renderedLegend;
  };

  const mountTestComponent = () => {
    if (!mountedLegend) {
      mountedLegend = mount(<Legend {...props} />);
    }
    return mountedLegend;
  };  

  beforeEach(() => {
    props = {};
    shallowLegend = undefined;
    renderedLegend = undefined;
    mountedLegend = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
