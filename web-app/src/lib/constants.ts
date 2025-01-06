import { AIModel } from "./types";

export const APP_NAME = "Global Frozen - AI";
export const APP_ENV = "development";
export const APP__HOSTNAME = `localhost:8080`;
export const APP_BASE_URL = `http://${APP__HOSTNAME}`;

export const API_BASE_URL = `${process.env.APP_API_URL}`;
export const V1_API_BASE_URL = `${process.env.APP_API_URL}/v1`;
export const AI_API_BASE_URL = `${process.env.APP_API_URL}/ai`;
export const SAP_API_BASE_URL = `${process.env.APP_API_URL}/sap`;

export const APP_VERSION = "APP_VERSION";
export const APP_BUILD_HASH = "APP_BUILD_HASH";
export const APP_COOKIES = {
  APP_USER_SESSION: "app-session",
  APP_LOGGED_USER: "app-user",
};

export const SUPPORTED_FILE_TYPE = [
  "application/epub+zip",
  "application/pdf",
  "text/plain",
  "text/csv",
  "text/xml",
  "text/html",
  "text/x-python",
  "text/css",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
  "application/x-javascript",
  "text/markdown",
  "audio/mpeg",
  "audio/wav",
];

export const SUPPORTED_FILE_EXTENSIONS = [
  "md",
  "rst",
  "go",
  "py",
  "java",
  "sh",
  "bat",
  "ps1",
  "cmd",
  "js",
  "ts",
  "css",
  "cpp",
  "hpp",
  "h",
  "c",
  "cs",
  "htm",
  "html",
  "sql",
  "log",
  "ini",
  "pl",
  "pm",
  "r",
  "dart",
  "dockerfile",
  "env",
  "php",
  "hs",
  "hsc",
  "lua",
  "nginxconf",
  "conf",
  "m",
  "mm",
  "plsql",
  "perl",
  "rb",
  "rs",
  "db2",
  "scala",
  "bash",
  "swift",
  "vue",
  "svelte",
  "doc",
  "docx",
  "pdf",
  "csv",
  "txt",
  "xls",
  "xlsx",
  "pptx",
  "ppt",
];

export const SUPPORTED_LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "de", name: "Alemán" },
  { code: "it", name: "Italiano" },
  { code: "zh", name: "Chino" },
  // Añade más idiomas según sea necesario
];

export const DEFAULT_CHATBOT_ID = "42bcf145-7c6d-4050-ae28-fdf84424c878";
export const DEFAULT_COMPANY_ID = "bc340ac9-a0ca-4ab7-bf07-0a9c996bfe8a";

export const DEFAULT_MODELS: AIModel[] = [
  {
    id: "anthropic.claude-3-sonnet-20240229-v1:0",
    name: "Claude 3",
    description: "",
  },
  {
    id: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    name: "Claude 3.5",
    description: "",
  },
  {
    id: "anthropic.claude-3-opus-20240229-v1:0",
    name: "Claude Opus",
    description: "",
  },
  {
    id: "anthropic.claude-instant-v1",
    name: "Claude Instant",
    description: "",
  },
  {
    id: "anthropic.claude-3-haiku-20240307-v1:0",
    name: "Claude Haiku",
    description: "",
  },
];
