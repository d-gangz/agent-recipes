export const EXTRACT_REQUIREMENTS_PROMPT = `
Analyze this job description and list all required skills, qualifications, and experience in a structured format.

Return the response in this JSON format:
{
  "skills": string[],
  "qualifications": string[],
  "experience": string[]
}
`

export const CREATE_SCREENING_CRITERIA_PROMPT = `
Based on these requirements, generate specific evaluation criteria that can be used to score candidates.

Requirements: {{requirements}}

Return the response in this JSON format:
{
  "technicalCriteria": {
    "criteriaName": string,
    "weight": number,
    "description": string
  }[],
  "softSkillsCriteria": {
    "criteriaName": string,
    "weight": number,
    "description": string
  }[]
}
`

export const GENERATE_SCREENING_QUESTIONS_PROMPT = `
Create a set of specific screening questions that will help evaluate candidates against these criteria.

Evaluation Criteria: {{criteria}}

Return the response in this JSON format:
{
  "technicalQuestions": {
    "question": string,
    "purpose": string,
    "relatedCriteria": string[]
  }[],
  "behavioralQuestions": {
    "question": string,
    "purpose": string,
    "relatedCriteria": string[]
  }[]
}
`
