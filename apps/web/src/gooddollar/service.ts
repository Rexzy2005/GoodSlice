export interface GoodDollarService {
  availability: { status: 'blocked'; reason: string };
}
export const goodDollar: GoodDollarService = {
  availability: { status: 'blocked', reason: 'Identity verification and daily G$ claims are not available yet. The supported verification flow and environment must be confirmed first.' },
};
