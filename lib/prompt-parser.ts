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

export type TemplateSegment =
  | { type: 'text'; content: string }
  | { type: 'variable'; name: string };

export function parseTemplateSegments(template: string): TemplateSegment[] {
  const segments: TemplateSegment[] = [];
  let lastIndex = 0;
  const regex = /\{\{(\w+)\}\}/g;
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: template.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'variable', name: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    segments.push({ type: 'text', content: template.slice(lastIndex) });
  }
  return segments;
}
