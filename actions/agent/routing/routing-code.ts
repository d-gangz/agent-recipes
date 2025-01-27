import { groq } from "@ai-sdk/groq"
import { generateText, generateObject } from "ai"
import {
  ROUTER_PROMPT,
  BILLING_PROMPT,
  RETURNS_PROMPT,
  GENERAL_PROMPT
} from "./prompts"

// utilised useobject for the LLM routing to ensure that output is definitely one of the categories. Pass them through a switch case to route them to the correct specialized LLM. Then use generateText for the specialized LLM responses.

// Sample inputs
const rawInputs = [
  "I was charged twice for my subscription this month. The first charge was on March 1st for $49.99, and another on March 5th. How do I get a refund for the duplicate charge?",
  "The wireless headphones I bought last month stopped working. The right earbud won't charge anymore. Can I exchange these for a new pair?",
  "How do I update my email address on file? Also, where can I find your privacy policy?"
]

// Router categories type
type Category = "Billing/Refund Request" | "Product Return" | "General Inquiry"

// Process a single input through the routing workflow
async function processInput(input: string, index: number) {
  const separator = "=".repeat(80)
  const subSeparator = "-".repeat(40)

  console.log(`\n${separator}`)
  console.log(`Input #${index + 1}`)
  console.log(separator)

  console.log("\n📝 Raw Input:")
  console.log(subSeparator)
  console.log(input)
  console.log(subSeparator)

  // Step 1: Route the input using the router LLM
  const { object: category } = await generateObject<Category>({
    // object: category is just renaming the output to "category".
    model: groq("llama-3.1-8b-instant"),
    output: "enum",
    enum: ["Billing/Refund Request", "Product Return", "General Inquiry"],
    prompt: ROUTER_PROMPT.replace("{{input}}", input)
  })

  console.log("\n🔄 Routed Category:")
  console.log(subSeparator)
  console.log(category)
  console.log(subSeparator)

  // Step 2: Process with specialized LLM based on category
  let response: string
  // using switch case to handle the different categories
  switch (category) {
    case "Billing/Refund Request":
      response = await handleBillingRequest(input)
      break
    case "Product Return":
      response = await handleReturnRequest(input)
      break
    case "General Inquiry":
      response = await handleGeneralInquiry(input)
      break
    default:
      response = "Error: Invalid category"
  }

  console.log("\n💬 Response:")
  console.log(subSeparator)
  console.log(response)
  console.log(subSeparator)
}

// Specialized handlers
async function handleBillingRequest(input: string): Promise<string> {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: BILLING_PROMPT.replace("{{input}}", input)
  })
  return text
}

async function handleReturnRequest(input: string): Promise<string> {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: RETURNS_PROMPT.replace("{{input}}", input)
  })
  return text
}

async function handleGeneralInquiry(input: string): Promise<string> {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: GENERAL_PROMPT.replace("{{input}}", input)
  })
  return text
}

// Main function to process all inputs
async function main() {
  const mainSeparator = "*".repeat(100)
  console.log(mainSeparator)
  console.log("🤖 Starting Customer Service Routing System...")
  console.log(mainSeparator)

  for (let i = 0; i < rawInputs.length; i++) {
    await processInput(rawInputs[i], i)
  }

  console.log(`\n${mainSeparator}`)
  console.log("✅ Processing complete for all inputs.")
  console.log(mainSeparator)
}

// Run the system
main().catch(console.error)
