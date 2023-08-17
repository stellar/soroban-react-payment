import { copyContent } from "../dom";

describe("copyContent", () => {
  beforeEach(() => {
    let clipboardData = "";
    const mockClipboard = {
      writeText: jest.fn((data) => {
        clipboardData = data;
      }),
      readText: jest.fn(() => clipboardData),
    };
    global.navigator = {
      clipboard: mockClipboard,
    } as any;
  });

  test("should copy a string and add it to the clipboard", async () => {
    const str = "test string";
    await copyContent(str);

    const clipboard = await navigator.clipboard.readText();
    expect(clipboard).toEqual(str);
  });
});
