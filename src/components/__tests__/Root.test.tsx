import React from "react";
import { mount, ReactWrapper } from "enzyme";
import Root from "../Root";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import chatloopTheme from "../../assets/chatloopTheme";

let wrappedRoot: ReactWrapper;
let props: any;

const createTestProps = (props: any) => ({ ...props });

describe("Rendering <App/>", () => {
  beforeEach(() => {
    props = createTestProps({});
    wrappedRoot = mount(<Root children="" />);
  });

  afterEach(() => wrappedRoot.unmount());

  test("should render 1 <CssBaseline>", () => {
    expect(wrappedRoot.find(CssBaseline)).toHaveLength(1);
  });

  test("should render 1 <ThemeProvider/> ", () => {
    const wrappedThemeProvider = wrappedRoot.find(ThemeProvider);
    expect(wrappedThemeProvider).toHaveLength(1);
    expect(wrappedThemeProvider.prop("theme")).toBeTruthy();
  });
});
