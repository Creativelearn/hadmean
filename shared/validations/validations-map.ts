import {
  isBoolean,
  isString,
  isEmail,
  maxLength,
  minLength,
  isURL,
  isNumber,
  isJSON,
  isPositive,
  matches,
  isAlphanumeric,
  isNotEmpty,
  isDate,
  isRgbColor,
  min,
  max,
  isIn,
} from "class-validator";
import { FIELD_TYPES_CONFIG_MAP } from "./field-types-config";
import { handleValidation } from "./handle-validation";
import { ValidationTypes } from "./types";

export const ENTITY_VALIDATION_CONFIG: Record<
  ValidationTypes,
  {
    input?: Record<string, unknown>;
    isBoundToType?: Array<keyof typeof FIELD_TYPES_CONFIG_MAP>;
    message: string;
    implementation: (
      value: unknown,
      errorMessage: string,
      constraints: Record<string, unknown>,
      allValues: Record<string, unknown>
    ) => undefined | string;
  }
> = {
  required: {
    message: "{{ name }} is required",
    implementation: (value, errorMessage) =>
      isNotEmpty(value) ? undefined : errorMessage,
  },
  isEmail: {
    isBoundToType: ["email"],
    message: "{{ name }} is an invalid email",
    implementation: handleValidation(isEmail),
  },
  isJson: {
    isBoundToType: ["json"],
    message: "{{ name }} is an invalid json",
    implementation: handleValidation(isJSON),
  },
  isString: {
    isBoundToType: ["password", "text", "textarea", "richtext", "image"],
    message: "{{ name }} is not a text",
    implementation: handleValidation(isString),
  },
  isColor: {
    isBoundToType: ["color"],
    message: "{{ name }} should be a color",
    implementation: handleValidation(isRgbColor),
  },
  isUrl: {
    isBoundToType: ["url"],
    message: "{{ name }} is an invalid URL",
    implementation: handleValidation(isURL),
  },
  isDate: {
    isBoundToType: ["datetime-local"],
    message: "{{ name }} is an invalid Date",
    implementation: handleValidation(isDate),
  },
  isNumber: {
    isBoundToType: ["number"],
    message: "{{ name }} should be a number",
    implementation: handleValidation(isNumber),
  },
  isBoolean: {
    isBoundToType: ["boolean"],
    message: "{{ name }} should be a boolean",
    implementation: handleValidation(isBoolean),
  },

  alphanumeric: {
    message: "{{ name }} should contain only alphabets and numbers",
    implementation: handleValidation(isAlphanumeric),
  },
  postiveNumber: {
    message: "{{ name }} should be positive number",
    implementation: handleValidation(isPositive),
  },
  min: {
    input: {
      length: 3,
    },
    message: "{{ name }} should be greater than {{ length }}",
    implementation: handleValidation(min, "length"),
  },
  max: {
    input: {
      length: 10,
    },
    message: "{{ name }} should be less than {{ length }}",
    implementation: handleValidation(max, "length"),
  },
  maxLength: {
    input: {
      length: 100,
    },
    message: "{{ name }} should be less than {{ length }} characters",
    implementation: handleValidation(maxLength, "length"),
  },
  minLength: {
    input: {
      length: 3,
    },
    message: "{{ name }} should be greater than {{ length }} characters",
    implementation: handleValidation(minLength, "length"),
  },
  isIn: {
    input: {
      options: [],
    },
    message: "{{ name }} is invalid. Allowed values are {{ options }}",
    implementation: handleValidation(isIn, "options"),
  },
  matchOtherField: {
    input: {
      otherField: "",
    },
    message: "{{ name }} should match {{otherField}}",
    implementation: handleValidation((value, parameter, allValues) => {
      if (value === allValues[parameter as string]) {
        return true;
      }
      return false;
    }, "otherField"),
  },

  // Needs some work
  // Selection, enum like check

  isReference: {
    isBoundToType: ["reference"],
    message: "{{ name }} doesn't exist",
    implementation: () => undefined,
  },
  unique: {
    message: "{{ name }} already exists",
    implementation: () => undefined,
  },

  regex: {
    input: {
      pattern: "//",
    },
    message: "{{ name }} is invalid",
    implementation: handleValidation(matches, "pattern"),
  },
};
