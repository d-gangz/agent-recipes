import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import {
  CREATE_SCREENING_CRITERIA_PROMPT,
  EXTRACT_REQUIREMENTS_PROMPT,
  GENERATE_SCREENING_QUESTIONS_PROMPT
} from "./prompts"

// Reusable LLM response generator
async function generateLLMResponse(prompt: string) {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt
  })
  return text
}

async function promptChain(jobDescription: string) {
  console.log("\n" + "=".repeat(50))
  console.log("🚀 Starting Prompt Chain")
  console.log("=".repeat(50) + "\n")

  // Step 1: Extract requirements
  console.log("📋 Step 1: Extracting requirements...")
  const requirements = await generateLLMResponse(
    `${EXTRACT_REQUIREMENTS_PROMPT}\n\nJob Description: ${jobDescription}`
  )
  console.log("\nRequirements:", requirements)

  // Step 2: Create screening criteria
  console.log("🎯 Step 2: Creating screening criteria...")
  const screeningCriteria = await generateLLMResponse(
    CREATE_SCREENING_CRITERIA_PROMPT.replace("{{requirements}}", requirements)
  )
  console.log("\nScreening Criteria:", screeningCriteria)

  // Step 3: Generate screening questions
  console.log("❓ Step 3: Generating screening questions...")
  const screeningQuestions = await generateLLMResponse(
    GENERATE_SCREENING_QUESTIONS_PROMPT.replace(
      "{{criteria}}",
      screeningCriteria
    )
  )
  console.log("\nScreening Questions:", screeningQuestions)

  console.log("=".repeat(50))
  console.log("✅ Prompt Chain Completed")
  console.log("=".repeat(50) + "\n")

  return {
    requirements,
    screeningCriteria,
    screeningQuestions
  }
}

// Example usage
const jobDescription = `
Senior Product Manager - AI/ML Division

We are seeking an experienced Product Manager to lead our AI/ML initiatives. The ideal candidate will have:
- 5+ years of product management experience
- Track record of launching ML-powered products
- Strong technical background in AI/ML concepts
- MBA or equivalent advanced degree
- Experience with agile development methodologies

Responsibilities:
- Lead product strategy and roadmap
- Collaborate with data science teams
- Drive product development from conception to launch
- Manage stakeholder relationships
`

promptChain(jobDescription)
