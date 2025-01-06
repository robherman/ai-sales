import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";
import { APP_BASE_URL } from "@/lib/constants";
import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
import { ResultCode } from "../types";
import { ChatMessage as IChatMessage, ChatMesageType } from "../types";
import { Message } from "ai/react";
import { CoreToolMessage, CoreAssistantMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | undefined): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

//////////////////////////
// Helper functions
//////////////////////////

const convertLatexToSingleLine = (content: any) => {
  // Patterns to match multiline LaTeX blocks
  const patterns = [
    /(\$\$\s[\s\S]*?\s\$\$)/g, // Match $$ ... $$
    /(\\\[[\s\S]*?\\\])/g, // Match \[ ... \]
    /(\\begin\{[a-z]+\}[\s\S]*?\\end\{[a-z]+\})/g, // Match \begin{...} ... \end{...}
  ];

  patterns.forEach((pattern) => {
    content = content.replace(pattern, (match: any) => {
      return match.replace(/\s*\n\s*/g, " ").trim();
    });
  });

  return content;
};

export const replaceTokens = (content: any, char: any, user: any) => {
  const charToken = /{{char}}/gi;
  const userToken = /{{user}}/gi;
  const videoIdToken = /{{VIDEO_FILE_ID_([a-f0-9-]+)}}/gi; // Regex to capture the video ID
  const htmlIdToken = /{{HTML_FILE_ID_([a-f0-9-]+)}}/gi; // Regex to capture the HTML ID

  // Replace {{char}} if char is provided
  if (char !== undefined && char !== null) {
    content = content.replace(charToken, char);
  }

  // Replace {{user}} if user is provided
  if (user !== undefined && user !== null) {
    content = content.replace(userToken, user);
  }

  // Replace video ID tags with corresponding <video> elements
  content = content.replace(videoIdToken, (match: any, fileId: any) => {
    const videoUrl = `${APP_BASE_URL}/api/v1/files/${fileId}/content`;
    return `<video src="${videoUrl}" controls></video>`;
  });

  // Replace HTML ID tags with corresponding HTML content
  content = content.replace(htmlIdToken, (match: any, fileId: any) => {
    const htmlUrl = `${APP_BASE_URL}/api/v1/files/${fileId}/content`;
    return `<iframe src="${htmlUrl}" width="100%" frameborder="0" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';"></iframe>`;
  });

  return content;
};

export const sanitizeResponseContent = (content: string) => {
  return content
    .replace(/<\|[a-z]*$/, "")
    .replace(/<\|[a-z]+\|$/, "")
    .replace(/<$/, "")
    .replaceAll(/<\|[a-z]+\|>/g, " ")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .trim();
};

export const processResponseContent = (content: string) => {
  content = convertLatexToSingleLine(content);
  return content.trim();
};

export const revertSanitizedResponseContent = (content: string) => {
  return content.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
};

export function unescapeHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}

export const capitalizeFirstLetter = (string: any) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const splitStream = (splitOn: any) => {
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(splitOn);
      parts.slice(0, -1).forEach((part) => controller.enqueue(part));
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    },
  });
};

export const convertMessagesToHistory = (messages: any[]) => {
  const history: any = {
    messages: {},
    currentId: null,
  };

  let parentMessageId = null;
  let messageId = null;

  for (const message of messages) {
    messageId = uuidv4();

    if (parentMessageId !== null) {
      history.messages[parentMessageId].childrenIds = [
        ...history.messages[parentMessageId].childrenIds,
        messageId,
      ];
    }

    history.messages[messageId] = {
      ...message,
      id: messageId,
      parentId: parentMessageId,
      childrenIds: [],
    };

    parentMessageId = messageId;
  }

  history.currentId = messageId;
  return history;
};

export const getGravatarURL = (email: any) => {
  // Trim leading and trailing whitespace from
  // an email address and force all characters
  // to lower case
  const address = String(email).trim().toLowerCase();

  // Create a SHA256 hash of the final string
  const hash = sha256(address);

  // Grab the actual image URL
  return `https://www.gravatar.com/avatar/${hash}`;
};

export const canvasPixelTest = () => {
  // Test a 1x1 pixel to potentially identify browser/plugin fingerprint blocking or spoofing
  // Inspiration: https://github.com/kkapsner/CanvasBlocker/blob/master/test/detectionTest.js
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 1;
  canvas.width = 1;
  const imageData = new ImageData(canvas.width, canvas.height);
  const pixelValues = imageData.data;

  // Generate RGB test data
  for (let i = 0; i < imageData.data.length; i += 1) {
    if (i % 4 !== 3) {
      pixelValues[i] = Math.floor(256 * Math.random());
    } else {
      pixelValues[i] = 255;
    }
  }

  ctx?.putImageData(imageData, 0, 0);
  const p = ctx?.getImageData(0, 0, canvas.width, canvas.height).data || [];

  // Read RGB data and fail if unmatched
  for (let i = 0; i < p.length; i += 1) {
    if (p[i] !== pixelValues[i]) {
      console.log(
        "canvasPixelTest: Wrong canvas pixel RGB value detected:",
        p[i],
        "at:",
        i,
        "expected:",
        pixelValues[i],
      );
      console.log("canvasPixelTest: Canvas blocking or spoofing is likely");
      return false;
    }
  }

  return true;
};

export const generateInitialsImage = (name: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 100;
  canvas.height = 100;

  if (!canvasPixelTest()) {
    console.log(
      "generateInitialsImage: failed pixel test, fingerprint evasion is likely. Using default image.",
    );
    return "/user.png";
  }

  ctx.fillStyle = "#F39C12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "40px Helvetica";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const sanitizedName = name.trim();
  const initials =
    sanitizedName.length > 0
      ? sanitizedName[0] +
        (sanitizedName.split(" ").length > 1
          ? sanitizedName[sanitizedName.lastIndexOf(" ") + 1]
          : "")
      : "";

  ctx.fillText(initials.toUpperCase(), canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
};

export const copyToClipboard = async (text: any) => {
  let result = false;
  if (!navigator.clipboard) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
      result = true;
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
    return result;
  }

  result = await navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Async: Copying to clipboard was successful!");
      return true;
    })
    .catch((error) => {
      console.error("Async: Could not copy text: ", error);
      return false;
    });

  return result;
};

export const compareVersion = (latest: any, current: any) => {
  return current === "0.0.0"
    ? false
    : current.localeCompare(latest, undefined, {
        numeric: true,
        sensitivity: "case",
        caseFirst: "upper",
      }) < 0;
};

export const findWordIndices = (text: any) => {
  const regex = /\[([^\]]+)\]/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      word: match[1],
      startIndex: match.index,
      endIndex: regex.lastIndex - 1,
    });
  }

  return matches;
};

export const removeFirstHashWord = (inputString: any) => {
  // Split the string into an array of words
  const words = inputString.split(" ");

  // Find the index of the first word that starts with #
  const index = words.findIndex((word: any) => word.startsWith("#"));

  // Remove the first word with #
  if (index !== -1) {
    words.splice(index, 1);
  }

  // Join the remaining words back into a string
  const resultString = words.join(" ");

  return resultString;
};

export const transformFileName = (fileName: any) => {
  // Convert to lowercase
  const lowerCaseFileName = fileName.toLowerCase();

  // Remove special characters using regular expression
  const sanitizedFileName = lowerCaseFileName.replace(/[^\w\s]/g, "");

  // Replace spaces with dashes
  const finalFileName = sanitizedFileName.replace(/\s+/g, "-");

  return finalFileName;
};

export const calculateSHA256 = async (file: any) => {
  // Create a FileReader to read the file asynchronously
  const reader = new FileReader();

  // Define a promise to handle the file reading
  const readFile = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // Read the file as an ArrayBuffer
  reader.readAsArrayBuffer(file);

  try {
    // Wait for the FileReader to finish reading the file
    const buffer: any = await readFile;

    // Convert the ArrayBuffer to a Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Calculate the SHA-256 hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return `${hashHex}`;
  } catch (error) {
    console.error("Error calculating SHA-256 hash:", error);
    throw error;
  }
};

export const getImportOrigin = (_chats: any[]) => {
  // Check what external service chat imports are from
  if ("mapping" in _chats[0]) {
    return "openai";
  }
  return "webui";
};

export const getUserPosition = async (raw = false) => {
  // Get the user's location using the Geolocation API
  const position: any = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).catch((error) => {
    console.error("Error getting user location:", error);
    throw error;
  });

  if (!position) {
    return "Location not available";
  }

  // Extract the latitude and longitude from the position
  const { latitude, longitude } = position.coords;

  if (raw) {
    return { latitude, longitude };
  } else {
    return `${latitude.toFixed(3)}, ${longitude.toFixed(3)} (lat, long)`;
  }
};

const convertOpenAIMessages = (convo: any) => {
  // Parse OpenAI chat messages and create chat dictionary for creating new chats
  const mapping = convo["mapping"];
  const messages = [];
  let currentId = "";
  let lastId = null;

  for (let message_id in mapping) {
    const message = mapping[message_id];
    currentId = message_id;
    try {
      if (
        messages.length == 0 &&
        (message["message"] == null ||
          (message["message"]["content"]["parts"]?.[0] == "" &&
            message["message"]["content"]["text"] == null))
      ) {
        // Skip chat messages with no content
        continue;
      } else {
        const new_chat = {
          id: message_id,
          parentId: lastId,
          childrenIds: message["children"] || [],
          role:
            message["message"]?.["author"]?.["role"] !== "user"
              ? "assistant"
              : "user",
          content:
            message["message"]?.["content"]?.["parts"]?.[0] ||
            message["message"]?.["content"]?.["text"] ||
            "",
          model: "gpt-3.5-turbo",
          done: true,
          context: null,
        };
        messages.push(new_chat);
        lastId = currentId;
      }
    } catch (error) {
      console.log("Error with", message, "\nError:", error);
    }
  }

  let history: any = {};
  messages.forEach((obj) => (history[obj.id] = obj));

  const chat = {
    history: {
      currentId: currentId,
      messages: history, // Need to convert this to not a list and instead a json object
    },
    models: ["gpt-3.5-turbo"],
    messages: messages,
    options: {},
    timestamp: convo["create_time"],
    title: convo["title"] ?? "New Chat",
  };
  return chat;
};

const validateChat = (chat: any) => {
  // Because ChatGPT sometimes has features we can't use like DALL-E or migh have corrupted messages, need to validate
  const messages = chat.messages;

  // Check if messages array is empty
  if (messages.length === 0) {
    return false;
  }

  // Last message's children should be an empty array
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.childrenIds.length !== 0) {
    return false;
  }

  // First message's parent should be null
  const firstMessage = messages[0];
  if (firstMessage.parentId !== null) {
    return false;
  }

  // Every message's content should be a string
  for (let message of messages) {
    if (typeof message.content !== "string") {
      return false;
    }
  }

  return true;
};

export const convertOpenAIChats = (_chats: any) => {
  // Create a list of dictionaries with each conversation from import
  const chats = [];
  let failed = 0;
  for (let convo of _chats) {
    const chat = convertOpenAIMessages(convo);

    if (validateChat(chat)) {
      chats.push({
        id: convo["id"],
        user_id: "",
        title: convo["title"],
        chat: chat,
        timestamp: convo["timestamp"],
      });
    } else {
      failed++;
    }
  }
  console.log(failed, "Conversations could not be imported");
  return chats;
};

export const isValidHttpUrl = (string: any) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const removeEmojis = (str: any) => {
  // Regular expression to match emojis
  const emojiRegex =
    /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;

  // Replace emojis with an empty string
  return str.replace(emojiRegex, "");
};

export const removeFormattings = (str: any) => {
  return str.replace(/(\*)(.*?)\1/g, ""); //replace(/(```)(.*?)\1/gs, "");
};

export const extractSentences = (text: any) => {
  // This regular expression matches code blocks marked by triple backticks
  const codeBlockRegex = /```[\s\S]*?```/g;

  let codeBlocks: any[] = [];
  let index = 0;

  // Temporarily replace code blocks with placeholders and store the blocks separately
  text = text.replace(codeBlockRegex, (match: any) => {
    let placeholder = `\u0000${index}\u0000`; // Use a unique placeholder
    codeBlocks[index++] = match;
    return placeholder;
  });

  // Split the modified text into sentences based on common punctuation marks, avoiding these blocks
  let sentences = text.split(/(?<=[.!?])\s+/);

  // Restore code blocks and process sentences
  sentences = sentences.map((sentence: any) => {
    // Check if the sentence includes a placeholder for a code block
    return sentence.replace(
      /\u0000(\d+)\u0000/g,
      (_: any, idx: any) => codeBlocks[idx],
    );
  });

  return sentences
    .map((sentence: any) => removeFormattings(removeEmojis(sentence.trim())))
    .filter((sentence: any) => sentence);
};

export const extractSentencesForAudio = (text: any) => {
  return extractSentences(text).reduce((mergedTexts: any, currentText: any) => {
    const lastIndex = mergedTexts.length - 1;
    if (lastIndex >= 0) {
      const previousText = mergedTexts[lastIndex];
      const wordCount = previousText.split(/\s+/).length;
      if (wordCount < 2) {
        mergedTexts[lastIndex] = previousText + " " + currentText;
      } else {
        mergedTexts.push(currentText);
      }
    } else {
      mergedTexts.push(currentText);
    }
    return mergedTexts;
  }, []);
};

export const blobToFile = (blob: any, fileName: any) => {
  // Create a new File object from the Blob
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

/**
 * @param {string} template - The template string containing placeholders.
 * @returns {string} The template string with the placeholders replaced by the prompt.
 */
export const promptTemplate = (
  template: string,
  user_name?: string,
  user_location?: string,
): string => {
  // Get the current date
  const currentDate = new Date();

  // Format the date to YYYY-MM-DD
  const formattedDate =
    currentDate.getFullYear() +
    "-" +
    String(currentDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(currentDate.getDate()).padStart(2, "0");

  // Format the time to HH:MM:SS AM/PM
  const currentTime = currentDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  // Replace {{CURRENT_DATETIME}} in the template with the formatted datetime
  template = template.replace(
    "{{CURRENT_DATETIME}}",
    `${formattedDate} ${currentTime}`,
  );

  // Replace {{CURRENT_DATE}} in the template with the formatted date
  template = template.replace("{{CURRENT_DATE}}", formattedDate);

  // Replace {{CURRENT_TIME}} in the template with the formatted time
  template = template.replace("{{CURRENT_TIME}}", currentTime);

  if (user_name) {
    // Replace {{USER_NAME}} in the template with the user's name
    template = template.replace("{{USER_NAME}}", user_name);
  }

  if (user_location) {
    // Replace {{USER_LOCATION}} in the template with the current location
    template = template.replace("{{USER_LOCATION}}", user_location);
  }

  return template;
};

/**
 * This function is used to replace placeholders in a template string with the provided prompt.
 * The placeholders can be in the following formats:
 * - `{{prompt}}`: This will be replaced with the entire prompt.
 * - `{{prompt:start:<length>}}`: This will be replaced with the first <length> characters of the prompt.
 * - `{{prompt:end:<length>}}`: This will be replaced with the last <length> characters of the prompt.
 * - `{{prompt:middletruncate:<length>}}`: This will be replaced with the prompt truncated to <length> characters, with '...' in the middle.
 *
 * @param {string} template - The template string containing placeholders.
 * @param {string} prompt - The string to replace the placeholders with.
 * @returns {string} The template string with the placeholders replaced by the prompt.
 */
export const titleGenerationTemplate = (
  template: string,
  prompt: string,
): string => {
  template = template.replace(
    /{{prompt}}|{{prompt:start:(\d+)}}|{{prompt:end:(\d+)}}|{{prompt:middletruncate:(\d+)}}/g,
    (match, startLength, endLength, middleLength) => {
      if (match === "{{prompt}}") {
        return prompt;
      } else if (match.startsWith("{{prompt:start:")) {
        return prompt.substring(0, startLength);
      } else if (match.startsWith("{{prompt:end:")) {
        return prompt.slice(-endLength);
      } else if (match.startsWith("{{prompt:middletruncate:")) {
        if (prompt.length <= middleLength) {
          return prompt;
        }
        const start = prompt.slice(0, Math.ceil(middleLength / 2));
        const end = prompt.slice(-Math.floor(middleLength / 2));
        return `${start}...${end}`;
      }
      return "";
    },
  );

  template = promptTemplate(template);

  return template;
};

export const approximateToHumanReadable = (nanoseconds: number) => {
  const seconds = Math.floor((nanoseconds / 1e9) % 60);
  const minutes = Math.floor((nanoseconds / 6e10) % 60);
  const hours = Math.floor((nanoseconds / 3.6e12) % 24);

  const results: string[] = [];

  if (seconds >= 0) {
    results.push(`${seconds}s`);
  }

  if (minutes > 0) {
    results.push(`${minutes}m`);
  }

  if (hours > 0) {
    results.push(`${hours}h`);
  }

  return results.reverse().join(" ");
};

export const getTimeRange = (timestamp: any) => {
  const now = new Date();
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

  // Calculate the difference in milliseconds
  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  const nowDate = now.getDate();
  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();

  const dateDate = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  if (nowYear === dateYear && nowMonth === dateMonth && nowDate === dateDate) {
    return "Today";
  } else if (
    nowYear === dateYear &&
    nowMonth === dateMonth &&
    nowDate - dateDate === 1
  ) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return "Previous 7 days";
  } else if (diffDays <= 30) {
    return "Previous 30 days";
  } else if (nowYear === dateYear) {
    return date.toLocaleString("default", { month: "long" });
  } else {
    return date.getFullYear().toString();
  }
};

/**
 * Extract frontmatter as a dictionary from the specified content string.
 * @param content {string} - The content string with potential frontmatter.
 * @returns {Object} - The extracted frontmatter as a dictionary.
 */
export const extractFrontmatter = (content: any) => {
  const frontmatter: any = {};
  let frontmatterStarted = false;
  let frontmatterEnded = false;
  const frontmatterPattern = /^\s*([a-z_]+):\s*(.*)\s*$/i;

  // Split content into lines
  const lines = content.split("\n");

  // Check if the content starts with triple quotes
  if (lines[0].trim() !== '"""') {
    return {};
  }

  frontmatterStarted = true;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('"""')) {
      if (frontmatterStarted) {
        frontmatterEnded = true;
        break;
      }
    }

    if (frontmatterStarted && !frontmatterEnded) {
      const match = frontmatterPattern.exec(line);
      if (match) {
        const [, key, value] = match;
        frontmatter[key.trim()] = value.trim();
      }
    }
  }

  return frontmatter;
};

// Function to determine the best matching language
export const bestMatchingLanguage = (
  supportedLanguages: any,
  preferredLanguages: any,
  defaultLocale: any,
) => {
  const languages = supportedLanguages.map((lang: any) => lang.code);

  const match = preferredLanguages
    .map((prefLang: any) =>
      languages.find((lang: any) => lang.startsWith(prefLang)),
    )
    .find(Boolean);

  console.log(languages, preferredLanguages, match, defaultLocale);
  return match || defaultLocale;
};

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return "Invalid credentials!";
    case ResultCode.InvalidSubmission:
      return "Invalid submission, please try again!";
    case ResultCode.UserAlreadyExists:
      return "User already exists, please log in!";
    case ResultCode.UserCreated:
      return "User created, welcome!";
    case ResultCode.UnknownError:
      return "Something went wrong, please try again!";
    case ResultCode.UserLoggedIn:
      return "Logged in!";
  }
};

export const fromAIMessage = (message: Message): IChatMessage => {
  let type = "human";
  switch (message.role) {
    case "user":
      type = "human";
      break;
    case "assistant":
      type = "ai";
      break;
    case "system": {
      type = "system";
      break;
    }
  }
  return {
    id: message.id || "",
    content: message.content,
    createdAt: new Date(),
    role: type as ChatMesageType,
    metadata: {},
  };
};

export const toAIMessage = (message: IChatMessage): Message => {
  switch (message.role) {
    case "human":
      return {
        id: message.id || "",
        content: message.content,
        createdAt: new Date(),
        role: "user",
      };
    case "ai":
      return {
        id: message.id || "",
        content: message.content,
        createdAt: new Date(),
        role: "assistant",
      };
    case "system": {
      return {
        id: message.id || "",
        content: message.content,
        createdAt: new Date(),
        role: "system",
      };
    }
    default:
      throw new Error("Invalid message type");
  }
};
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
    num,
  );
};

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  let toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}
export function parseTextWithLinks(
  text: string,
): Array<{ type: "text" | "link"; content: string }> {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return { type: "link", content: part };
    }
    return { type: "text", content: part };
  });
}
