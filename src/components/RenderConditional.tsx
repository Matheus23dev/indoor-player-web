interface RenderConditionalProps {
    condition: boolean;
    children: React.ReactNode;
}
export function RenderConditional({ condition, children } : RenderConditionalProps) {
    return condition ? children : null;
}