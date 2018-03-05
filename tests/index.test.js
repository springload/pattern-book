import React from "react";
import Book from "../src/index";
import renderer from "react-test-renderer";

it("renders correctly", async () => {
  global.document = {
    styleSheets: [{ childNodes: ["b", "c"] }]
  };

  const book = (
    <Book>
      <h1>test</h1>
    </Book>
  );

  const createNodeMock = elem => {
    return {
      innerHTML: "<h1>test</h1>",
      childNodes: ["a", "b"]
    };
  };
  const tree = renderer.create(book, { createNodeMock });
  const instance = tree.getInstance();

  expect(tree.toJSON()).toMatchSnapshot();
});
