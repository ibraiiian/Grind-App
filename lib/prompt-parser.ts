/**
 * GRIND App — Prompt Variable Parser
 * Source: PRD v2.0 Section 7.4
 *
 * Handles {{variable}} extraction and template filling
 * for the AI Prompt Vault Fill & Copy feature.
 */

/**
 * Extracts unique variable names from a prompt template.
 * Variables are denoted by {{variableName}} syntax.
 *
 * @example
 * parseVariables('Hello {{name}}, welcome to {{course}}!')
 * // → ['name', 'course']
 *
 * parseVariables('{{topic}} is about {{topic}}')
 * // → ['topic']  (deduplicated)
 *
 * parseVariables('No variables here')
 * // → []
 */
export function parseVariables(template: string): string[] {
  const matches = [...template.matchAll(/\{\{(\w+)\}\}/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

/**
 * Fills a prompt template by replacing {{variable}} placeholders
 * with provided values.
 *
 * Missing values default to empty string.
 *
 * @example
 * fillTemplate(
 *   'Explain {{topic}} for {{audience}}',
 *   { topic: 'React Native', audience: 'beginners' }
 * )
 * // → 'Explain React Native for beginners'
 *
 * fillTemplate(
 *   'Hello {{name}}, your {{field}} is great',
 *   { name: 'Ibrahim' }
 * )
 * // → 'Hello Ibrahim, your  is great'  (missing field → empty)
 */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}
