import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as Priompt from "./lib";
import { isChatPrompt, promptHasFunctions, render } from "./lib";
import { Function, SystemMessage, UserMessage } from "./components";
import { PromptElement, PromptProps } from "./types";

describe("SystemMessage", () => {
  function TestSystemMessage(props: PromptProps): PromptElement {
    return <SystemMessage>hi this is a system message</SystemMessage>;
  }

  it("should create a chat message", () => {
    const rendered = render(TestSystemMessage({}), {
      tokenLimit: 1000,
      tokenizer: "cl100k_base",
    });
    expect(isChatPrompt(rendered.prompt)).toBe(true);
  });
});

describe("Function", () => {
  function TestFunction(props: PromptProps): PromptElement {
    return (
      <>
        <Function
          name={"echo"}
          description={"Echo a message to the user."}
          parameters={{
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The message to echo.",
              },
            },
            required: ["message"],
          }}
        />
        <UserMessage>say hi</UserMessage>
      </>
    );
  }

  it("should create a function message", () => {
    const rendered = render(TestFunction({}), {
      tokenLimit: 1000,
      tokenizer: "cl100k_base",
    });
    expect(isChatPrompt(rendered.prompt)).toBe(true);
    expect(promptHasFunctions(rendered.prompt)).toBe(true);
    if (!promptHasFunctions(rendered.prompt)) return;
    expect(rendered.prompt.functions).toEqual([
      {
        name: "echo",
        description: "Echo a message to the user.",
        parameters: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to echo.",
            },
          },
          required: ["message"],
        },
      },
    ]);
  });
});
