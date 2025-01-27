export const RAW_INPUT = `Generate a comprehensive content marketing plan for a new SaaS product that help users generate images. It is aimed at freelance graphic designers.`

export const ORCHESTRATOR_PROMPT = `You are the Orchestrator. Read the raw input and break it into subtasks. Each subtask should be a single task that can be completed by a worker and the input is based on the raw input and not depending on the output of the other subtasks.

Then, create a JSON array (with 3 elements) for the worker prompts. Each element should include:
- An 'input' key, referencing the relevant portion of the raw input or any additional instructions
- A 'prompt' key, describing what the worker should specifically do with that input

Provide the necessary prompts to three workers in the correct JSON structure.

Raw Input: ${RAW_INPUT}`

export const WORKER_PROMPT_FORMAT = `You are a Worker LLM. Below is your assigned subtask from the Orchestrator. 
Perform the requested task and provide your output.

Subtask Input: {input}
Subtask Prompt: {prompt}

Begin working on your subtask now. Include all relevant details, analysis, or recommendations in your response.`

export const AGGREGATOR_PROMPT = `You are the Aggregator. You will receive the outputs from the three Worker LLMs. Combine their responses into one cohesive final output: a comprehensive content marketing plan. 

Structure it based on the output of the workers.

Worker Outputs:
{workerOutputs}

Aim to ensure the final plan flows logically and cohesively. Add or refine any points if necessary to maintain clarity, completeness, and consistency.`
