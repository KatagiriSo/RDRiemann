export type OpeType = "Add" | "Prod" | "Symbol" | "Diff"

export interface Ope {
    id: OpeType;
    targets: Ope[];
}