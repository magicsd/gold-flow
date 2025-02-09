export type PortfolioItem = {
    id: string;
    name: string;
    amount: number;
    children: PortfolioItem[];
};
