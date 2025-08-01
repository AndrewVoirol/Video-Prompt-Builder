#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import puppeteer, { Browser, Page } from 'puppeteer';

// MCP Server for Puppeteer automation
class PuppeteerMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private pages: Map<string, Page> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'launch_browser',
          description: 'Launch a new browser instance',
          inputSchema: {
            type: 'object',
            properties: {
              headless: {
                type: 'boolean',
                description: 'Run browser in headless mode',
                default: true,
              },
            },
          },
        },
        {
          name: 'new_page',
          description: 'Create a new page/tab',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Unique identifier for the page',
              },
            },
            required: ['pageId'],
          },
        },
        {
          name: 'navigate',
          description: 'Navigate to a URL',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              url: {
                type: 'string',
                description: 'URL to navigate to',
              },
            },
            required: ['pageId', 'url'],
          },
        },
        {
          name: 'screenshot',
          description: 'Take a screenshot',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              path: {
                type: 'string',
                description: 'Path to save the screenshot',
              },
              fullPage: {
                type: 'boolean',
                description: 'Capture full page',
                default: false,
              },
            },
            required: ['pageId', 'path'],
          },
        },
        {
          name: 'click',
          description: 'Click an element',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              selector: {
                type: 'string',
                description: 'CSS selector for the element',
              },
            },
            required: ['pageId', 'selector'],
          },
        },
        {
          name: 'type',
          description: 'Type text into an input',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              selector: {
                type: 'string',
                description: 'CSS selector for the input',
              },
              text: {
                type: 'string',
                description: 'Text to type',
              },
            },
            required: ['pageId', 'selector', 'text'],
          },
        },
        {
          name: 'wait_for_selector',
          description: 'Wait for an element to appear',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              selector: {
                type: 'string',
                description: 'CSS selector to wait for',
              },
              timeout: {
                type: 'number',
                description: 'Timeout in milliseconds',
                default: 30000,
              },
            },
            required: ['pageId', 'selector'],
          },
        },
        {
          name: 'close_page',
          description: 'Close a page',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier to close',
              },
            },
            required: ['pageId'],
          },
        },
        {
          name: 'close_browser',
          description: 'Close the browser',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'evaluate',
          description: 'Execute JavaScript code in the page context',
          inputSchema: {
            type: 'object',
            properties: {
              pageId: {
                type: 'string',
                description: 'Page identifier',
              },
              expression: {
                type: 'string',
                description: 'JavaScript expression to evaluate',
              },
            },
            required: ['pageId', 'expression'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new Error('No arguments provided');
      }

      try {
        switch (name) {
          case 'launch_browser': {
            if (this.browser) {
              return { content: [{ type: 'text', text: 'Browser already launched' }] };
            }
            this.browser = await puppeteer.launch({
              headless: args.headless !== false,
            });
            return { content: [{ type: 'text', text: 'Browser launched successfully' }] };
          }

          case 'new_page': {
            if (!this.browser) {
              throw new Error('Browser not launched. Call launch_browser first.');
            }
            const page = await this.browser.newPage();
            this.pages.set(args.pageId as string, page);
            
            // Set up console logging
            page.on('console', (msg) => {
              console.error(`[${args.pageId}] Console:`, msg.text());
            });
            
            return { content: [{ type: 'text', text: `Page created: ${args.pageId}` }] };
          }

          case 'navigate': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.goto(args.url as string);
            return { content: [{ type: 'text', text: `Navigated to ${args.url}` }] };
          }

          case 'screenshot': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.screenshot({
              path: args.path as `${string}.png`,
              fullPage: args.fullPage as boolean || false,
            });
            return { content: [{ type: 'text', text: `Screenshot saved to ${args.path}` }] };
          }

          case 'click': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.click(args.selector as string);
            return { content: [{ type: 'text', text: `Clicked ${args.selector}` }] };
          }

          case 'type': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.type(args.selector as string, args.text as string);
            return { content: [{ type: 'text', text: `Typed text into ${args.selector}` }] };
          }

          case 'wait_for_selector': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.waitForSelector(args.selector as string, {
              timeout: (args.timeout as number) || 30000,
            });
            return { content: [{ type: 'text', text: `Element appeared: ${args.selector}` }] };
          }

          case 'close_page': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            await page.close();
            this.pages.delete(args.pageId as string);
            return { content: [{ type: 'text', text: `Page closed: ${args.pageId}` }] };
          }

          case 'close_browser': {
            if (this.browser) {
              await this.browser.close();
              this.browser = null;
              this.pages.clear();
              return { content: [{ type: 'text', text: 'Browser closed' }] };
            }
            return { content: [{ type: 'text', text: 'No browser to close' }] };
          }

          case 'evaluate': {
            const page = this.pages.get(args.pageId as string);
            if (!page) {
              throw new Error(`Page not found: ${args.pageId}`);
            }
            const result = await page.evaluate(args.expression as string);
            return { content: [{ type: 'text', text: JSON.stringify(result) }] };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Puppeteer MCP server running...');
  }
}

// Start the server
const server = new PuppeteerMCPServer();
server.run().catch(console.error);
