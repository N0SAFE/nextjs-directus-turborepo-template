import type {
  ValidatorPlugin,
  ServiceContainer,
  TemplateField,
} from "../../types/index.js";

/**
 * Default Validator Plugins
 *
 * These are the built-in validators that were previously embedded in ValidationService.
 * They are now modularized as plugins for better testability and extensibility.
 */

/**
 * Validates URL format
 */
export const urlValidator: ValidatorPlugin = {
  name: "url",
  description: "Validates URLs with protocol, hostname, and port constraints",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string) => {
      if (!value || !value.trim()) {
        return "URL cannot be empty";
      }

      try {
        const url = new globalThis.URL(value);
        // Ensure it has a valid protocol
        const validProtocols = [
          "http:",
          "https:",
          "ftp:",
          "ftps:",
          "postgres:",
          "postgresql:",
          "mysql:",
          "redis:",
        ];
        if (!validProtocols.includes(url.protocol)) {
          return `Invalid protocol. Must be one of: ${validProtocols.map((p) => p.slice(0, -1)).join(", ")}`;
        }
        return true;
      } catch {
        return "Invalid URL format";
      }
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "text",
      message:
        promptOptions.message ||
        "Enter a valid URL (e.g., https://example.com)",
    }),
  }),
};

/**
 * Validates numeric values with constraints
 */
export const numberValidator: ValidatorPlugin = {
  name: "number",
  description: "Validates numeric values with optional constraints",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string>
    )=> {
      if (!value || !value.trim()) {
        return "Number cannot be empty";
      }

      const num = parseFloat(value);
      if (isNaN(num)) {
        return "Value must be a valid number";
      }

      // Check allow list first (takes precedence)
      if (params.allow) {
        const allowedValues = params.allow
          .split(",")
          .map((v) => parseFloat(v.trim()));
        if (allowedValues.includes(num)) {
          return true;
        }
      }

      // Check min/max constraints
      if (params.min !== undefined) {
        const min = parseFloat(params.min);
        if (!isNaN(min) && num < min) {
          return `Number must be at least ${min}`;
        }
      }

      if (params.max !== undefined) {
        const max = parseFloat(params.max);
        if (!isNaN(max) && num > max) {
          return `Number must be at most ${max}`;
        }
      }

      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "number",
      message: promptOptions.message || "Enter a number",
    }),
  }),
};

/**
 * Validates string values with length constraints
 */
export const stringValidator: ValidatorPlugin = {
  name: "string",
  description: "Validates string values with optional length and pattern constraints (default)",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string>
    ) => {
      if (params.required === "false" && (!value || !value.trim())) {
        return true; // Allow empty for optional fields
      }

      if (!value) {
        return "String value is required";
      }

      // Check minimum length
      if (params.min_length !== undefined) {
        const minLength = parseInt(params.min_length, 10);
        if (!isNaN(minLength) && value.length < minLength) {
          return `String must be at least ${minLength} characters long`;
        }
      }

      // Check maximum length
      if (params.max_length !== undefined) {
        const maxLength = parseInt(params.max_length, 10);
        if (!isNaN(maxLength) && value.length > maxLength) {
          return `String must be at most ${maxLength} characters long`;
        }
      }

      // Check pattern if provided
      if (params.pattern) {
        try {
          const regex = new RegExp(params.pattern);
          if (!regex.test(value)) {
            return `String must match pattern: ${params.pattern}`;
          }
        } catch {
          return "Invalid regex pattern provided";
        }
      }

      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "text",
      message: promptOptions.message || "Enter a string value",
    }),
  }),
};

/**
 * Validates boolean values
 */
export const booleanValidator: ValidatorPlugin = {
  name: "boolean",
  description: "Validates boolean values with common representations",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string) => {
      if (!value || !value.trim()) {
        return "Boolean value cannot be empty";
      }

      const normalized = value.toLowerCase().trim();
      const validValues = [
        "true",
        "false",
        "yes",
        "no",
        "1",
        "0",
        "on",
        "off",
        "enabled",
        "disabled",
      ];
      if (!validValues.includes(normalized)) {
        return `Invalid boolean value. Must be one of: ${validValues.join(", ")}`;
      }
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "select",
      choices: [
        { title: 'Yes (true)', value: 'true' },
        { title: 'No (false)', value: 'false' }
      ],
      message: promptOptions.message || "Select true or false",
    }),
  }),
};

/**
 * Validates email addresses
 */
export const emailValidator: ValidatorPlugin = {
  name: "email",
  description: "Validates email addresses with basic format checks",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string) => {
      if (!value || !value.trim()) {
        return "Email address cannot be empty";
      }

      // Basic email regex - not perfect but good enough for most cases
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        return "Invalid email address format";
      }
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "text",
      message: promptOptions.message || "Enter a valid email address",
    }),
  }),
};

/**
 * Validates port numbers
 */
export const portValidator: ValidatorPlugin = {
  name: "port",
  description: "Validates port numbers with optional allow list",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string>
    ) => {
      if (!value || !value.trim()) {
        return "Port number cannot be empty";
      }

      const port = parseInt(value, 10);
      if (isNaN(port)) {
        return "Port must be a valid number";
      }

      // Check allow list first
      if (params.allow) {
        const allowedPorts = params.allow
          .split(",")
          .map((p) => parseInt(p.trim(), 10));
        if (allowedPorts.includes(port)) {
          return true;
        }
      }

      // Standard port range
      if (port < 1 || port > 65535) {
        return "Port number must be between 1 and 65535";
      }
      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "number",
      message: promptOptions.message || "Enter a port number (1-65535)",
    }),
  }),
};

/**
 * Validates JSON strings
 */
export const jsonValidator: ValidatorPlugin = {
  name: "json",
  description: "Validates JSON strings",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (value: string) => {
      if (!value || !value.trim()) {
        return "JSON value cannot be empty";
      }

      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return `Invalid JSON format: ${error instanceof Error ? error.message : "Parse error"}`;
      }
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "text",
      message: promptOptions.message || "Enter a valid JSON string",
    }),
  }),
};

/**
 * Validates file paths
 */
export const pathValidator: ValidatorPlugin = {
  name: "path",
  description: "Validates file paths with optional absolute path constraint",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string>
    ) => {
      if (!value || !value.trim()) {
        return "File path cannot be empty";
      }

      // Basic path validation - avoid dangerous characters
      const dangerousChars = /[<>"|?*]/;
      if (dangerousChars.test(value)) {
        return 'File path contains invalid characters: < > " | ? *';
      }

      // Check if it should be absolute
      if (params.absolute === "true") {
        // Very basic absolute path check (works for most cases)
        if (!/^([a-zA-Z]:|\\\\|\/)/.test(value)) {
          return "Path must be absolute (start with drive letter, / or \\\\)";
        }
      }

      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "text",
      message: promptOptions.message || "Enter a valid file path",
    }),
  }),
};

/**
 * Validates select field values
 */
export const selectValidator: ValidatorPlugin = {
  name: "select",
  description: "Validates single selection field values with options",
  handle: (_services: ServiceContainer, field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string | string[]>
    ) => {
      if (!value || !value.trim()) {
        return "Selection cannot be empty";
      }

      // Get options from field.options.options first, then fall back to params.options
      let options: string[] = [];
      if (typeof field.options.options === "string") {
        options = field.options.options.split(",").map((v: string) => v.trim());
      } else if (Array.isArray(field.options.options)) {
        options = field.options.options;
      } else if (Array.isArray(params.options)) {
        options = params.options;
      } else if (typeof params.options === "string") {
        options = params.options.split(",").map((v: string) => v.trim());
      }

      if (options.length === 0) {
        return true; // No options specified, allow any value
      }

      if (!options.includes(value)) {
        return `Value must be one of: ${options.join(", ")}`;
      }
      return true;
    },
    transformPrompt: (promptOptions: any, field: TemplateField) => {
      // Get options from field definition
      let options: string[] = [];
      if (typeof field.options.options === "string") {
        options = field.options.options.split(",").map((v: string) => v.trim());
      } else if (Array.isArray(field.options.options)) {
        options = field.options.options;
      }

      // Transform options to choices format
      const choices = options.map((option) => ({
        title: option,
        value: option,
      }));

      const initialValueIndex = choices.findIndex(
        (c) => c.value === field.options.default && typeof field.options.default === "string"
      );

      if (initialValueIndex === -1 && field.options.default) {
        _services.configService.debug(
          `Default value "${field.options.default}" not found in options for field "${field.key}"`
        );
      }

      const initialValue =
        initialValueIndex !== -1
          ? initialValueIndex
          : 0;

      return {
        ...promptOptions,
        initial: initialValue,
        type: "select",
        message: promptOptions.message || "Select one option",
        choices: choices,
      };
    },
  }),
};

/**
 * Validates multi-select field values
 */
export const multiSelectValidator: ValidatorPlugin = {
  name: "multiselect",
  description: "Validates multi-selection field values with options",
  handle: (_services: ServiceContainer, field: TemplateField) => ({
    validate: (
      value: string | string[],
      params: Record<string, string | string[]>
    ) => {
      const values = Array.isArray(value)
        ? value
        : value.split(",").map((v: string) => v.trim());
      if (!values.length) {
        return "At least one selection is required";
      }

      // Get options from field.options.options first, then fall back to params.options
      let options: string[] = [];
      if (typeof field.options.options === "string") {
        options = field.options.options.split(",").map((v: string) => v.trim());
      } else if (Array.isArray(field.options.options)) {
        options = field.options.options;
      } else if (Array.isArray(params.options)) {
        options = params.options;
      } else if (typeof params.options === "string") {
        options = params.options.split(",").map((v: string) => v.trim());
      }

      if (options.length === 0) {
        return true; // No options specified, allow any values
      }

      const invalidValues = values.filter((v) => !options.includes(v));
      if (invalidValues.length > 0) {
        return `Invalid values: ${invalidValues.join(", ")}. Must be one of: ${options.join(", ")}`;
      }
      return true;
    },
    transformPrompt: (promptOptions: any, field: TemplateField) => {
      // Get options from field definition
      let options: string[] = [];
      if (typeof field.options.options === "string") {
        options = field.options.options.split(",").map((v: string) => v.trim());
      } else if (Array.isArray(field.options.options)) {
        options = field.options.options;
      }

      // Transform options to choices format
      const choices = options.map((option) => ({
        title: option,
        value: option,
      }));

      const initialValues =
        typeof field.options.default === "string"
          ? field.options.default
              .split(",")
              .map((v) => {
                const i = choices.findIndex((c) => c.value === v);
                if (i === -1) {
                  _services.configService.debug(
                    `Default value "${v}" not found in options for field "${field.key}"`
                  );
                }
                return i;
              })
              .filter((i) => i !== -1)
          : [];

      return {
        ...promptOptions,
        initial: initialValues,
        type: "multiselect",
        message: promptOptions.message || "Select one or more options",
        choices: choices,
      };
    },
  }),
};

/**
 * Validates date field values
 */
export const dateValidator: ValidatorPlugin = {
  name: "date",
  description: "Validates date values with optional min/max constraints",
  handle: (_services: ServiceContainer, _field: TemplateField) => ({
    validate: (
      value: string,
      params: Record<string, string>
    ) => {
      if (!value || !value.trim()) {
        return "Date cannot be empty";
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return "Invalid date format";
      }

      if (params.minDate) {
        const minDate = new Date(params.minDate);
        if (date < minDate) {
          return `Date must be on or after ${params.minDate}`;
        }
      }

      if (params.maxDate) {
        const maxDate = new Date(params.maxDate);
        if (date > maxDate) {
          return `Date must be on or before ${params.maxDate}`;
        }
      }

      return true;
    },
    transformPrompt: (promptOptions: any, _field: TemplateField) => ({
      ...promptOptions,
      type: "date",
      message: promptOptions.message || "Enter a valid date",
    }),
  }),
};

/**
 * Collection of all default validator plugins
 */
export const defaultValidatorPlugins: ValidatorPlugin[] = [
  urlValidator,
  numberValidator,
  stringValidator,
  booleanValidator,
  emailValidator,
  portValidator,
  jsonValidator,
  pathValidator,
  selectValidator,
  multiSelectValidator,
  dateValidator,
];

/**
 * Default validator plugin registry helper
 */
export const getDefaultValidatorPlugins = (): ValidatorPlugin[] => {
  return [...defaultValidatorPlugins];
};
