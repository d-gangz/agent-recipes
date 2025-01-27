import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { PARALLEL_PROMPTS, AGGREGATOR_PROMPT } from "./prompts"

// parallelisation is used to run multiple LLM calls in parallel to speed up the process. Input is passed through LLMs in parallel to process and finally and aggregated to form the final output. Each LLM is given the same input and the output is aggregated to form the final output.

export async function processProductDescription(productDescription: string) {
  const separator = "=".repeat(80)
  const subSeparator = "-".repeat(40)

  console.log(`\n${separator}`)
  console.log("🔄 Starting Product Description Processing")
  console.log(separator)

  console.log("\n📝 Input Product Description:")
  console.log(subSeparator)
  console.log(productDescription)
  console.log(subSeparator)

  // 1. Prepare the prompts for each parallel call
  console.log("\n🎯 Running Parallel Analysis...")
  console.log(subSeparator)

  const featuresPrompt = PARALLEL_PROMPTS.featuresPrompt.replace(
    "[PRODUCT_DESCRIPTION]",
    productDescription
  )
  const benefitsPrompt = PARALLEL_PROMPTS.benefitsPrompt.replace(
    "[PRODUCT_DESCRIPTION]",
    productDescription
  )
  const targetAudiencePrompt = PARALLEL_PROMPTS.targetAudiencePrompt.replace(
    "[PRODUCT_DESCRIPTION]",
    productDescription
  )

  const [featuresResult, benefitsResult, targetAudienceResult] =
    await Promise.all([
      generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: featuresPrompt
      }),
      generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: benefitsPrompt
      }),
      generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: targetAudiencePrompt
      })
    ])

  console.log("\n📋 Features Analysis:")
  console.log(subSeparator)
  console.log(featuresResult.text)
  console.log(subSeparator)

  console.log("\n💡 Benefits Analysis:")
  console.log(subSeparator)
  console.log(benefitsResult.text)
  console.log(subSeparator)

  console.log("\n👥 Target Audience Analysis:")
  console.log(subSeparator)
  console.log(targetAudienceResult.text)
  console.log(subSeparator)

  console.log("\n✅ All Parallel Analyses Complete")
  console.log(subSeparator)

  // 3. Prepare the aggregator prompt
  const aggregatorPrompt = AGGREGATOR_PROMPT.replace(
    "[PRODUCT_DESCRIPTION]",
    productDescription
  )
    .replace("[FEATURES_SECTION]", featuresResult.text)
    .replace("[BENEFITS_SECTION]", benefitsResult.text)
    .replace("[TARGET_AUDIENCE_SECTION]", targetAudienceResult.text)

  // 4. Get final combined description
  const finalResult = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: aggregatorPrompt
  })

  console.log("\n🎉 Final Combined Description:")
  console.log(subSeparator)
  console.log(finalResult.text)
  console.log(subSeparator)

  return finalResult.text
}

// Example usage
const exampleProduct = `
  AuraSonic Pro: A premium noise-canceling headphones featuring advanced hybrid noise cancellation, 
  crystal-clear audio with custom-tuned drivers, comfortable over-ear design with plush earcups, 
  Bluetooth 5.2 connectivity, and a long-lasting battery with up to 30 hours of playtime. 
  Target customers are professionals, travelers, and audiophiles.
`

// Update the example usage section
async function main() {
  const mainSeparator = "*".repeat(100)
  console.log(mainSeparator)
  console.log("🤖 Starting Product Description Processing System...")
  console.log(mainSeparator)

  try {
    await processProductDescription(exampleProduct)
    console.log(`\n${mainSeparator}`)
    console.log("✅ Processing complete.")
    console.log(mainSeparator)
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

// Uncomment to test
main().catch(console.error)
