import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import * as fs from "fs";
import * as path from "path";
import { parse as tsParse } from "@typescript-eslint/typescript-estree";
import { ignoredPaths } from "../constants";

// Define the structure of a route object
interface Route {
  method: string;
  path: string;
  middleware: string[];
  params: string[];
}

// Define the structure of the output
interface ParsedController {
  routes: Route[];
}

/**
 * Check if the project contains TypeScript files.
 * @param directory - The root directory of the project.
 * @returns true if TypeScript files are detected, false otherwise.
 */
function isTypeScriptProject(directory: string): boolean {
  const files = fs.readdirSync(directory);
  return files.some((file) => file.endsWith(".ts") || file.endsWith(".tsx"));
}

/**
 * Parse a controller file to extract route information.
 * @param code - The source code of the file.
 * @param isTs - Whether the file is TypeScript.
 * @returns ParsedController containing routes information.
 */
function parseController(code: string, isTs: boolean): ParsedController {
  const ast = isTs
    ? tsParse(code, {
        loc: true,
        range: true,
        tokens: true,
        ecmaVersion: "latest",
      })
    : (acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
      }) as acorn.Node);

  const routes: Route[] = [];

  acornWalk.simple(ast as acorn.Node, {
    CallExpression(node: any) {
      if (isExpressRoute(node)) {
        const route: Route = {
          method: getRouteMethod(node),
          path: getRoutePath(node),
          middleware: getMiddleware(node),
          params: getRouteParams(node),
        };
        routes.push(route);
      }
    },
    // Add a fallback for unknown node types
    // This prevents errors when we encounter node types like interfaces, type aliases, etc.
    // TypeScript introduces types that do not affect the execution (like interfaces), so we skip them.
    // _: (node: any) => {
    //   if (
    //     node.type &&
    //     [
    //       "TSInterfaceDeclaration",
    //       "TSTypeAliasDeclaration",
    //       "TSEnumDeclaration",
    //     ].includes(node.type)
    //   ) {
    //     return; // Skip TypeScript-only nodes
    //   }
    // },
  });

  return { routes };
}

/**
 * Determine if a node represents an Express.js route definition.
 * @param node - The AST node.
 * @returns true if the node represents a route, false otherwise.
 */
function isExpressRoute(node: any): boolean {
  return (
    node.callee &&
    node.callee.type === "MemberExpression" &&
    ["get", "post", "put", "delete", "patch"].includes(
      node.callee.property?.name
    )
  );
}

/**
 * Extract the HTTP method (e.g., GET, POST) from a route node.
 * @param node - The AST node.
 * @returns The HTTP method as a string.
 */
function getRouteMethod(node: any): string {
  return node.callee.property.name.toUpperCase();
}

/**
 * Extract the path from a route node.
 * @param node - The AST node.
 * @returns The route path as a string.
 */
function getRoutePath(node: any): string {
  return node.arguments[0]?.value || "";
}

/**
 * Extract middleware functions from a route node.
 * @param node - The AST node.
 * @returns An array of middleware function names.
 */
function getMiddleware(node: any): string[] {
  const middleware: string[] = [];

  for (let i = 1; i < node.arguments.length - 1; i++) {
    const arg = node.arguments[i];
    if (arg.type === "Identifier") {
      middleware.push(arg.name);
    }
  }

  return middleware;
}

/**
 * Extract route parameters (e.g., :id) from a route path.
 * @param node - The AST node.
 * @returns An array of parameter names.
 */
function getRouteParams(node: any): string[] {
  const params: string[] = [];
  const path = getRoutePath(node);

  const paramRegex = /:(\w+)/g;
  let match: RegExpExecArray | null;

  while ((match = paramRegex.exec(path)) !== null) {
    params.push(match[1]);
  }

  return params;
}

/**
 * Analyze an entire project directory to extract route information.
 * @param directory - The root directory of the project.
 * @returns ParsedController containing all routes in the project.
 */
function analyzeProject(directory: string): ParsedController {
  try {
    const isTs = isTypeScriptProject(directory);
    const routes: Route[] = [];

    console.log("Routica Analyzing project: ", directory);

    function traverse(dir: string) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);

        // Skip ignored files/folders
        if (ignoredPaths.some((ignored) => filePath.includes(ignored))) {
          return;
        }

        // Only traverse the 'routes' folder and main 'index' or 'app' file
        if (
          !filePath.includes(path.join(directory, "routes")) &&
          !filePath.endsWith("index.js") &&
          !(isTs && filePath.endsWith("index.ts")) &&
          !filePath.endsWith("app.js") &&
          !(isTs && filePath.endsWith("app.ts"))
        ) {
          return;
        }

        console.log("Routica Traversing directory: ", dir);

        if (fs.statSync(filePath).isDirectory()) {
          traverse(filePath); // Recurse into subdirectories
        } else if (file.endsWith(".js") || (isTs && file.endsWith(".ts"))) {
          try {
            const code = fs.readFileSync(filePath, "utf-8");
            const parsed = parseController(code, isTs);
            routes.push(...parsed.routes);
          } catch (fileError: any) {
            // Log the error and continue with other files
            console.error(
              `Routica Error parsing file ${filePath}:`,
              fileError.message
            );
          }
        }
      });
    }

    traverse(directory);
    return { routes };
  } catch (error: any) {
    console.error("Routica Error: ", error.message);
    // You can throw a more specific error or return a default empty structure if needed
    throw new Error("Routica Error analyzing project: " + error.message);
  }
}

export {
  parseController,
  ParsedController,
  Route,
  analyzeProject,
  isTypeScriptProject,
};
