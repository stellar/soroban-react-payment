import BigNumber from "bignumber.js";
import * as formatters from "../format";

describe("Formatters - ", () => {
  describe("truncateString", () => {
    const DEFAULT_LENGTH = 5;
    const DELIMETER = "…";
    const original = "GCGORBD5DB4JDIKVIA536CJE3EWMWZ6KBUBWZWRQM7Y3NHFRCLOKYVAL";

    test("should truncate a string with a default length of 5", () => {
      const truncated = formatters.truncateString(original);

      expect(truncated.length).toEqual(DEFAULT_LENGTH * 2 + DELIMETER.length);
      expect(truncated).toEqual(
        `${original.slice(0, DEFAULT_LENGTH)}${DELIMETER}${original.slice(
          -Math.abs(DEFAULT_LENGTH),
        )}`,
      );
    });

    test("should truncate a string by the length passed in", () => {
      const CUSTOM_LENGTH = 3;
      const truncated = formatters.truncateString(original, CUSTOM_LENGTH);

      expect(truncated.length).toEqual(CUSTOM_LENGTH * 2 + DELIMETER.length);
      expect(truncated).toEqual(
        `${original.slice(0, CUSTOM_LENGTH)}${DELIMETER}${original.slice(
          -Math.abs(CUSTOM_LENGTH),
        )}`,
      );
    });

    test("should ignore and echo empty strings", () => {
      const empty = "";
      const truncated = formatters.truncateString(empty);

      expect(truncated.length).toEqual(empty.length);
      expect(truncated).toEqual(empty);
    });
  });

  describe("stroopToXlm", () => {
    test("should convert a raw string representing stroops into the equivalent value in lumens", () => {
      const stroops = "10000001";
      const lumens = formatters.stroopToXlm(stroops);

      expect(lumens).toEqual(new BigNumber(Number(stroops) / 1e7));
    });

    test("should convert a raw number representing stroops into the equivalent value in lumens", () => {
      const stroops = 10000001;
      const lumens = formatters.stroopToXlm(stroops);

      expect(lumens).toEqual(new BigNumber(Number(stroops) / 1e7));
    });

    test("should convert a BigNumber representing stroops into the equivalent value in lumens", () => {
      const stroops = new BigNumber("10000001");
      const lumens = formatters.stroopToXlm(stroops);

      expect(lumens).toEqual(stroops.dividedBy(1e7));
    });
  });

  describe("xlmToStroop", () => {
    test("should convert a raw string representing a value in lumens to its equivalent value in stroops", () => {
      const lumens = "11";
      const stroops = formatters.xlmToStroop(lumens);

      expect(stroops).toEqual(new BigNumber(Math.round(Number(lumens) * 1e7)));
    });

    test("should convert a BigNumber representing a value in lumens to its equivalent value in stroops", () => {
      const lumens = new BigNumber("11");
      const stroops = formatters.xlmToStroop(lumens);

      expect(stroops).toEqual(lumens.times(1e7));
    });
  });
});
