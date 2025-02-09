export type PortfolioItem = {
    id: string;
    name: string;
    amount: number;
    percentage?: number;
    children: PortfolioItem[];
};
