export const PAIRS = ['amazon_nav', 'settings', 'control_center', 'message_inbox'];
export const VARIANTS = ['baseline', 'lefthand', 'onehandmode'] as const;
export type Variant = typeof VARIANTS[number];

export const PROTOTYPE_URLS: Record<string, string> = {
  amazon_nav_baseline:    'https://schmutterers-schmiede.github.io/MA-AmazonMockup-Right-Prolific/',
  amazon_nav_lefthand:    'https://schmutterers-schmiede.github.io/MA-AmazonMockup-Left-Prolific/',
  amazon_nav_onehandmode: 'https://schmutterers-schmiede.github.io/MA-AmazonMockup-Scaled-Prolific/',

  settings_baseline:    'https://schmutterers-schmiede.github.io/MA-MobileSettingsMenu-Right-Prolific/',
  settings_lefthand:    'https://schmutterers-schmiede.github.io/MA-MobileSettingsMenu-Left-Prolific/',
  settings_onehandmode: 'https://schmutterers-schmiede.github.io/MA-MobileSettingsMenu-OneHanded-Prolific/',

  control_center_baseline:    'https://schmutterers-schmiede.github.io/MA-iosControlCenter-Right-Prolific/',
  control_center_lefthand:    'https://schmutterers-schmiede.github.io/MA-iosControlCenter-Left-Prolific/',
  control_center_onehandmode: 'https://schmutterers-schmiede.github.io/MA-iosControlCenter-OneHanded-Prolific/',

  message_inbox_baseline:    'https://schmutterers-schmiede.github.io/MA-Inbox-Right-Prolific/',
  message_inbox_lefthand:    'https://schmutterers-schmiede.github.io/MA-Inbox-Left-Prolific/',
  message_inbox_onehandmode: 'https://schmutterers-schmiede.github.io/MA-Inbox-OneHanded-Prolific/',
};

export function getContext() {
  const params = new URLSearchParams(window.location.search);
  const pid = params.get('pid') ?? '';
  const order = (params.get('order') ?? '').split(',');
  const step = parseInt(params.get('step') ?? '0', 10);
  const grip = params.get('grip') ?? '';
  // Prolific tracking params, carried through from the landing page and
  // forwarded to every subsequent prototype + the closing Tally form.
  const studyId = params.get('study_id') ?? '';
  const sessionId = params.get('session_id') ?? '';

  const pairIndex = Math.floor(step / VARIANTS.length);
  const variantIndex = step % VARIANTS.length;
  const pair = order[pairIndex];
  const variant: Variant = VARIANTS[variantIndex];

  // Every pair now has exactly 3 variants, so "last variant" is always
  // onehandmode — the preference question is only ever a single 3-way ask.
  const isLastVariant = variantIndex === VARIANTS.length - 1;
  const preferenceStep: 'skip' | 'ask' = isLastVariant ? 'ask' : 'skip';

  return { pid, order, step, grip, pair, variant, preferenceStep, studyId, sessionId };
}

export function nextUrl(ctx: ReturnType<typeof getContext>) {
  const totalSteps = PAIRS.length * VARIANTS.length; // 12
  const nextStep = ctx.step + 1;
  const prolificSuffix = `&study_id=${encodeURIComponent(ctx.studyId)}&session_id=${encodeURIComponent(ctx.sessionId)}`;

  if (nextStep >= totalSteps) {
    // TODO: swap in the duplicated closing-survey form URL for the Prolific copy.
    return `https://tally.so/r/RGyEKQ?pid=${ctx.pid}&grip=${ctx.grip}${prolificSuffix}`;
  }

  const nextPairIndex = Math.floor(nextStep / VARIANTS.length);
  const nextVariantIndex = nextStep % VARIANTS.length;
  const nextPair = ctx.order[nextPairIndex];
  const nextVariant = VARIANTS[nextVariantIndex];

  const key = `${nextPair}_${nextVariant}`;
  const base = PROTOTYPE_URLS[key];
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}pid=${ctx.pid}&order=${ctx.order.join(',')}&step=${nextStep}&grip=${ctx.grip}${prolificSuffix}`;
}