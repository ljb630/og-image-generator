import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises"; // Use async file operations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticFolder = path.join(__dirname, "../static");

/**
 * Returns the absolute path from a relative path
 * @param {string} relativePath - Path relative to the main file
 * @returns {string} Absolute path
 */
export function getAbsolutePath(relativePath) {
  return path.join(__dirname, relativePath);
}

/**
 * Returns the contents of a file asynchronously
 * @param {string} fileName - Relative path to static folder
 * @returns {Promise<string>} Contents of static/{fileName} as a string
 */
export async function getStaticFile(fileName) {
  try {
    // Read the file asynchronously and convert it to a string
    const fileContent = await fs.readFile(path.join(staticFolder, fileName), "utf-8");
    return fileContent;
  } catch (error) {
    // Handle errors here, e.g., by returning a default value or rethrowing the error.
    console.error(`Error reading ${fileName}:`, error);
    throw error;
  }
}

/**
 * Interpolates a string with dynamic values
 * @param {string} template - String with placeholders
 * @param {Record<string, string | undefined>} values - Values to interpolate
 * @returns {string} Interpolated string
 */
export function interpolate(template, values) {
  // Replace placeholders in the template with corresponding values
  return template.replace(/{{([^}]+)}}/g, (_, key) => values[key] || "");
}

/**
 * Get SVG path for Heroicons icon asynchronously
 * @param {string} name - Icon name
 * @param {import("axios").AxiosInstance} httpClient - Axios instance for making HTTP requests
 * @returns {Promise<string>} <path> element of the icon
 */
export async function getIcon(name, httpClient = axios) {
  const iconUrl = `https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/24/outline/${name}.svg`;

  try {
    // Fetch the icon SVG from the URL
    const response = await httpClient.get(iconUrl);
    const iconSvg = response.data;

    // Extract and enhance the SVG paths
    const paths = iconSvg.split("\n").filter((line) => line.includes("<path"));

    const pathsDesigned = paths.map((path) => {
      const pathUnfinished = path.split("/>")[0];
      const pathImprovements = [];

      // Check and add missing attributes
      if (!pathUnfinished.includes("stroke=")) {
        pathImprovements.push('stroke="url(#paint1_linear_0_1)"');
      }

      if (!pathUnfinished.includes("stroke-linejoin=")) {
        pathImprovements.push('stroke-linejoin="round"');
      }

      if (!pathUnfinished.includes("stroke-linecap=")) {
        pathImprovements.push('stroke-linecap="round"');
      }

      if (!pathUnfinished.includes("stroke-width=")) {
        pathImprovements.push('stroke-width="1"');
      }

      if (!pathUnfinished.includes("transform=")) {
        pathImprovements.push(
          'transform="matrix(25 0 0 25 25 0) translate(22, 0)"',
        );
      }

      return pathUnfinished + " " + pathImprovements.join(" ") + " />";
    });

    // Return the enhanced SVG path
    return pathsDesigned.join("\n");
  } catch (error) {
    // Handle errors here, e.g., by returning a default icon or rethrowing the error.
    console.error(`Error fetching ${name} icon:`, error);
    throw error;
  }
}

/**
 * Uppercase the first letter of a text
 * @param {string} text - Text to uppercase
 * @returns {string} Uppercased text
 */
export function uppercaseFirst(text) {
  // Uppercase the first letter using charAt and slice
  return text.charAt(0).toUpperCase() + text.slice(1);
}
