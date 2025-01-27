import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { generateObject, generateText } from "ai"
import { z } from "zod"
import {
  AGGREGATOR_PROMPT,
  ORCHESTRATOR_PROMPT,
  RAW_INPUT,
  WORKER_PROMPT_FORMAT
} from "./prompts"

// For the orchestrator, we need to create a schema for the output. We use the generateObject function to get the output. We will map over the tasks and use the generateText function to get the output for each task. Then we use promise.all to get the output for all the tasks. Finally, we will use the generateText function to get the output for the aggregator.

/* 
For orchestrator, we can do a few types:
1. central LLM breaks down the tasks and generates prompts for each worker LLM to execute the task.
2. central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results.  
*/

// Schema for the orchestrator's output
const WorkerTaskSchema = z.object({
  worker_id: z.string(),
  input: z.string(),
  prompt: z.string()
})

const OrchestratorSchema = z.array(WorkerTaskSchema)

// Main orchestrator function
export async function orchestrateContentPlan(input: string) {
  const separator = "=".repeat(80)
  const subSeparator = "-".repeat(40)

  console.log(`\n${separator}`)
  console.log("🔄 Starting Content Plan Orchestration")
  console.log(separator)

  console.log("\n📝 Raw Input:")
  console.log(subSeparator)
  console.log(input)
  console.log(subSeparator)

  // Step 1: Get tasks from orchestrator
  console.log("\n🎯 Getting Tasks from Orchestrator...")
  console.log(subSeparator)

  const { object: tasks } = await generateObject({
    model: google("gemini-2.0-flash-exp"),
    schema: OrchestratorSchema,
    prompt: ORCHESTRATOR_PROMPT.replace("{input}", input)
  })

  console.log("📋 Generated Tasks:")
  console.log(subSeparator)
  console.log(JSON.stringify(tasks, null, 2))
  console.log(subSeparator)

  // Step 2: Process each task with workers
  console.log("\n👥 Processing Tasks with Workers...")
  console.log(subSeparator)

  const workerOutputs = await Promise.all(
    tasks.map(async task => {
      console.log(`Processing Worker ${task.worker_id}...`)
      const workerPrompt = WORKER_PROMPT_FORMAT.replace(
        "{input}",
        task.input
      ).replace("{prompt}", task.prompt)

      const { text: output } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: workerPrompt
      })

      console.log(`Worker ${task.worker_id} Output:`)
      console.log(output)
      console.log(subSeparator)

      return {
        worker_id: task.worker_id,
        output
      }
    })
  )

  // Step 3: Aggregate results
  console.log("\n🔄 Aggregating Results...")
  console.log(subSeparator)

  const aggregatorPrompt = AGGREGATOR_PROMPT.replace(
    "{workerOutputs}",
    workerOutputs
      .map(wo => `Worker ${wo.worker_id}:\n${wo.output}\n-------------------\n`)
      .join("\n")
  )

  const { text: finalPlan } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: aggregatorPrompt
  })

  console.log("\n🎉 Final Content Plan:")
  console.log(subSeparator)
  console.log(finalPlan)
  console.log(subSeparator)

  return {
    plan: finalPlan,
    details: {
      tasks,
      workerOutputs
    }
  }
}

async function main() {
  const mainSeparator = "*".repeat(100)
  console.log(mainSeparator)
  console.log("🤖 Starting Content Plan Orchestration System...")
  console.log(mainSeparator)

  await orchestrateContentPlan(RAW_INPUT)
  console.log(`\n${mainSeparator}`)
  console.log("✅ Processing complete.")
  console.log(mainSeparator)
}

// Uncomment to test
main()
