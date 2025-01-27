export const PARALLEL_PROMPTS = {
  featuresPrompt: `
    You are an expert product copywriter focusing on technical specifications.

    Based on the following product information for "[PRODUCT_DESCRIPTION]", generate a bulleted list of its key *features*. Be concise and factual.

    Product Information: [PRODUCT_DESCRIPTION]
    Use code with caution.
  `,

  benefitsPrompt: `
    You are an expert marketing copywriter skilled at highlighting customer benefits.

    Based on the following product information for "[PRODUCT_DESCRIPTION]", generate a bulleted list of its key *benefits* for the user. Focus on how these features (implied in the description) improve the user's experience. Write in a persuasive and engaging tone.

    Product Information: [PRODUCT_DESCRIPTION]
    Use code with caution.
  `,

  targetAudiencePrompt: `
    You are a marketing expert specializing in customer profiling.

    Based on the description of "[PRODUCT_DESCRIPTION]", identify and describe the ideal target audience for this product. Consider their needs, pain points, and motivations for purchasing this type of product. Be specific and provide details about who these customers are.

    Product Description: [PRODUCT_DESCRIPTION]
    Use code with caution.
  `
}

export const AGGREGATOR_PROMPT = `
  You are an expert product description writer.

  You have been provided with three independent sections of content for a product description for the product described as "[PRODUCT_DESCRIPTION]": Features, Benefits, and Target Audience.

  Your task is to combine these sections into a cohesive and compelling product description that is ready for use on a website or marketing materials. Ensure the description flows smoothly, is engaging, and clearly communicates the value proposition of the product to the target audience. Start with a catchy headline or introductory sentence that introduces the product. Then, logically integrate the features and benefits, and finally, address the target audience. Make sure the description reads naturally and avoids sounding like just a list of disconnected points.

  Sections Provided:
  Features: [FEATURES_SECTION]
  Benefits: [BENEFITS_SECTION]
  Target Audience: [TARGET_AUDIENCE_SECTION]

  Use code with caution.
`
