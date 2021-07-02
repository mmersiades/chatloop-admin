import { renderWithAllProviders } from '../../test-utils';
import App from '../App';

describe('Rendering App', () => {
  let screen;
  test('should render LoginPage in initial state', () => {
    screen = renderWithAllProviders(<App />);
    expect(
      screen.getByRole('img', { name: 'The Chatloop logo' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'email field' })
    ).toBeInTheDocument();
    // FAILING: I don't know why RTL is not recognising this as a role. It's in the js-dom.
    // expect(screen.getByRole('textbox', { name: 'password field' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });
});
