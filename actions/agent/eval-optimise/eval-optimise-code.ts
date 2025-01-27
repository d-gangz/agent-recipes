// import { groq } from "@ai-sdk/groq"
import { google } from "@ai-sdk/google"
import { generateText, generateObject } from "ai"
import { z } from "zod"
import { topic, generatorPrompt, evaluatorPrompt } from "./prompts"

// Define the evaluation response schema
const evaluationSchema = z.object({
  status: z.enum(["PASS", "FAIL"]),
  feedback: z.string()
})

/**
 * Generates a LinkedIn post and iteratively improves it based on evaluator feedback
 * @returns The final generated post and its evaluation
 */
export async function generateAndOptimizePost() {
  const separator = "=".repeat(80)
  const subSeparator = "-".repeat(40)

  console.log(`\n${separator}`)
  console.log("🔄 Starting LinkedIn Post Generation & Optimization")
  console.log(separator)

  console.log("\n📝 Topic:")
  console.log(subSeparator)
  console.log(topic)
  console.log(subSeparator)

  let currentPost = ""
  let evaluatorFeedback = ""
  let attempts = 0
  const MAX_ATTEMPTS = 3

  while (attempts < MAX_ATTEMPTS) {
    attempts++
    console.log(`\n🎯 Attempt ${attempts} of ${MAX_ATTEMPTS}`)
    console.log(subSeparator)

    // Generate post
    const prompt = generatorPrompt
      .replace("{{topic}}", topic)
      .replace("{{evaluator_feedback}}", evaluatorFeedback)

    const { text: generatedPost } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt
    })

    currentPost = generatedPost
    console.log("\n📊 Generated Post:")
    console.log(subSeparator)
    console.log(currentPost)
    console.log(subSeparator)

    // Evaluate post
    const evaluationPrompt = evaluatorPrompt
      .replace("{{topic}}", topic)
      .replace("{{generated_post}}", currentPost)

    const { object: evaluation } = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      schema: evaluationSchema,
      prompt: evaluationPrompt
    })

    console.log("\n🔍 Evaluation Results:")
    console.log(subSeparator)
    console.log(`Status: ${evaluation.status}`)
    console.log(`Feedback: ${evaluation.feedback}`)
    console.log(subSeparator)

    if (evaluation.status === "PASS") {
      console.log("\n✅ Post Passed Evaluation!")
      return {
        finalPost: currentPost,
        evaluation: evaluation,
        attempts
      }
    }

    console.log("\n🔄 Incorporating feedback for next iteration...")
    evaluatorFeedback = evaluation.feedback
  }

  console.log("\n⚠️ Max attempts reached without achieving PASS status")
  return {
    finalPost: currentPost,
    evaluation: {
      status: "FAIL",
      feedback: "Max attempts reached without achieving PASS status"
    },
    attempts
  }
}

async function main() {
  const mainSeparator = "*".repeat(100)
  console.log(mainSeparator)
  console.log("🤖 Starting LinkedIn Post Generation System...")
  console.log(mainSeparator)

  try {
    const result = await generateAndOptimizePost()
    console.log(`\n${mainSeparator}`)
    console.log("📋 Final Results:")
    console.log("-".repeat(40))
    console.log("Final Post:", result.finalPost)
    console.log("Evaluation:", result.evaluation)
    console.log("Total Attempts:", result.attempts)
    console.log(`\n${mainSeparator}`)
    console.log("✅ Process complete.")
    console.log(mainSeparator)
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

main().catch(console.error)
