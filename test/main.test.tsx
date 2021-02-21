import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Main from '../src/main';

describe('ExampleForm', () => {
  it('does stuff', () => {
    // eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/no-unused-vars
    const { debug, rerender, container, ...wrapper } = render(<Main />);
    const ele = wrapper.getByTestId('mainTest');
    fireEvent.click(ele, { target: { value: 'fdsf' } });
    debug();
    expect(1 + 1).toEqual(2);
  });
});
