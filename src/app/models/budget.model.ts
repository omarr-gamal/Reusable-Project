export interface Budget {
    id?: string;
    progress?: number;
    name: string;
    description: string;
    amount: number;
}

export const budgetOther = {
  name: "Other",
  description: "Other",
  amount: 0
}