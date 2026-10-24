import { describe, expect, it } from 'vitest';
import { renderQuestion } from '@/content/rendered';
import { QuestionSchema } from '@/content/schema';

describe('renderQuestion', () => {
  it('typesets maths in the expected-answer line and escapes units', () => {
    const q = QuestionSchema.parse({
      id: 'q',
      format: 'numeric',
      prompt: 'Find it.',
      explanation: 'Because.',
      difficulty: 1,
      objectives: ['1.1.1'],
      fields: [
        { label: '$\\dfrac{d^2y}{dx^2}$ =', answer: -0.125 },
        { label: 'x =', answer: 3, unit: '<m>' },
      ],
    });
    const html = renderQuestion(q, 'l').reveal.expectedHtml!;
    expect(html).toContain('class="katex"');
    expect(html).not.toContain('$');
    expect(html).toContain('-0.125');
    expect(html).toContain('x = 3 &lt;m&gt;');
  });
});
