import { deepseek } from "@ai-sdk/deepseek"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

async function orchestrator() {
  const separator = "=".repeat(80)
  const subSeparator = "-".repeat(40)

  console.log(`\n${separator}`)
  console.log("🔄 Starting Orchestration Workflow Example")
  console.log(separator)

  const { text, reasoning, usage } = await generateText({
    // model: deepseek("deepseek-reasoner"),
    model: groq("deepseek-r1-distill-llama-70b"),
    prompt: `
  You are an experienced product manager.
  I need your help to give me examples with sample input and prompts to illustrate an orchestration workflow.
  In the orchestrator-workers workflow, a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results.
  When to use this workflow: This workflow is well-suited for complex tasks where you can’t predict the subtasks needed (in coding, for example, the number of files that need to be changed and the nature of the change in each file likely depend on the task). Whereas it’s topographically similar, the key difference from parallelization is its flexibility—subtasks aren't pre-defined, but determined by the orchestrator based on the specific input.
  `
  })

  console.log("\n🤔 Reasoning:")
  console.log(subSeparator)
  console.log(reasoning)
  console.log(subSeparator)

  console.log("\n📝 Generated Example:")
  console.log(subSeparator)
  console.log(text)
  console.log(subSeparator)

  console.log("\n💰 Usage:")
  console.log(subSeparator)
  console.log(usage)
  console.log(subSeparator)

  console.log(`\n${separator}`)
  console.log("✅ Orchestration Workflow Example Completed")
  console.log(separator)
}

orchestrator().catch(console.error)
