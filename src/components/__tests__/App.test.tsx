import React from "react";
import { mount, ReactWrapper } from "enzyme";
import App from "../App";
import Root from "../Root";

let wrappedApp: ReactWrapper;
let props: any;

const createTestProps = (props: any) => ({ ...props });

describe("Rendering <App/>", () => {
  beforeEach(() => {
    props = createTestProps({});
    wrappedApp = mount(
      <Root>
        <App {...props} />
      </Root>
    );
  });

  afterEach(() => wrappedApp.unmount());

  test("should render App with appContainer <div/>", () => {
    expect(wrappedApp.find(App)).toHaveLength(1);
    expect(
      wrappedApp
        .find("div")
        .findWhere(
          n => n.prop("className") && n.prop("className").match(/appContainer/)
        )
    ).toHaveLength(1);
  });
});
